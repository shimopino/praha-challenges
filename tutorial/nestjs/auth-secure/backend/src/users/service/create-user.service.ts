import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RegisterUserDTO } from '../../auth/controller/request/register-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CreateUserService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(user: RegisterUserDTO) {
    return await this.prisma.user.create({
      data: {
        id: nanoid(),
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }
}
