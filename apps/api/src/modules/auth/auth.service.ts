import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import { randomBytes } from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'
import { LoginDto, Permission, RegisterDto } from '@crm/shared'
import { InviteDto } from './dto/invite.dto'
import { AcceptInviteDto } from './dto/accept-invite.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  // ── Register (создание тенанта + admin) ──────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existing) {
      throw new ConflictException('Email уже зарегистрирован')
    }

    const hashedPassword = await argon2.hash(dto.password)

    const result = await this.prisma.$transaction(async tx => {
      // Создаём тенант
      const tenant = await tx.tenant.create({
        data: { name: dto.companyName },
      })

      // Создаём роль Admin со всеми правами
      const allPermissions = Object.values(Permission)
      const adminRole = await tx.role.create({
        data: {
          name: 'Администратор',
          permissions: allPermissions,
          tenantId: tenant.id,
        },
      })

      // Создаём пользователя
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          tenantId: tenant.id,
        },
      })

      // Привязываем роль
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      })

      return { user, tenant }
    })

    const tokens = await this.generateTokens(
      result.user.id,
      result.user.tenantId
    )

    return {
      user: this.sanitizeUser(result.user),
      tenant: result.tenant,
      ...tokens,
    }
  }

  // ── Login ────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: { role: true },
        },
        tenant: true,
      },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Неверный email или пароль')
    }

    const valid = await argon2.verify(user.password, dto.password)
    if (!valid) {
      throw new UnauthorizedException('Неверный email или пароль')
    }

    const tokens = await this.generateTokens(user.id, user.tenantId)
    const permissions = this.extractPermissions(user.userRoles)

    return {
      user: this.sanitizeUser(user),
      tenant: user.tenant,
      permissions,
      ...tokens,
    }
  }

  // ── Refresh ──────────────────────────────────────

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token отсутствует')
    }

    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      })

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userRoles: { include: { role: true } },
          tenant: true,
        },
      })

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Пользователь не найден')
      }

      const tokens = await this.generateTokens(user.id, user.tenantId)
      const permissions = this.extractPermissions(user.userRoles)

      return {
        user: this.sanitizeUser(user),
        tenant: user.tenant,
        permissions,
        ...tokens,
      }
    } catch {
      throw new UnauthorizedException('Невалидный refresh token')
    }
  }

  // ── Invite ───────────────────────────────────────

  async createInvite(dto: InviteDto, userId: string, tenantId: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует')
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней

    const invite = await this.prisma.invite.create({
      data: {
        email: dto.email,
        token,
        tenantId,
        roleId: dto.roleId || null,
        invitedBy: userId,
        expiresAt,
      },
    })

    return {
      inviteId: invite.id,
      token: invite.token,
      expiresAt: invite.expiresAt,
    }
  }

  // ── Accept Invite ────────────────────────────────

  async acceptInvite(token: string, dto: AcceptInviteDto) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new BadRequestException('Приглашение не найдено')
    }
    if (invite.usedAt) {
      throw new BadRequestException('Приглашение уже использовано')
    }
    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Приглашение истекло')
    }

    const hashedPassword = await argon2.hash(dto.password)

    const result = await this.prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email: invite.email,
          password: hashedPassword,
          name: dto.name,
          tenantId: invite.tenantId,
        },
      })

      // Если в приглашении указана роль — привязываем
      if (invite.roleId) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: invite.roleId,
          },
        })
      }

      // Помечаем приглашение использованным
      await tx.invite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      })

      return user
    })

    const tokens = await this.generateTokens(result.id, result.tenantId)

    return {
      user: this.sanitizeUser(result),
      ...tokens,
    }
  }

  // ── Get current user (для /auth/me) ─────────────

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        tenant: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }

    const permissions = this.extractPermissions(user.userRoles)

    return {
      user: this.sanitizeUser(user),
      tenant: user.tenant,
      permissions,
    }
  }

  // ── Helpers ──────────────────────────────────────

  private async generateTokens(userId: string, tenantId: string) {
    const payload = { sub: userId, tenantId }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ])

    return { accessToken, refreshToken }
  }

  private extractPermissions(
    userRoles: Array<{ role: { permissions: unknown } }>
  ): string[] {
    const perms = new Set<string>()
    for (const ur of userRoles) {
      const rolePermissions = ur.role.permissions
      if (Array.isArray(rolePermissions)) {
        for (const p of rolePermissions) {
          if (typeof p === 'string') {
            perms.add(p)
          }
        }
      }
    }
    return [...perms]
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user
    return rest
  }
}
