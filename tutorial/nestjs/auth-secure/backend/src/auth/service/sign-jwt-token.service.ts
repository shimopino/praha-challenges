import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserResponse } from '../controller/response/register-user.response';

@Injectable()
export class SignJwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public execute(user: RegisterUserResponse) {
    const payload = { sub: user.params.email };
    return this.jwtService.sign(payload);
  }
}
