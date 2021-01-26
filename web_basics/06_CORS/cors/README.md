# 課題 3 CORS の実装

<!-- START doctoc -->
<!-- END doctoc -->

## How to Reproduce

## Project settings

今回の実装では、TypeScript や ESLint を導入した。

その際の手順を残しておく。

なお [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) に従っている。

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

```json
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
    "coenraads.bracket-pair-colorizer"
  ],

  // Use 'forwardPorts' to make a list of ports inside the container available locally.
  // "forwardPorts": [],

  "appPort": [8080, 8090],

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

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
}
```

### #6 `.eslintignore` を設定する

```json
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

```json
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

```json
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

```json
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

```json
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

```json
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

```json
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
