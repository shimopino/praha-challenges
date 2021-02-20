# API 仕様

<!-- START doctoc -->
<!-- END doctoc -->

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
