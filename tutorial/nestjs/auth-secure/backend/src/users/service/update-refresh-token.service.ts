import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateRefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string, refreshToken: string) {
    const user = await this.prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    if (!user) {
      throw new UnauthorizedException(
        'メールアドレスに該当するユーザーが存在しません。',
      );
    }

    return user;
  }
}
