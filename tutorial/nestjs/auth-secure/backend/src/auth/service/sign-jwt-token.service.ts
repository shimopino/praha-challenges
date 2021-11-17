import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserType } from '../controller/response/auth-user.response';

@Injectable()
export class SignJwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public execute(user: AuthUserType) {
    const payload = { sub: user.email };
    return this.jwtService.sign(payload);
  }
}
