# API 仕様

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [概要](#%E6%A6%82%E8%A6%81)
- [ファイル構成](#%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E6%A7%8B%E6%88%90)
- [APIのテスト](#api%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概要

| API 一覧 |
| :------- |

| メソッド | URL            | 内容                       |
| -------- | -------------- | -------------------------- |
| GET      | /users         | ユーザ一覧を取得する       |
| POST     | /users         | 新規ユーザを登録する       |
| GET      | /users/:userId | 特定のユーザ情報を取得する |
| PATCH    | /users/:userId | 特定のユーザ情報を変更する |
| DELETE   | /users/:userId | 特定のユーザ情報を削除する |

| データ構造 |
| :--------- |

| プロパティ      | 型     | 補足                |
| --------------- | ------ | ------------------- |
| id              | string | 自動生成される UUID |
| email           | string |                     |
| password        | string |                     |
| firstName       | string | Optional            |
| lastName        | string | Optional            |
| permissionLevel | number | Optional            |

## ファイル構成

```bash
src
├── app.ts                      # エントリポイント
├── common
│   ├── common.routes.config.ts # どのリソースに対しても共通なルーティングを提供
│   └── interfaces
│       └── crud.interface.ts   # CRUD操作に関するインターフェースを提供
└── users
    ├── controllers
    │   └── users.controller.ts # リクエストを受けてレスポンスを返す処理を提供
    ├── daos
    │   └── users.dao.ts        # リソースに対するCRUD操作を提供
    ├── dto
    │   └── user.model.ts       # リソースに対するデータモデリングを定義
    ├── middleware
    │   └── users.middleware.ts # 2重登録の防止などや入力値の検証処理を提供
    ├── services
    │   └── users.service.ts    # リソースに対するビジネスロジックを提供
    └── users.routes.config.ts  # 各APIへのエンドポイントとハンドラを紐づけ
```

## APIのテスト

[request.http](./request.http) にテスト用のHTTPリクエストを定義しています。

こちらで定義されているメソッドを使用すれば、このディレクトリで構築しているAPIのおおよその挙動が理解できると思います。
