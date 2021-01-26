# 課題 3 CORS の実装

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [How to Reproduce](#how-to-reproduce)
- [Project settings](#project-settings)
  - [&#035;1 VSCode の Remote Container で環境を立ち上げる](#1-vscode-%E3%81%AE-remote-container-%E3%81%A7%E7%92%B0%E5%A2%83%E3%82%92%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92%E3%82%8B)
  - [&#035;2 プロジェクトを初期化する](#2-%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E5%88%9D%E6%9C%9F%E5%8C%96%E3%81%99%E3%82%8B)
  - [&#035;3 CORS を実装するためのライブラリをインストールする](#3-cors-%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B)
  - [&#035;4 TypeScript と ESLint をインストールする](#4-typescript-%E3%81%A8-eslint-%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B)
  - [&#035;5 ESlint を初期化する](#5-eslint-%E3%82%92%E5%88%9D%E6%9C%9F%E5%8C%96%E3%81%99%E3%82%8B)
  - [#6 `.eslintignore` を設定する](#6-eslintignore-%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)
  - [&#035;7 Prettier を設定する](#7-prettier-%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)
  - [&#035;8 ESLint に Prettier の設定を追加する。](#8-eslint-%E3%81%AB-prettier-%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)
  - [#9 `.prettierrc` の設定を追加する](#9-prettierrc-%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)
  - [&#035;10 VSCode 用の設定を追加する](#10-vscode-%E7%94%A8%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)
  - [&#035;11 TypeScript の設定を初期化する](#11-typescript-%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E5%88%9D%E6%9C%9F%E5%8C%96%E3%81%99%E3%82%8B)
  - [&#035;12 node と express 用の型を導入する](#12-node-%E3%81%A8-express-%E7%94%A8%E3%81%AE%E5%9E%8B%E3%82%92%E5%B0%8E%E5%85%A5%E3%81%99%E3%82%8B)
  - [#13 `package.json` の設定を行う](#13-packagejson-%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%A1%8C%E3%81%86)
  - [#14 `.eslintrc.json` に独自ルールを追加する](#14-eslintrcjson-%E3%81%AB%E7%8B%AC%E8%87%AA%E3%83%AB%E3%83%BC%E3%83%AB%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)
  - [#15 `.editorCondig` を設定する](#15-editorcondig-%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to Reproduce

1. このフォルダを clone
2. `yarn` でパッケージをインストールする
3. `yarn run dev` でサーバを起動する
4. `http://localhost:8090` にアクセスする

- 単純なリクエストを送信し、レスポンスが 1 件返ってきていることを確認する
- プリフライトリクエストを送信し、レスポンスが 2 件返って来ていることを確認する
  - ステータスコードが `204` の場合がプリフライトリクエスト
  - ステータスコードが `201` の場合が本来のリクエスト

5. `http://localhost:8091` にアクセスする

- 単純なリクエストを送信し、CORS ポリシーによってアクセスが拒否されることを確認する
- プリフライトリクエストを送信し、CORS ポリシーによってアクセスが拒否されることを確認する

## Project settings

今回の実装では、TypeScript や ESLint を導入した。

その際の手順を残しておく。

なお [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) に従っている。

そのほかの Linting 関係の資料集

- [TSLint Migration Guide](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md)
- [ESLint Command Line Interface](https://eslint.org/docs/user-guide/command-line-interface)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

### #1 VSCode の Remote Container で環境を立ち上げる

デフォルトで選択することが可能な node をバージョン 14 で立ち上げる。

```docker
# 使用するDockerfileは以下になる
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}
```

バージョンを確認すると以下になるはず。

```bash
$ node --version
v14.15.2
$ npm --version
6.14.9
```

このとき Docker コンテナを立ち上げる際の設定は以下になる。

```javascript
// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.155.1/containers/javascript-node
{
  "name": "Node.js",
  "build": {
    "dockerfile": "../Dockerfile",
    // Update 'VARIANT' to pick a Node version: 10, 12, 14
    "args": { "VARIANT": "14" }
  },

  // Set *default* container specific settings.json values on container create.
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash"
  },

  // Add the IDs of extensions you want installed when the container is created.
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "hediet.vscode-drawio",
    "humao.rest-client",
    "coenraads.bracket-pair-colorizer",
    "editorconfig.editorconfig"
  ],

  // Use 'forwardPorts' to make a list of ports inside the container available locally.
  // "forwardPorts": [],

  "appPort": [8080, 8090, 8091],

  // Use 'postCreateCommand' to run commands after the container is created.
  // "postCreateCommand": "yarn install",

  // Comment out connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
  "remoteUser": "node"
}
```

---

### #2 プロジェクトを初期化する

パッケージマネージャの`yarn`を使用する。

```bash
$ yarn init -y
```

---

### #3 CORS を実装するためのライブラリをインストールする

```bash
$ yarn add express
$ yarn add -D nodemon
```

---

### #4 TypeScript と ESLint をインストールする

公式にしたがって ESLint をインストールする。

```bash
$ yarn add -D eslint typescript @typescript-eslint/{parser,eslint-plugin}
```

- [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)

---

### #5 ESlint を初期化する

`.eslintrc.json`の設定を行う。

```javascript
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
}
```

### #6 `.eslintignore` を設定する

```javascript
# don't ever lint node_modules
node_modules
# don't lint build output (make sure it's set to your correct build folder name)
dist
# don't lint nyc coverage output
coverage
```

### #7 Prettier を設定する

```bash
$ yarn add -D prettier eslint-config-prettier
```

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

### #8 ESLint に Prettier の設定を追加する。

以下の順番で追加する必要があるので注意。

```javascript
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // add
    "prettier/@typescript-eslint" // add
  ]
}
```

### #9 `.prettierrc` の設定を追加する

これはお好みで設定する。

```javascript
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "arrowParens": "always"
}
```

- [https://prettier.io/docs/en/options.html](https://prettier.io/docs/en/options.html)

### #10 VSCode 用の設定を追加する

`.vscode/settins.json`に以下の設定を追加する。

```javascript
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### #11 TypeScript の設定を初期化する

```bash
$ yarn run tsc --init
```

設定は以下を採用した。

```javascript
{
  "compilerOptions": {
    "target": "ESNEXT",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig)

### #12 node と express 用の型を導入する

```bash
$ yarn add -D @types/node @types/express
```

### #13 `package.json` の設定を行う

`scripts` に以下を追加する。

```javascript
{
  "name": "cors",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon dist/app.js",
    "tsc": "tsc",
    "tsc:watch": "tsc --watch",
    "lint": "eslint --ext .js,.ts src"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.11",
    "@types/node": "^14.14.22",
    "@typescript-eslint/eslint-plugin": "^4.14.1",
    "@typescript-eslint/parser": "^4.14.1",
    "eslint": "^7.18.0",
    "eslint-config-prettier": "^7.2.0",
    "nodemon": "^2.0.7",
    "prettier": "^2.2.1",
    "typescript": "^4.1.3"
  }
}
```

これで linting や TypeScript のコンパイルを実行することができる。

### #14 `.eslintrc.json` に独自ルールを追加する

このままだと `express` のエラーハンドリングで警告が発生するため、以下のルールを追加する。

```javascript
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "argsIgnorePattern": "next" }
    ]
  }
}
```

### #15 `.editorCondig` を設定する

OSS の[Crowi](https://github.com/crowi/crowi/blob/master/.editorconfig)の設定を採用する。

```txt
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
max_line_length = off
```

- [どんなエディタでも EditorConfig を使ってコードの統一性を高める](https://qiita.com/naru0504/items/82f09881abaf3f4dc171)
