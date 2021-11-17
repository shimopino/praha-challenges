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
import { SignRefreshTokenService } from '../service/sign-refresh-token.service';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly signJwt: SignRefreshTokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<AuthUserType>,
  ): Observable<Promise<AuthUserType>> {
    return next.handle().pipe(
      map(async (user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = await this.signJwt.execute(user);

        console.log(token);

        response.cookie('refresh_token', token, {
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
