# 環境構築手順

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [1. VSCode の Remote Development を使用して Docker 環境を整える](#1-vscode-%E3%81%AE-remote-development-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6-docker-%E7%92%B0%E5%A2%83%E3%82%92%E6%95%B4%E3%81%88%E3%82%8B)
- [2. 必要なモジュールをインストールする](#2-%E5%BF%85%E8%A6%81%E3%81%AA%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B)
- [3. .eslintrc.json](#3-eslintrcjson)
- [4. .prettierrc.json](#4-prettierrcjson)
- [5. .vscode/settings.json](#5-vscodesettingsjson)
- [6. .vscode/launch.json](#6-vscodelaunchjson)
- [7. tsconfig.json](#7-tsconfigjson)
- [8. package.json](#8-packagejson)
- [9. jest.config.js](#9-jestconfigjs)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 1. VSCode の Remote Development を使用して Docker 環境を整える

Remote Development が提供している デフォルトの Node.js 環境を v14 で起動する。その際に以下の `devcontainer.json` を採用する。

```js
{
  "name": "Node.js",
  "build": {
    "dockerfile": "Dockerfile",
    "args": { "VARIANT": "14" }
  },

  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash"
  },

  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "hediet.vscode-drawio",
    "humao.rest-client",
    "coenraads.bracket-pair-colorizer",
    "editorconfig.editorconfig",
    "ritwickdey.liveserver",
    "orta.vscode-jest"
  ],

  "remoteUser": "node"
}
```

## 2. 必要なモジュールをインストールする

```bash
# API構築に必要なモジュールをインストールする
$ yarn add express debug winston express-winston cors nedb shortid argon2

# Jestをインストールする
$ yarn add -D jest

# TypeScript 関係のモジュールをインストールする
$ yarn add -D typescript @types/express @types/debug @types/cors @types/shortid @types/jest ts-jest

# NodeJS のデバッグ用モジュールをインストールする
$ yarn add -D source-map-support

# ESLint をインストールする
# https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
# https://www.npmjs.com/package/eslint-plugin-jest
$ yarn add -D eslint @typescript-eslint/{parser,eslint-plugin} eslint-plugin-jest

# Prettier をインストールする
# https://github.com/prettier/eslint-config-prettier
$ yarn add -D prettier eslint-config-prettier
```

## 3. .eslintrc.json

```js
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "jest"],
  "env": {
    "jest": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
}
```

参考資料

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)

## 4. .prettierrc.json

```js
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "arrowParens": "always"
}
```

参考資料

- [Prettier Options](https://prettier.io/docs/en/options.html)

## 5. .vscode/settings.json

```js
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 6. .vscode/launch.json

Jest をデバッグできるようにする

```js
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${fileBasenameNoExtension}", "--config", "jest.config.js"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    }
  ]
}
```

## 7. tsconfig.json

```js
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "ES2020" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "./dist" /* Redirect output structure to the directory. */,
    "rootDir": "./" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true /* Skip type checking of declaration files. */,
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  },
  "include": ["src/**/*.ts", "test/**/*.ts"]
  "exclude": ["node_modules", "dist"]
}
```

## 8. package.json

```js
"scripts": {
  "test": "jest",
  "test:watch": "jest --watchAll",
  "tsc": "tsc",
  "tsc:watch": "tsc --watch",
  "lint": "eslint --ext .js,.ts src"
},
```

なお `jest --watchAll` を実行するとファイルを保存するたびに自動的にテストが実行される。

## 9. jest.config.js

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/app/**/*.ts'],
};
```

この設定値のそれぞれの意味は以下のようになっている。

- [`roots [array<string>]`](https://jestjs.io/docs/ja/configuration#roots-arraystring)
  - Jest が探索するディレクトリのパスを使用する
  - デフォルトでは `["<rootDir>"]`
  - Jest に特定のサブディレクトリのみを探索させ、リポジトリの残りの場所にはアクセスさせたくない場合に有用である
- [`transform [object<string, pathToTransformer | [pathToTransformer, object]>]`](https://jestjs.io/docs/ja/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object)
  - ソースファイルを変換する同期処理を行う関数を提供する transformer のパスへのマップを指定する
  - デフォルトでは `{"\\.[jt]sx?$": "babel-jest"}`
  - `Babel` や `TypeScript`、`async-to-gen` などが使用される
- [`testRegex [string | array<string>]`](https://jestjs.io/docs/ja/configuration#testregex-string--arraystring)
  - テスト対象ファイルのファイル名を正規表現で指定する
  - デフォルトでは、`(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$`
  - つまり拡張子は `.js, .jsx, .ts, .tsx`
  - ファイル名は `.test.js` や `.spec.js` など
- [`moduleFileExtensions [array<string>]`](https://jestjs.io/docs/ja/configuration#modulefileextensions-arraystring)
  - モジュールが使用しているファイル拡張子を指定する
  - デフォルトでは、`["js", "json", "jsx", "ts", "tsx", "node"]`
- [`verbose [boolean]`](https://jestjs.io/docs/ja/configuration#verbose-boolean)
  - 実行中にここのテストを報告するのか決める
  - 実行後も全てのエラーは表示される
  - デフォルトでは、`false`
  - なおテストファイルが 1 つしかない場合は `true` が設定される
- [`preset [string]`](https://jestjs.io/docs/ja/configuration#preset-string)
  - Jest 設定のベースを指定する
  - デフォルトでは、`undefined`
  - 値には `jest-preset.json` や `jest-preset.js` を有する npm モジュールを指定する
- [`testEnvironment [string]`](https://jestjs.io/docs/ja/configuration#testenvironment-string)
  - テスト実行時に使用されるテスト環境を指定する
  - デフォルトでは、`jsdom`
  - ブラウザ環境では `jsdom`、Node 環境では `node` を使用する
- [`collectCoverage [boolean]`](https://jestjs.io/docs/ja/configuration#collectcoverage-boolean)
  - テスト実行中にカバレッジ情報を取得するか指定する
  - デフォルトでは、`false`
  - テストが大幅に遅くなる可能性あり
- [`collectCoverageFrom [array] `](https://jestjs.io/docs/ja/configuration#collectcoveragefrom-array)
  - カバレッジ情報を取得する対象ファイルを指定する
  - デフォルトでは、`undefined`
  - なお `collectCoverage` が `true` に設定されている必要あり
