import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * https://www.prisma.io/docs/concepts/components/prisma-client/crud#delete
   */
  async truncate() {
    for (const { tablename } of await this
      .$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.$queryRaw(
            `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }
  }

  /**
   * https://stackoverflow.com/questions/1493262/list-all-sequences-in-a-postgres-db-8-1-with-sql
   * https://stackoverflow.com/questions/4678110/how-to-reset-sequence-in-postgres-and-fill-id-column-with-new-data
   */
  async resetSequences() {
    for (const { sequence_name } of await this
      .$queryRaw`SELECT c.relname sequence_name FROM pg_class c WHERE c.relkind = 'S'`) {
      try {
        await this.$queryRaw(`ALTER SEQUENCE ${sequence_name} RESTART WITH 1;`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
}
