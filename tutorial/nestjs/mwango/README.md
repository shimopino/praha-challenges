# mwango

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [mwango](#mwango)
  - [環境設定](#環境設定)
    - [初期化](#初期化)
    - [ESLint](#eslint)
  - [#1. Controller, Service, Module](#1-controller-service-module)
    - [記事の一覧を取得する](#記事の一覧を取得する)
    - [記事を追加する](#記事を追加する)
    - [記事を編集する](#記事を編集する)

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
