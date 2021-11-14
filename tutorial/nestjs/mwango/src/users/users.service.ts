import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(user: CreateUserDTO) {
    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    return newUser;
  }

  async getById(id: number) {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { password, ...user } = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
