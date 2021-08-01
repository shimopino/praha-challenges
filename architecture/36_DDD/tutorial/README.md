# Nestjs & Prisma Tutorial

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [概要](#%E6%A6%82%E8%A6%81)
- [サンプルアプリの全体像](#%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E5%85%A8%E4%BD%93%E5%83%8F)
- [開発環境の構築](#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83%E3%81%AE%E6%A7%8B%E7%AF%89)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概要

公式から提供されている [サンプルアプリ](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nestjs) を題材にして、Nestjs や Prisma を使った開発をどのように進めればいいのか検証していく。

## サンプルアプリの全体像

このアプリは、ユーザーが記事を投稿でき、提供されているAPIリクエストは以下になる。

| エンドポイント      | HTTPメソッド | 概要                                                                                                                                                                                                                                                                               |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/post`             | POST         | 記事を投稿する<br><br>HTTPボディ<br>- [Optional] `title: String`<br>- [Optional] `content: String`<br>- [Required] `authorEmail: String`                                                                                                                                           |
| `/post/:id`         | GET          | 特定の `id` の記事を取得する                                                                                                                                                                                                                                                       |
| `/post/:id`         | DELETE       | 特定の `id` の記事を削除する                                                                                                                                                                                                                                                       |
| `/post/:id/views`   | PUT          | 特定の `id` の記事の閲覧回数を1増やす                                                                                                                                                                                                                                              |
| `/users`            | GET          | 全てのユーザーを取得する                                                                                                                                                                                                                                                           |
| `/user/:id/drafts`  | GET          | 特定の `id` のユーザーの下書き記事を取得する                                                                                                                                                                                                                                       |
| `/user/:id/profile` | POST         | 特定の `id` のユーザーを元にプロフィールを作成する<br><br>HTTPボディ<br>- `bio: String`                                                                                                                                                                                            |
| `/publish/:id`      | PUT          | 特定の `id` の記事の公開状態を切り替える                                                                                                                                                                                                                                           |
| `/feed`             | GET          | 公開状態の記事をすべて取得する<br><br>クエリ文字列<br>- `searchString`<br>    `title` や `content` でフィルタリングする<br>- `take`<br>    取得する記事の数を指定する<br>- `skip`<br>    スキップする記事の数を指定する<br>- `orderBy`<br>    昇順 `asc` か 降順 `desc` を指定する |
| `/signup`           | POST         | 新しいユーザーを作成する<br><br>HTTPボディ<br>- [Required] `email: String`<br>- [Optional] `content: String`<br>- [Optional] `postDate: PostCreateInput[]`                                                                                                                         |

使用しているデータモデリングは以下になる。

```js
// ./prisma/schema.prisma

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
  profile Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model Profile {
  id     Int     @default(autoincrement()) @id
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}
```

また開発には、Postgres を採用している。

## 開発環境の構築

- DB環境
  - 開発とテストで使用するDBを分ける
    - 開発用はポート番号 `5403`
    - テスト用はポート番号 `5402`
  - ユーザー名 (`root`) とパスワード (`prisma2020`) は共通
- テスト環境
  - 単体テストと結合テストを行う
    - 単体テストは `src` 以下の `__tests__` フォルダ内で実装する
    - 結合テストは `test` フォルダ内で実装する
  - 上記に合わせて個別にテストの設定をする必要がある
    - 共通設定 (`jest.common.config.js`) を作成する
    - 単体テスト設定 (`jest.unittest.config.js`) を作成する
    - 結合テスト設定 (`jest.integration.config.js`) を作成する
    - それぞれ `jest -c <config file path>` で指定する
    - `runInBand` を指定することで、シングルプロセスで稼働させることで、複数のスレッドを処理するためのメモリと時間を費やす必要がなくなり、高速化されることもある
      - [Why does Jest --runInBand speed up tests?](https://stackoverflow.com/questions/43864793/why-does-jest-runinband-speed-up-tests)
― 環境変数管理
  - [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) を使用してコマンドで環境変数を切り替える
  - `dotenv -e <.env> -- <command>`
    - 開発用の環境変数 `.env.dev` を作成する
    - テスト用の環境変数 `.env.test` を作成する

上記を考慮して `package.json` を編集する。

```js
{
  // ...
  "script": {
    // 開発用サーバーを起動する
    "dev": "dotenv -e .env.dev -- nest start --watch",
    // DB環境を構築する
    "migrate:dev": "dotenv -e .env.dev -- prisma migrate dev --preview-feature",
    "migrate:dev:reset": "dotenv -e .env.dev -- prisma migrate reset --preview-feature",
    "migrate:test": "dotenv -e .env.test -- prisma migrate reset --force --preview-feature",
    // 単体テスト環境を構築する
    "test:unit": "dotenv -e .env.test -- jest -c ./jest.unittest.config.js",
    // 結合テスト環境を構築する
    "test:integration": "dotenv -e .env.test -- jest -c ./jest.integration.config.js --runInBand"
  }
}
```

これでコンテナを立ち上げた状態で開発を進めていくことができる。

なお開発時に DB に登録されている内容を確認するために、[`Prisma Studio`](https://www.prisma.io/studio) を設定しておく。

```js
{
  "scripts": {
    "studio:dev": "dotenv -e .env.dev -- prisma studio",
    "studio:test": "dotenv -e .env.test -- prisma studio",
  }
}
```

これでコマンドを実行すれば、DB に登録されているデータをブラウザ上で確認することができる。
