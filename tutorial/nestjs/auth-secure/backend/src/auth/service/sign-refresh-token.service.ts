import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UpdateRefreshTokenService } from '../../users/service/update-refresh-token.service';
import { AuthUserType } from '../controller/response/auth-user.response';

@Injectable()
export class SignRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly updateRefreshToken: UpdateRefreshTokenService,
  ) {}

  public async execute(user: AuthUserType) {
    const payload = { sub: user.email };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const updatedUser = await this.updateRefreshToken.execute(
      user.email,
      refreshToken,
    );

    return updatedUser.refreshToken;
  }
}
