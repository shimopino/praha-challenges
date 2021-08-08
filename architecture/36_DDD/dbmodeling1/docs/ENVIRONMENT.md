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
