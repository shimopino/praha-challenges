import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthUserType } from '../controller/response/auth-user.response';
import { SignAccessTokenService } from '../service/sign-access-token.service';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
  constructor(private readonly signJwt: SignAccessTokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<AuthUserType>,
  ): Observable<AuthUserType> | Promise<Observable<AuthUserType>> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.signJwt.execute(user);

        response.cookie('access_token', token, {
          httpOnly: true,
          signed: false,
          sameSite: 'none',
          secure: false,
        });

        return user;
      }),
    );
  }
}
