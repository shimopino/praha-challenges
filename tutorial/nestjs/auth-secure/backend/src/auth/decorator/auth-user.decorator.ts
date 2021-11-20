import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUserType } from '../controller/response/auth-user.response';

export const AuthUser = createParamDecorator(
  (data: keyof AuthUserType, context: ExecutionContext) => {
    const res = context.switchToHttp().getRequest<Request>();
    return res.user as AuthUserType;
  },
);
