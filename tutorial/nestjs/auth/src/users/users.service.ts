import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/utils/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(userData: CreateUserDTO) {
    const user = await this.prisma.user.create({
      data: {
        id: nanoid(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    });

    delete user.password;

    return user;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'メールアドレスに該当するユーザーは存在しません。',
      );
    }

    return user;
  }
}
