/// <reference path="../../types/fastify-cookie.d.ts" />
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from '@crm/shared'
import { AcceptInviteDto } from './dto/accept-invite.dto'
import { InviteDto } from './dto/invite.dto'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { RequirePermissions } from 'src/common/decorators/permissions.decorator'
import { JwtAuthGuard } from 'src/common/decorators/jwt-auth.guard'
import { PermissionsGuard } from 'src/common/decorators/permissions.guard'

const REFRESH_COOKIE = 'refresh_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const result = await this.authService.register(dto)
    res.setCookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    return {
      user: result.user,
      tenant: result.tenant,
      accessToken: result.accessToken,
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const result = await this.authService.login(dto)
    res.setCookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    return {
      user: result.user,
      tenant: result.tenant,
      permissions: result.permissions,
      accessToken: result.accessToken,
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const token = req.cookies[REFRESH_COOKIE]
    if (!token) {
      throw new UnauthorizedException('Refresh token отсутствует')
    }
    const result = await this.authService.refresh(token)
    res.setCookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    return {
      user: result.user,
      tenant: result.tenant,
      permissions: result.permissions,
      accessToken: result.accessToken,
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
    return { message: 'Выход выполнен' }
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ADMIN_USERS')
  async invite(
    @Body() dto: InviteDto,
    @CurrentUser() user: { id: string; tenantId: string }
  ) {
    return this.authService.createInvite(dto, user.id, user.tenantId)
  }

  @Post('invite/:token')
  async acceptInvite(
    @Param('token') token: string,
    @Body() dto: AcceptInviteDto,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const result = await this.authService.acceptInvite(token, dto)
    res.setCookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS)
    return {
      user: result.user,
      accessToken: result.accessToken,
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { id: string }) {
    return this.authService.getMe(user.id)
  }
}
