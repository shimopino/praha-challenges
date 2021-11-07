import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // null や　undefined の場合は falsy となる
    // つまりアクセスは拒否される
    return request.session.userId;
  }
}
