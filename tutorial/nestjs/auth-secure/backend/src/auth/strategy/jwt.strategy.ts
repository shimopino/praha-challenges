import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserType } from '../controller/response/auth-user.response';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { VerifyJwtPayloadService } from '../service/verify-payload.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly verifyJwtPayload: VerifyJwtPayloadService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): Promise<AuthUserType> {
    return this.verifyJwtPayload.execute(payload);
  }
}
