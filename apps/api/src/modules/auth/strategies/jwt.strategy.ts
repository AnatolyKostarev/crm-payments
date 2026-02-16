import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../prisma/prisma.service'

interface JwtPayload {
  sub: string
  tenantId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: { include: { role: true } },
      },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException()
    }

    const permissions = new Set<string>()
    for (const ur of user.userRoles) {
      const rolePermissions = ur.role.permissions
      if (Array.isArray(rolePermissions)) {
        for (const p of rolePermissions) {
          if (typeof p === 'string') {
            permissions.add(p)
          }
        }
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      permissions: [...permissions],
    }
  }
}
