import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Prisma では `where` という型がいくつか自動生成される。
   * UserWhereUniqueInputでは、入力値として受け取った値に
   * @id や @unique で指定した一意な値が入っていることを保証
   */
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    /**
     * Prisma はいくつかデフォルトのメソッドを提供しており
     * メソッドによっては必須のフィールドが存在している。
     *
     * findUnique()の場合には、UserWhereUniqueInputの
     * 指定が必須条件となっている。
     */
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  /**
   * 複数のリソースを取得する際には、引数で条件を指定する
   *
   * skip: 最初の n ユーザーは省略する
   * take: cursor の位置から前後 n 分のユーザーを取得する
   * cursor: List の中からユーザーを指定する条件
   * where: ユーザーをフィルタリングする際の条件
   * orderBy: 並び替えの条件
   */
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
