import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindByEmailService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'メールアドレスに該当するユーザーが存在しません。',
      );
    }

    return user;
  }
}
