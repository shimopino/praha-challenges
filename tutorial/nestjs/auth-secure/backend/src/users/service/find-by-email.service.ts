import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindByEmailService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
