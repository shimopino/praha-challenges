import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserType } from '../interfaces/request-user.interface';

export const AuthUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as AuthUserType;
  },
);
