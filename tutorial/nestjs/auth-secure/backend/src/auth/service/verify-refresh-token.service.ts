import { Injectable } from '@nestjs/common';
import { FindByEmailService } from '../../users/service/find-by-email.service';

@Injectable()
export class VerifyRefreshTokenService {
  constructor(private readonly findByEmail: FindByEmailService) {}

  async execute(refreshToken: string, email: string) {
    const user = await this.findByEmail.execute(email);

    const isRefreshTokenMatch = refreshToken === user.refreshToken;

    if (!isRefreshTokenMatch) {
      return null;
    }

    delete user.password;
    delete user.refreshToken;
    return user;
  }
}
