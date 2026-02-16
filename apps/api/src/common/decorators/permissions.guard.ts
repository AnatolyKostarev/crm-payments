import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()]
    )

    if (!required || required.length === 0) {
      return true
    }

    const { user } = ctx.switchToHttp().getRequest()

    if (!user?.permissions) {
      throw new ForbiddenException('Нет прав доступа')
    }

    const hasPermission = required.every(perm =>
      user.permissions.includes(perm)
    )

    if (!hasPermission) {
      throw new ForbiddenException('Недостаточно прав')
    }

    return true
  }
}
