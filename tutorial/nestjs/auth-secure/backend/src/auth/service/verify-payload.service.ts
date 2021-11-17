import { Injectable } from '@nestjs/common';
import { FindByEmailService } from '../../users/service/find-by-email.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class VerifyJwtPayloadService {
  constructor(private readonly findByEmail: FindByEmailService) {}

  async execute(payload: JwtPayload) {
    const user = await this.findByEmail.execute(payload.sub);

    delete user.password;
    delete user.refreshToken;

    return user;
  }
}
