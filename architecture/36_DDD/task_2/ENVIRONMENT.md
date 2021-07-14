# 環境構築

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境構築](#環境構築)
  - [Node.js](#nodejs)
  - [Nestjs](#nestjs)
  - [Prisma](#prisma)
  - [DBスキーマ設定](#dbスキーマ設定)
  - [型安全なCRUD操作](#型安全なcrud操作)
  - [Prisma Client](#prisma-client)
  - [Controller によるルーティング](#controller-によるルーティング)
  - [Module設定の変更](#module設定の変更)
  - [テスト用の環境構築](#テスト用の環境構築)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Node.js

[https://github.com/tj/n](https://github.com/tj/n) で提供されいてる `Node.js` のバージョン管理ツールを使用した。

```bash
# nodejs は n をインストールする際に使用した後は削除する
sudo apt install nodejs npm
sudo npm install -g n
sudo n lts
sudo apt purge nodejs npm
```

これで導入した環境は以下になる。

```bash
n --version     # 7.3.0
node --version  # v14.17.3
npm --version   # 6.14.13
```

## Nestjs

Nestjs が提供している [Installation](https://docs.nestjs.com/) に従ってプロジェクトを初期化する。

```bash
sudo npm install -g @nestjs/cli
nest new task_2
```

これでテストの設定やビルドの設定、初期のコントローラーなどが設定済みの Nestjs のプロジェクトが作成される。

```bash
├── README.md
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

## Prisma

Nestjs が公式が提供している Prisma の [導入資料](https://docs.nestjs.com/recipes/prisma) を参考にする。

```bash
# Prisma CLI を導入する
npm install prisma --save-dev

# 事前に CLI を起動しておく
npx prisma

# Prisma の設定を初期化する
npx prisma init
```

これで下記の設定ファイルが自動的に作成される。

```js
// 1. `.env` ファイルの DATABASE_URL に接続先情報を指定する
// 2. datasource の provider に下記を設定する
//     - `postgresql, mysql, sqlserver, sqlite`
// 3. `prisma db pull` でDBスキーマから Prisma データもモデルを作成
// 4. `prisma generate` で Prisma Client を導入する

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

DBサーバを起動せずに、`sqlite` で簡単に実験する場合以下の設定を利用する。

```js
datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
}
```

`.env` ファイルには以下を設定する。

```js
DATABASE_URL = "file:./dev.db"
```

## DBスキーマ設定

練習として下記のテーブルを Prisma Migrate で作成する。

これはDB設定を記述している `prisma.schema` に記述する。

```js
model User {
    id      Int     @default(autoincrement()) @id
    email   String  @unique
    name    String?
    posts   Post[]
}

model Post {
  id        Int      @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean? @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

これでテーブルを作成するコマンドを実行する。

```bash
npx prisma migrate dev --name init
```

これで下記のファイルが作成されていることがわかる。

```bash
prisma
├── dev.db
├── dev.db-journal
├── migrations
│   ├── 20210712214211_init
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

今回の場合は下記のSQL文が自動生成されている。

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN DEFAULT false,
    "authorId" INTEGER,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
```

外部キー制約に関しては、親テーブルに対して削除が実行された場合には対応する子テーブルを `NULL` に変更し、親テーブルに対して更新が実行された場合には対応する子テーブルのキーを更新する設定になっている。

## 型安全なCRUD操作

Prisma Client を使用することで、モデル定義から型安全な CRUD 操作を実現することが可能となる。

```bash
npm install @prisma/client
```

これで `prisma generate` が起動して、`node_modules/@prisma/client` 内に自動的にモデルに関するライブラリが生成される。

## Prisma Client

では Prisma Client を継承したサービスクラスを使用して、他のサービスクラスが型安全な CRUD 操作が可能になるようにする。

```js
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
```

あとはこのクラスを使用すれば、Prisma が提供している様々な機能にアクセスすることが可能となる。


## Controller によるルーティング

Nestjs では、`@Controller()` や `@Get()` などのアノテーションで設定する。

例えば以下は `GET /cats` というHTTPリクエストに対応している。

```js
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

## Module設定の変更

後は追加したコントローラーや依存性の注入を行うために、モジュールの設定を追加する必要がある。

これは `app.module.ts` に下記のように作成したコントローラーと `@Injectable` を設定したクラスを指定しておけばいい。

```js
@Module({
  imports: [],
  controllers: [AppController, SampleController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}
```

なおモジュール自体は以下のように別のファイルに分割することも可能である。
（コードは公式からのサンプルを使用している）

```js
// cats/cats.module.ts
// コンテキストごとにモジュールの設定をしておく
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModules {}
```

あとはこれを `main.ts` で使用している `app.module.ts` 内で読み込むようにすればいい。

```js
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

## テスト用の環境構築

テスト用にDB接続先や環境変数を管理するために、[`dotenv`](https://www.npmjs.com/package/dotenv) を使用する。

このライブラリを使用することで、`.env` の拡張子に設定されているキーと値を `process.env` に設定することが可能となる。

```bash
npm install dotenv
```

`package.json` 内の `scripts` で指定しているコマンド内でも使用できるように、[`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) をインストールする。

```bash
npm install -D dotenv-cli
```

これで例えばテスト用の環境設定で Prisma を動作させたい場合は、以下のようにコマンドを指定すればいい。

```js
// package.json
// `--` の後で実行したいコマンドを指定する
"scripts": {
  "migrate:dev": "dotenv -e .env.test -- npx prisma migrate dev",
  "migrate:dev:reset": "dotenv -e .env.test -- npx prisma migrate reset"
  "migrate:test": "dotenv -e .env.test -- npx prisma migrate reset --force",
  "migrate:prd": "prisma migrate deploy",
  "model-gerate": "prisma generate"
}
```

上記のように環境に応じて設定ファイルを分割しておく考え方は、テスティングフレームワークである `jest` でも同様であり、テストの目的に応じて設定ファイルを分割しておくと便利である。

```js
"scripts": {
  "test:unit": "dotenv -e .env.test -- jest",
  "test:integration": "npm migrate:test && dotenv -e .env.test -- jest -c ./jest.integration.config.js --runInBand"
}
```

TypeScript に関しても、`src` 内にそれぞれ `__tests__` を配置してその内部でテストを実行していくが、共通で使用することのできる関数などは、設定で同じ場所から読み込めるようにしておくと便利である。

そのため `tsconfig.json` でパスの設定を以下のようにしておけばいい。

```js
{
  "compilerOptions": {
    // ここで各ファイルの先頭で import を使用した際の mapping を追加できる
    "paths": { "@testUtil/*": ["testUtil/*"] }
  }
}
```