import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthUserType } from '../controller/response/auth-user.response';
import { LoginUserService } from '../service/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly login: LoginUserService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
    });
  }

  validate(email: string, password: string): Promise<AuthUserType> {
    console.log('local Strategy validate called');
    return this.login.execute(email, password);
  }
}
