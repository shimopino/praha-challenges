import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * @Injectable()をつけることで、PrismaServiceクラスが
 * Nestが提供するDIコンテナの管理対象であることを明示する
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * onModuleInit()フックは、ホストモジュールの依存関係が
   * 解決されると呼びだされる、アプリケーションを初期化する
   * 際に使用するライフサイクルメソッドである
   *
   * ここでは初期化時に Prisma に接続するようにしている
   */
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    /**
     * prisma.$on('beforeExit', () => ...)では、
     * Prisma におけるシャットダウンイベントに該当する
     *
     * https://github.com/prisma/prisma/issues/2917#issuecomment-708340112
     */
    this.$on('beforeExit', async () => {
      /**
       * シャットダウンイベント内で、アプリケーションを終了
       */
      await app.close();
    });
  }
}
