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
