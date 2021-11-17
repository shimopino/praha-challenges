import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUserResponse } from '../controller/response/register-user.response';
import { SignJwtTokenService } from '../service/sign-jwt-token.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly signJwt: SignJwtTokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<RegisterUserResponse>,
  ):
    | Observable<RegisterUserResponse>
    | Promise<Observable<RegisterUserResponse>> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.signJwt.execute(user);

        response.setHeader('Authorization', `Bearer ${token}`);
        response.cookie('token', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'none',
          secure: false,
        });

        return user;
      }),
    );
  }
}
