<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境構築手順](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E6%89%8B%E9%A0%86)
  - [プロジェクトのセットアップ](#%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
    - [使用するライブラリのインストール](#%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
    - [DB のセットアップ](#db-%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
    - [Prisma 関係のコマンドを追加](#prisma-%E9%96%A2%E4%BF%82%E3%81%AE%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E8%BF%BD%E5%8A%A0)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 環境構築手順

## プロジェクトのセットアップ

### 使用するライブラリのインストール

```bash
# nestのインストール
npm install -g @nestjs/cli

# DBモデリングのプロジェクトを作成
nest new dbmodeling1

# prismaのインストール
npm install --save-dev prisma

# PrismaClientのインストール
npm install @prisma/client

#  環境変数を切り替える dotenv-cli をインストール
# https://www.prisma.io/docs/concepts/more/environment-variables/using-multiple-env-files
npm install --save-dev dotenv-cli
```

### DB のセットアップ

今回は Postgres を Docker コンテナ上で使用する。

コンテナを起動するコマンドは `package.json` に追加する。

```js
{
  "scripts": {
    // https://www.prisma.io/docs/guides/testing/integration-testing
    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
  }
}
```

### Prisma 関係のコマンドを追加

Prisma で使用するコマンドを `package.json` に追加する。

```js
{
  "scripts": {
    "migrate:dev": "prisma migrate dev --preview-feature",
    "migrate:dev:reset": "prisma migrate reset --preview-feature",
    "migrate:test": "prisma migrate reset --force --preview-feature",
    "migrate:prod": "prisma migrate deploy",
    "model-generate": "prisma generate",
    "studio": "prisma studio"
  }
}
```

### 環境変数の切り替え

各種コマンドに `dotenv -e <.env file> -- <command>` を追加する

```js
{
  "scripts": {
    "migrate:dev": "dotenv -e .env.dev -- prisma migrate dev --preview-feature",
    "migrate:dev:reset": "dotenv -e .env.dev -- prisma migrate reset --preview-feature",
    "migrate:test": "dotenv -e .env.test -- prisma migrate reset --force --preview-feature",
    "migrate:prod": "prisma migrate deploy",
    "model-generate": "prisma generate",
    "studio:dev": "dotenv -e .env.dev -- prisma studio",
    "studio:test": "dotenv -e .env.test -- prisma studio",
  }
}
```

### テスト用の設定

単体テストと結合テストで使用するテスト設定を変更する。

そのために、共通的に使用する設定と、テスト環境に合わせて設定を用意する。

まずは共通設定として `jest.common.config.js` を記述する。

```js
module.exports = {
  // デフォルト設定では {"\\.[jt]sx?$": "babel-jest"}
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  // デフォルト設定では {testEnvironment: "node"}
  testEnvironment: 'node',
  // デフォルト設定では {roots: ["<rootDir>"]}
  // テストファイルを配置している場所を指定する
  roots: ['<rootDir>/src'],
  // デフォルト設定では {moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"]}
  moduleFileExtensions: ['js', 'ts'],
  // デフォルト設定では {moduleFileMapper: null}
  // import する際のファイル配置場所とファイル名のマッピングを行う
  moduleFileMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: './coverage',
};
```

次に単体テストの設定として `jest.unittest.config.json` を記述する。

```js
const defaultConfig = require('./jest.common.config');

module.exports = {
  ...defaultConfig,
  // デフォルト設定では [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
  // テストファイルの配置場所を指定する
  testMatch: ['**/__tests__/**/*.spec.[jt]s'],
  // デフォルト設定では ["/node_modules/"]
  // 結合テスト用のファイルは除外する
  testPathIgnorePatterns: ['integration'],
  // デフォルト設定では undefined
  collectCoverageFrom: ['**/*.(t|j)s'],
};
```

最後に結合テストの設定として `jest.integration.config.json` を記述する

```js
const defaultConfig = require('./jest.common.config');

module.exports = {
  ...defaultConfig,
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.e2e-spec.[jt]s'],
};
```

### テスト用のコマンドの追加

テストで使用するコマンドを `package.json` に追加する。

```js
{
  "scripts": {
    "test:unit": "dotenv -e .env.test -- jest --config=./jest.unittest.config.json",
    "test:unit:watch": "npm run test:unit --watch",
    "test:unit:cov": "npm run test:unit --coverage",
    "test:unit:reset": "npm run migrate:test && jest --config=./jest.unittest.config.json",
    "test:integration": "dotenv -e .env.test -- jest --config=./jest.integration.config.json"
    "test:integration:reset": "npm run migrate:test && jest --config=./jest.integration.config.json",
  }
}
```

データベースをリセットするためのコマンドも追加しておく。
