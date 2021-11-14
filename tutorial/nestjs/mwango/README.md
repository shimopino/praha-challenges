# mwango

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境設定](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)
  - [初期化](#%E5%88%9D%E6%9C%9F%E5%8C%96)
  - [ESLint](#eslint)
- [&#035;1. Controller, Service, Module](#1-controller-service-module)
  - [記事の一覧を取得する](#%E8%A8%98%E4%BA%8B%E3%81%AE%E4%B8%80%E8%A6%A7%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B)
  - [記事を追加する](#%E8%A8%98%E4%BA%8B%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)
  - [記事を編集する](#%E8%A8%98%E4%BA%8B%E3%82%92%E7%B7%A8%E9%9B%86%E3%81%99%E3%82%8B)
  - [記事を削除する](#%E8%A8%98%E4%BA%8B%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B)
  - [特定の記事を取得する](#%E7%89%B9%E5%AE%9A%E3%81%AE%E8%A8%98%E4%BA%8B%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B)
- [&#035;2. PostgreSQL with Prisma](#2-postgresql-with-prisma)
  - [PostgreSQL の準備](#postgresql-%E3%81%AE%E6%BA%96%E5%82%99)
  - [Prisma の追加](#prisma-%E3%81%AE%E8%BF%BD%E5%8A%A0)
  - [データモデルの作成](#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90)
  - [NestJS と Prisma の連携](#nestjs-%E3%81%A8-prisma-%E3%81%AE%E9%80%A3%E6%90%BA)
  - [CRUD 処理の書き換え](#crud-%E5%87%A6%E7%90%86%E3%81%AE%E6%9B%B8%E3%81%8D%E6%8F%9B%E3%81%88)
- [&#035;3. Authentication with bcrypt, passport, jwt, cookies](#3-authentication-with-bcrypt-passport-jwt-cookies)
  - [データモデルの準備](#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E6%BA%96%E5%82%99)
  - [ユーザーの登録と検索を追加](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E7%99%BB%E9%8C%B2%E3%81%A8%E6%A4%9C%E7%B4%A2%E3%82%92%E8%BF%BD%E5%8A%A0)
  - [パスワードの暗号化](#%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E3%81%AE%E6%9A%97%E5%8F%B7%E5%8C%96)
  - [passport.js を使用した認証処理](#passportjs-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E8%AA%8D%E8%A8%BC%E5%87%A6%E7%90%86)
  - [Guard](#guard)
  - [Json Web Tokens](#json-web-tokens)
  - [環境設定を追加](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0)
  - [トークンの生成とクライアントへの送信](#%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%81%AE%E7%94%9F%E6%88%90%E3%81%A8%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%81%B8%E3%81%AE%E9%80%81%E4%BF%A1)
  - [トークンを受け取る](#%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%92%E5%8F%97%E3%81%91%E5%8F%96%E3%82%8B)
  - [認証処理を追加](#%E8%AA%8D%E8%A8%BC%E5%87%A6%E7%90%86%E3%82%92%E8%BF%BD%E5%8A%A0)
  - [ログアウト](#%E3%83%AD%E3%82%B0%E3%82%A2%E3%82%A6%E3%83%88)
  - [ログイン検証処理](#%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E6%A4%9C%E8%A8%BC%E5%87%A6%E7%90%86)
- [&#035;4. エラー処理](#4-%E3%82%A8%E3%83%A9%E3%83%BC%E5%87%A6%E7%90%86)
  - [カスタム例外クラス](#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E4%BE%8B%E5%A4%96%E3%82%AF%E3%83%A9%E3%82%B9)
  - [Exception Filter](#exception-filter)
  - [HTTP リクエストの検証](#http-%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%AE%E6%A4%9C%E8%A8%BC)
  - [エンドポイントへの検証処理](#%E3%82%A8%E3%83%B3%E3%83%89%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E3%81%B8%E3%81%AE%E6%A4%9C%E8%A8%BC%E5%87%A6%E7%90%86)
  - [Optional 項目の追加](#optional-%E9%A0%85%E7%9B%AE%E3%81%AE%E8%BF%BD%E5%8A%A0)
- [&#035;5. Interceptors](#5-interceptors)
- [&#035;6. Dependancy Injection](#6-dependancy-injection)
- [&#035;7. Relationships](#7-relationships)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

mwango さんの [コース](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/) を実践する。

## 環境設定

### 初期化

まずは NestJS でプロジェクトを初期化する。

```bash
nest new mwango
```

なお、プロジェクトを初期化した際に生成されるファイルのうち、コントローラーやサービスに関しては不要なので削除しておく。

これで以下のようなシンプルなファイル構造が残っている。

```bash
src
├── app.module.ts
└── main.ts
```

### ESLint

次に ESLint の設定を追加する。

```bash
npm install --save-dev \
    eslint-plugin-import \
    eslint-plugin-jest \
    eslint-plugin-unused-imports
```

`.eslintrc.js` に追加する設定は、全て各ライブラリの公式サイトが推奨している設定を採用している。

## #1. Controller, Service, Module

NestJS ではクライアントから送信された HTTP リクエストを以下の流れで処理している。

![](assets/basic-arch.drawio.svg)

アプリケーション全体の設定や特定の機能に関する設定を `Module` で行い、実際に HTTP リクエストのエンドポイントと対応するハンドラーを `Controller` に記述し、内部の処理は `Service` に記述するような構造である。

ではまずはブログの記事に対する CRUD を操作を実現するためのアプリケーションを作成する。

まずは下記のように CLI を使用して対応する機能を初期化していく。

```bash
nest generate module posts
nest generate controller posts --no-spec
```

これで以下のような構造で対応するファイルが作成された。

```bash
src
├── app.module.ts
├── main.ts
└── posts
    ├── posts.controller.ts
    ├── posts.module.ts
```

### 記事の一覧を取得する

クライアントから記事の一覧を取得するためのエンドポイントとして `GET /posts` に対応するハンドラーを作成する。

```ts
@Controller('path')
export class PostsController {
  constructor() {}

  @Get()
  getAllPosts() {
    return 'hi';
  }
}
```

これでエンドポイントに対するハンドラーを作成できたので、`src/posts/requests.http` を使用して HTTP リクエストを送信すると以下のようなレスポンスが返ってきていることがわかる。

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 2
ETag: W/"2-witfkXg0JglCjW9RssWvTAveakI"
Date: Sat, 13 Nov 2021 13:45:14 GMT
Connection: close

hi
```

次に記事の一覧を取得するためのサービスクラスを作成するが、今の段階ではインメモリに直接データを保存する形式にする。

まずはサービスクラスを作成する。

```bash
nest generate service posts --no-spec
# src
# └── posts
#     └── posts.service.ts
```

これで以下の実装を追加する。

```ts
@Injectable()
export class PostsService {
  // 記事のデータはインメモリに保存する
  private posts: Post[] = [];

  getAllPosts() {
    return this.posts;
  }
}
```

この時に記事のデータ構造を `interface` として統一できるように作成しておく。

```ts
// src/posts/post.interface.ts
export interface Post {
  id: number;
  title: string;
  content: string;
}
```

これで HTTP リクエストを受け付けた後に実行したい処理を記述することができたので、コントローラー層から作成したサービスを呼び出すように実装を変更すればいい。

```ts
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }
}
```

注意点としては、NestJS が提供している DI コンテナの機能を活用するために、コントローラーが依存しているクラスを DI コンテナに登録するための設定を下記のように追加する必要がある点である。

```ts
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

これで再度 HTTP リクエストを送信すれば以下のように記事の一覧を取得できていることがわかる。

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2
ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
Date: Sat, 13 Nov 2021 13:56:36 GMT
Connection: close

[]
```

### 記事を追加する

次に記事を追加するためのエンドポイント `POST /posts` に対応するハンドラーとサービスクラスを作成する。

まずはクライアントから記事のタイトルと内容を HTTP ボディで受け取ることができるように、下記のように `@Body` アノテーションと対応する型を作成する。

```ts
@Controller('path')
export class PostsController {
  // ...

  @Post()
  createPost(@Body() body: CreatePostDTO) {
    return body;
  }
}
```

HTTP ボディの型は以下のように作成する。

```ts
// src/posts/dtos/create-post.dto.ts
export class CreatePostDTO {
  title: string;
  content: string;
}
```

これでクライアントから HTTP ボディを指定して送信すれば以下のように対応するエンドポイントから送信した値がそのまま返ってきていることがわかる。

```bash
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 65
ETag: W/"41-5CfPNfatsmynCX+Faapcv+dERTA"
Date: Sat, 13 Nov 2021 14:09:52 GMT
Connection: close

{
  "id": 1,
  "title": "チュートリアル #1",
  "content": "excellent"
}
```

あとはサービスクラスに以下のように配列に自動採番した ID と記事のデータを追加するようにすればいい。

```ts
createPost(post: CreatePostDTO) {
  const newPost = {
    id: this.posts.length + 1,
    ...post,
  };
  this.posts.push(newPost);
  return newPost;
}
```

これで記事を作成するためのエンドポイントを作成することができた。

### 記事を編集する

次に保存されている記事を編集するためのエンドポイント `PUT /posts/:id` に対応するハンドラーを作成する。

今回はエンドポイントに対して記事の ID が含まれているが、NestJS では `@Param` アノテーションを使用することで動的に変化する ID を取得することができる。

```ts
@Put(':id')
replacePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
  return this.postsService.replacePost(Number(id), body);
}
```

記事の作成時と同様に HTTP ボディに対応する型を作成する。

```ts
// src/posts/dtos/replace-post.dto.ts
export class UpdatePostDTO {
  title: string;
  content: string;
}
```

あとはインメモリに保存されている記事に対して、ID をもとに検索をした後で内容を変更する処理を作成すればいい。

```ts
replacePost(id: number, post: UpdatePostDTO) {
  const postIndex = this.posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    throw new NotFoundException('Post not found');
  }

  const newPost = { id, ...post };
  this.posts[postIndex] = newPost;
  return newPost;
}
```

これで記事の編集が可能となり、また例外処理を追加しているためエンドポイントで指定された ID に該当する記事が存在しない場合は以下のようなメッセージが返されるようになっている。

```bash
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 65
ETag: W/"41-8ILy2EHCJEew/XmB6AJG95e/11c"
Date: Sat, 13 Nov 2021 14:34:46 GMT
Connection: close

{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### 記事を削除する

次に記事を削除するためのエンドポイント `DELETE /posts/:id` に対応するハンドラーとサービスクラスを作成する。

```ts
@Delete(':id')
deletePost(@Param('id') id: string) {
  return this.postsService.deletePost(parseInt(id));
}
```

あとはサービスクラスの処理を追加すればいい。

```ts
deletePost(id: number) {
  const postIndex = this.posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    throw new NotFoundException('Post not found');
  }

  this.posts.splice(postIndex, 1)
  return id;
}
```

これで記事を削除することが可能となった。

### 特定の記事を取得する

次に指定された記事を取得するためのエンドポイント `GET /posts/:id` に対応するハンドラーを作成する。

```ts
@Get(':id')
getPostById(@Param('id') id: string) {
  return this.postsService.getPostById(parseInt(id));
}
```

次に対応するサービスクラスを作成する。

```ts
getPostById(id: number) {
  const post = this.posts.find((post) => post.id === id);
  if (!post) {
    throw new NotFoundException('Post not found');
  }

  return post;
}
```

これで特定の記事を取得することができた。

## #2. PostgreSQL with Prisma

### PostgreSQL の準備

ORM である [Prisma](https://www.prisma.io/docs/) を使用してデータを DBMS で管理するように変更する。

まずは DBMS として使用する PostgreSQL を Docker コンテナ上に用意する。

```yml
# docker.compose.yml
version: '3'
services:
  postgres:
    container_name: postgres
    image: postgres:12
    ports:
      - '3001:5432'
    volumes:
      - dev-db:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: prisma
      POSTGRES_INITDB_ARGS: '--encoding=UTF-8'
      TZ: 'Asia/Tokyo'
    networks:
      - postgres
  pgadmin:
    links:
      - postgres:postgres
    container_name: pgadmin
    image: dpage/pgadmin4
    ports:
      - '3002:80'
    volumes:
      - dev-pgadmin:/root/.pgadmin
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: prisma
      POSTGRES_INITDB_ARGS: '--encoding=UTF-8'
      TZ: 'Asia/Tokyo'
      PGADMIN_DEFAULT_EMAIL: dev@dev.com
      PGADMIN_DEFAULT_PASSWORD: dev
    networks:
      - postgres

volumes:
  dev-db:
    driver: local
  dev-pgadmin:
    driver: local

networks:
  postgres:
    driver: bridge
```

これで `package.json` に以下のコマンドを追加することで簡単にコンテナを起動・終了できるようにしておけばいい。

```js
"scripts": {
  "db:up": "docker-compose up -d --build",
  "db:down": "docker-compose down"
}
```

これであとは `http://localhost:3002` にアクセスすれば、データベースの中身に直接アクセスすることができるようになる。

### Prisma の追加

では Prisma を使用してデータモデルの作成と、データベースへのマイグレーションを実行していく。

```bash
npm install --save-dev prisma
```

これで次に初期化する。

```bash
npx prisma init
# .
# ├── prisma
# │   └── schema.prisma   # 初期のスキーマファイル
# └── .env                # 環境設定
```

ここで `.env` が作成されるが、環境変数を簡単に切り替えることができるように [公式ページで推奨されている方法](https://www.prisma.io/docs/guides/development-environment/environment-variables/using-multiple-env-files) を使用する。

```bash
npm install --save-dev dotenv-cli
```

次に以下のような環境変数を作成する。

```bash
# .env.dev
DATABASE_URL="postgresql://dev:dev@localhost:3001/prisma?schema=public"
```

あとは `package.json` に以下のように環境変数ファイルへの参照を追加すればいい。

```js
"scripts": {
  "start:dev": "dotenv -e .env.dev -- nest start --watch",
}
```

### データモデルの作成

Prisma では `schema.prisma` というファイルに独自の記法を使用してデータモデルを作成する。

```js
model Post {
  // @id で主キーとして指定
  // @default でレコード作成時のデフォルト値を指定
  // autoincrement() で自動採番を使用
  id      Int    @id @default(autoincrement())
  title   String
  content String

  @@map("post")
}
```

あとは環境変数を参照した上でデータベースに反映させるためのマイグレーションを実施する。

```js
"scripts": {
  "migrate:dev": "dotenv -e .env.dev -- prisma migrate dev"
}
```

これで下記のディレクトリにマイグレーション用の SQL ファイルが作成される。

```bash
prisma
├── migrations
│   ├── 20211113154156_init
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

これで生成された `migration.sql` を確認すると以下のテーブル生成用のコマンドが作成されていることがわかる。

```sql
-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
```

これで PgAdmin を確認すれば、以下のようにマイグレーションが実行されており、データベースの中身にもアクセスすることができていることがわかる。

![](assets/pgadmin-init.png)

PgAdmin 以外にも、下記のコマンドを使用することで直接 Docker コンテナ内にアクセスして中身を確認することも可能である。

```bash
docker container exec -it postgres psql -U dev prisma
```

### NestJS と Prisma の連携

NestJS でアプリケーションを起動・終了した際に、データベースへの接続や切断も実行できるようにするために、以下のラッパークラスを作成する。

- [公式サイト](https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services)

```ts
// src/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

`PrismaClient` はデータベースへの接続が切れた場合に接続を切るための `hooks` が用意されているため、`onModuleDestroy` を指定する必要はない。

### CRUD 処理の書き換え

では Prisma を使用して、インメモリの場合に実施していた処理を書き換える。

- [公式サイト](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

まずは記事の一覧を取得する処理と、特定の記事を検索するための処理を実装する。

```ts
async getAllPosts() {
  return await this.prisma.post.findMany();
}

async getPostById(id: number) {
  const post = await this.prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  return post;
}
```

Prisma を使用することでシンプルな API でデータベースに対してクエリを発行することが可能となる。

そのほかの更新系の API に関しても、以下のように直感的な使い勝手となっている。

```ts
async createPost(post: CreatePostDTO) {
  const newPost = await this.prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
    },
  });

  return newPost;
}

async replacePost(id: number, post: UpdatePostDTO) {
  const updatedPost = await this.prisma.post.update({
    where: { id },
    data: {
      title: post.title,
      content: post.content,
    },
  });

  if (!updatedPost) {
    throw new NotFoundException('Post not found');
  }

  return updatedPost;
}

async deletePost(id: number) {
  const deletePost = await this.prisma.post.delete({
    where: { id },
  });

  if (!deletePost) {
    throw new NotFoundException('Post not found');
  }

  return deletePost.id;
}
```

これで実際に PgAdmin を確認すればデータベースに対してアクセスできていることがわかる。

## #3. Authentication with bcrypt, passport, jwt, cookies

### データモデルの準備

認証機能を作成するために、ユーザーに関するデータモデルを作成する。この際にメールアドレスが一意であることに注意する必要がある。

```js
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  name     String
  password String

  @@map("user")
}
```

あとはマイグレーションを実行すればデータベースに反映される。

### ユーザーの登録と検索を追加

認証機能を作成するにあたって、ユーザーを作成する機能とユーザーを登録する機能を作成する必要があるため、以下のコマンドを使用して初期化を行う。

```bash
nest generate module users
nest generate service users --no-spec
```

記事の作成や検索の時と同じ手順で、以下のようにユーザーを検索するための処理とユーザーを登録するための処理を追加する。

```ts
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
}
```

あとは認証機能からユーザー機能を使用できるように、以下のように外部のモジュールにサービスクラスを出力するように設定を変更する必要がある。

```ts
@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
```

### パスワードの暗号化

パスワードをデータベースに保存する際には、平文ではなく暗号化をした上で実施する。そのために `bcrypt` ライブラリを使用する。

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

ではこのライブラリを使用してユーザーの登録処理を実装するために、まずは認証機能を実装するためのモジュール周りを作成する。

```bash
nest generate module auth
nest generate service auth --no-spec
```

ユーザーの登録に関しては、以下のようにパスワードの暗号化とユーザーモジュールを使用した登録処理を実行する。

```ts
public async register(registerUser: RegisterUserDTO) {
  const hashedPassword = await bcrypt.hash(registerUser.password, 10);

  try {
    const { password, ...createdUser } = await this.usersService.create({
      ...registerUser,
      password: hashedPassword,
    });
    return createdUser;
  } catch (error: unknown) {
    throw new InternalServerErrorException('Something went wrong');
  }
}
```

ユーザーの認証では、まずはメールアドレスでユーザーの検索を行った後で、パスワードの検証を実施する必要がある。

```ts
public async getAuthenticatedUser(email: string, plainTextPassword: string) {
  const user = await this.usersService.getByEmail(email);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(
    plainTextPassword,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new UnauthorizedException('Wrong credentials provided');
  }

  const { password, ...authenticatedUser } = user;
  return authenticatedUser;
}
```

### passport.js を使用した認証処理

公式サイトが推奨している通り、`passport.js` を使用して認証処理を実装する。

今回はさまざまな認証方法（`strategy`）の中でも、デフォルトでユーザー名とパスワードで認証を行うことのできる `passport-local` ライブラリを使用する。

```bash
npm install passport passport-local @nestjs/passport
npm install --save-dev @types/passport-local
```

特徴的な点は、以下のようにコンストラクタに認証を行うための設定を記述し、必ず設定を反映させた値を受け取ることのできる `validate` メソッドを実装する必要がある点である。

```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return this.authService.getAuthenticatedUser(email, password);
  }
}
```

### Guard

まずは認証機能を利用するためのエンドポイントと対応するハンドラーを作成する。

```ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDTO) {
    return this.authService.register(registerUser);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@AuthUser() user: AuthUserType) {
    return user;
  }
}
```

ここではログインが `POST /auth/login` であるが、ログイン成功時にはステータスコードをデフォルトの `201` ではなく、`GET` 系のステータスコードである `200` を返すようにしている。

また、`LocalAuthenticationGuard` を使用して、アノテーションを付与したハンドラーに対して、`passport-local` による認証処理を紐づけるようにしている。

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}
```

このように紐づけることで `local.strategy.ts` の `validate` メソッドを実行させ、`validate` メソッドはその返り値を、HTTP リクエストのオブジェクトである `Request` の `user` プロパティとして登録する。

あとは以下のようなデコレーターを使用してユーザーに関する情報をコントローラーで受け取ることができるようにしている。

```ts
// src/auth/decorators/auth-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserType } from '../interfaces/request-user.interface';

export const AuthUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as AuthUserType;
  },
);
```

これでユーザー登録を行った場合、以下のようにパスワードがハッシュ化させた状態で送信したユーザー情報が登録されていることがわかる。

![](assets/register.png)

これで正しいパスワードを送信すればログインが可能となり、間違ったパスワードを送信すると以下のような例外メッセージが送出されていることがわかる。

```bash
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-igSll3zhhPDhmhWUcuSX1ocgcfY"
Date: Sat, 13 Nov 2021 18:38:08 GMT
Connection: close

{
  "statusCode": 401,
  "message": "Wrong credentials provided",
  "error": "Unauthorized"
}
```

### Json Web Tokens

### 環境設定を追加

NestJS ではアプリケーションの設定に環境変数を適用するためのライブラリとして `@nestjs/config` が用意されており、環境変数が期待通りの型として適用できるのか検証するためのライブラリとして `joi` を使用する。

これでアプリケーションを起動する前に、環境変数が事前に設定した条件に沿っているのか検証することが可能となる。

```bash
npm install @nestjs/config joi
npm install --save-dev @types/joi
```

アクセストークンとして採用する JWT 周りの処理を実装するため、下記のライブラリをインストールする。

```bash
npm install @nestjs/jwt passport-jwt cookie-parser
npm install --save-dev @types/passport-jwt @types/cookie-parser
```

あとは JWT を生成・解号するための秘密キーと、JWT の有効期限を環境変数として設定すればいい。

```ts
// src/app.module.ts

@Module({
  imports: [
    PostsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
```

環境設定ファイルにも該当する環境変数を登録しておく。

```bash
# .env.dev
JWT_SECRET=dev
JWT_EXPIRATION_TIME=60
```

### トークンの生成とクライアントへの送信

生成された JWT はクッキーに格納するようにする。

そのためまずは認証モジュールに対して JWT に関する設定を追加する。

```ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

次に HTTP レスポンスに付与する Cookie の値を生成する。この際に JWT を生成する際のペイロードや、Cookie の有効期限の設定などを指定している。

```ts
public getCookieWithJwtToken(userId: number) {
  const payload: TokenPayload = { userId };
  const token = this.jwtService.sign(payload);
  return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    'JWT_EXPIRATION_TIME',
  )}`;
}
```

これであとはエンドポイントの対応するハンドラーに対して Cookie の値を付与すればいい。

```ts
@HttpCode(200)
@UseGuards(LocalAuthenticationGuard)
@Post('login')
async logIn(@AuthUser() user: AuthUserType, @Res() res: Response) {
  const cookie = this.authService.getCookieWithJwtToken(user.id);
  res.setHeader('Set-Cookie', cookie);
  return user;
}
```

これでリクエストを送信すれば以下のようにサーバーから Cookie が送信されていることがわかる。

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzNjgzNDc5MywiZXhwIjoxNjM2ODM0ODUzfQ.-ZeS8ruU50L9zoPSvG4Q-zH2gSGfq9Vol_Oqu42aRAc; HttpOnly; Path=/; Max-Age=60
Content-Type: application/json; charset=utf-8
Content-Length: 59
ETag: W/"3b-XMZ6Iz2CEhwRX6baBkDk2xK/OwI"
Date: Sat, 13 Nov 2021 20:19:53 GMT
Connection: close

{
  "id": 1,
  "email": "shimopino@example.com",
  "name": "shimopino"
}
```

### トークンを受け取る

クライアントから送信された HTTP リクエストに付与されている Cookie を解析できるように、ミドルウェアを追加する必要がある。

```ts
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
```

これで Cookie 自体を解析して値を抽出することが可能となった。

しかし、JWT はそのままの値で使用するのではなく、JWT のペイロードに乗っている値を抽出し、値が改竄されていないことを検証する必要がある。

そこで以下のように `passport-jwt` を使用して解析対象の JWT が HTTP リクエストのどこに格納されているのか設定し、また、解号に使用する秘密キーを参照する設定を追加する必要がある。

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getById(payload.userId);
  }
}
```

あとは `validate` メソッドの引数に解号された JWT の値を受け取り、ユーザーを検索する処理を実行すれば、もしもユーザーが存在していた場合には、`Request` オブジェクトの `user` プロパティに検索したユーザーを登録することになる。

```ts
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
```

### 認証処理を追加

これで JWT を解析して、ユーザーが存在していた場合には後続のハンドラーの処理を実行するようにできる。

実際に以下のような `Guard` を使用して、ユーザーの検証ができた場合にのみ記事を作成することができるようにする。

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

これで記事を作成するためのハンドラーに以下のようにアノテーションを付与することで、ログインしていないユーザーが記事を作成できないようにすることができる。

```ts
@Post()
@UseGuards(JwtAuthGuard)
createPost(@Body() body: CreatePostDTO) {
  return this.postsService.createPost(body);
}
```

これでログインしていない状態で記事を作成すると以下のようなレスポンスを受け取ることになる。

```bash
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-hGShxOkieaAVDloBubJVM+h58D8"
Date: Sun, 14 Nov 2021 02:25:31 GMT
Connection: close

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### ログアウト

ログアウトをする際には Cookie に格納されている JWT を削除すればいい。

```ts
public getCookieForLogOut() {
  return `Authentication=; HttpOnly; Path=; Max-Age=0`;
}
```

これで対応するハンドラーから上記の処理を呼び出してクライアントの Cookie としてレスポンスを返せばいい。

```ts
@UseGuards(JwtAuthGuard)
@Post('logout')
async logOut(@AuthUser() user: AuthUserType, @Res() res: Response) {
  res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  return res.sendStatus(200);
}
```

### ログイン検証処理

クライアントがログインしているのか検証できるようにするために、クライアントからのリクエストを受けてユーザーがログイン状態なのかレスポンスとして返すようにしておくと便利である。

```ts
@UseGuards(JwtAuthGuard)
@Get()
auth(@AuthUser() user: AuthUserType) {
  return user;
}
```

## #4. エラー処理

### カスタム例外クラス

NestJS では `exception filter` を使用することで、例外処理を明示的に記述していない例外が発生した場合に、共通処理としてフォーマットなどを整えたりすることができる。

NestJS は以下の共通クラスを用意している。

```ts
export class BaseExceptionFilter<T = any> implements ExceptionFilter<T> {
  // ...
  catch(exception: T, host: ArgumentsHost) {
    // ...
    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host, applicationRef);
    }
    const res = exception.getResponse();
    const message = isObject(res)
      ? res
      : {
          statusCode: exception.getStatus(),
          message: res,
        };
    // ...
  }

  public handleUnknownError(
    exception: T,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const body = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
    };
    // ...
  }
}
```

ここからわかる点は NestJS は、`HttpException` クラスとその継承クラスを使用することを想定しており、それ以外の例外クラスをクライアントに送出しようとすると `InternalServerException` を返すような設定になっている。

また共通のプロパティとしてステータスコードとエラーメッセージが用意されていることがわかる。

独自の例外型を作成したい場合は、以下のように `HttpException` クラスを継承した上で、独自のメッセージをコンストラクタに指定すればいい。

```ts
// posts/exception/post-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Post with id ${postId} not found`);
  }
}
```

### Exception Filter

NestJS では、送出された例外をキャッチして共通処理を追加することができる。

そのためには `@Catch` アノテーションを使用して、どの例外を対象とするのか指定することができる。

```ts
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception thrown', exception);
    super.catch(exception, host);
  }
}
```

この例外処理をキャッチするためのフィルターをアプリケーションに対して設定する方法としては以下の 3 つの方法が存在している。

1. アプリケーション全体に適用する

   ```ts
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     const { httpAdapter } = app.get(HttpAdapterHost);
     app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

     app.use(cookieParser());
     await app.listen(3000);
   }
   ```

2. モジュール全体に設定する

   ```ts
   @Module({
     // ...
     providers: [
       {
         provide: APP_FILTER,
         useClass: ExceptionsLoggerFilter,
       },
     ],
   })
   export class AppModule {}
   ```

3. ハンドラーに設定する

   ```ts
   @Get(':id')
   @UseFilters(ExceptionsLoggerFilter)
   getPostById(@Param('id') id: string) {
     return this.postsService.getPostById(parseInt(id))
   }
   ```

### HTTP リクエストの検証

NestJS では備え付けの `pipe` を使用することで、HTTP リクエストの検証処理を追加することができる。

そのためにはまずは検証のための設定を追加する。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
```

これで以下のライブラリを追加して検証処理を記述することができるようになる。

```bash
npm install class-validator class-transformer
```

例えばユーザー登録時の DTO に以下のような条件を付与することができる。

```ts
// src/auth/dtos/register-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
```

これで例えばパスワードを少ない文字列で送信した場合は以下のようなエラーメッセージが返される。

```bash
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-4CfYpZ8dcBbxNsp68eDggEmmWvY"
Date: Sun, 14 Nov 2021 03:31:59 GMT
Connection: close

{
  "statusCode": 400,
  "message": [
    "password must be longer than or equal to 7 characters"
  ],
  "error": "Bad Request"
}
```

### エンドポイントへの検証処理

エンドポイントに対する ID なども検証処理を追加することができる。

例えばエンドポイントに ID が含まれている場合には以下のクラスを用意する。

```ts
import { IsNumberString } from 'class-validator';

export class FindOneParam {
  @IsNumberString()
  id: string;
}
```

こうすることで `@Param('id')` のように明示的に ID を指定する必要がなくなる。

```ts
@Get(':id')
getPostById(@Param() { id }: FindOneParam) {
  return this.postsService.getPostById(parseInt(id));
}
```

### Optional 項目の追加

`ValidationPipe` の設定を変更することで任意の項目は検証処理をスキップすることができるようになる。

```ts
app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
```

これで以下のように `@IsOptional` アノテーションを付与すれば、任意項目となり値が設定されている場合にのみ検証を実行することができる。

```ts
// src/posts/dtos/replace-post.dto.ts
export class UpdatePostDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}
```

## #5. Interceptors

NestJS が提供しているインターセプターでは、HTTP レスポンスや HTTP リクエストに対して任意の処理を挟み込むことができる。

例えばユーザーの登録やログイン成功時に Cookie に JWT を付与する処理は、インターセプターで共通化することができる。

```ts
@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      map((user) => {
        const res = context.switchToHttp().getResponse<Response>();
        const token = this.authService.signToken(user);

        res.cookie('Authentication', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });

        return user;
      }),
    );
  }
}
```

あとはハンドラーに対してインターセプターを登録すれば、上記の処理を HTTP レスポンスオブジェクトに対して実行することができる。

```ts
@UseInterceptors(TokenInterceptor)
async login(@AuthUser() user: AuthUserType) {
  return user;
}
```

## #6. Dependancy Injection

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ...
}
```

```ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

## #7. Relationships
