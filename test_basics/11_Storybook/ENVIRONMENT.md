# 環境構築手順

<!-- START doctoc -->
<!-- END doctoc -->

## 概要

今回は `create-react-app` を使用せずに、React と TypeScript の環境構築を行っていく。

### #1 プロジェクトの初期化

```bash
yarn init -y
```

### #2 .gitignore の設定

```js
node_modules;
dist;
```

### #3 React で構築する JS を読み込み HTML の作成

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- Reactのエントリポイント -->
    <div id="root"></div>
    <!-- WebpackでバンドルされたJS -->
    <script src="../dist/bundle.js"></script>
  </body>
</html>
```

### #4 React + TypeScript をインストールする

```bash
# React
yarn add react react-dom

# TypeScript
yarn add typescript

# Reactの型情報
yarn add @types/react @types/react-dom
```

参考情報

- [Adding React to an Existing Application](https://reactjs-bot.github.io/react/docs/installation.html#adding-react-to-an-existing-application)

### #5 Babel をインストールする

JavaScript は ECMAScript で仕様策定が行われているが、実行環境によって特定の仕様を使うことができない場合が存在する。

また TypeScript などの型情報も JavaScript を実行する際には不必要である。

こうした様々な状況に合わせて、開発者が構築した JavaScript を別の JavaScript へと変換 (トランスパイル) させる役割を有するのが Babel である。

```bash
# ES2015以降のJSをトランスパイル
yarn add -D @babel/core @babel/cli @babel/preset-env

# ReactとJSXをトランスパイル
yarn add -D @babel/preset-react

# TypeScriptの型情報をトランスパイル
yarn add -D @babel/preset-typescript
```

参考情報

- [What is Babel?](https://babeljs.io/docs/en/)
- [Usage Guide](https://babeljs.io/docs/en/usage)
- Presets
  - [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
  - [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)
  - [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript#docsNav)
- [Configure Babel](https://babeljs.io/docs/en/configuration)

### #6 Babel の設定ファイルを追加

Babel の設定ファイル (`babel.config.js`) をを追加する。

```js
module.exports = (api) => {
  // Same as `api.cache.forever()`
  // 設定を永続化させて関数を再実行しない
  api.cache(true);

  return {
    preset: [
      [
        "@babel/preset-env",
        {
          targets: "> 0.25%, not dead",
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  };
};
```

参考情報

- [api.cache](https://babeljs.io/docs/en/config-files#apicache)
- [browserslist](https://github.com/browserslist/browserslist)

### #7 Webpack のインストール

```bash
# webpack
yarn add -D webpack webpack-cli

# 開発用サーバ
yarn add -D webpack-dev-server

# TypeScrip用のWebpack
yarn add -D ts-loader

# CSS用のLoader
yarn add -D style-loader css-loader
```

参考情報

- [Getting Started](https://webpack.js.org/guides/getting-started/)
- [Webpack Concept](https://webpack.js.org/concepts/)
- [DevServer](https://webpack.js.org/configuration/dev-server/)
- [TypeScript](https://webpack.js.org/guides/typescript/)

### #8 webpack の設定を追加する

webpack 用の設定 (`webpack.config.js`) を追加する。

```js
const path = require("path")

module.exports = {

    // process.env.NODE_ENVに"development"を設定する
    mode: "development",

    // エントリポイントのファイルを設定する
    entry: {
        bundle: "./src/index.tsx",
    }

    // バンドルしたファイルの出力先を決定する
    output: {
        // 出力先フォルダ名
        path: path.resolve(__dirname, "dist"),
        // 出力先ファイル名
        filename: "bundled.js",
    },

    // デバッグ用のsourceMapを有効化する
    devtool: 'inline-source-map',

    // デフォルトではwebpackはJSかJSONしか読み込めない
    // TypeScriptなども読み込めるようにする
    module: {
        rules: [
            {
                // TypeScriptの拡張子の場合
                test: /\.tsx?$/,
                // TypeScriptを以下でコンパイル
                use: "ts-loader",
                // 以下のフォルダは除外
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },

    // import File from '../path/to/file';した際にTypeScriptを読み込む
    resolve: {
        extensions: [".ts", ".tsx", ".js", "json"]
    },

    // webpack-dev-server用の設定
    devServer: {
        // 開発サーバを起動する起点を設定する
        contentBase: path.resolve(__dirname, "public"),
        // gzip圧縮を使用する
        compress: true,
        // リクエストを受け付けるポート番号を指定する
        port: 3000,
    }
}
```

- [Mode](https://webpack.js.org/configuration/mode/)
- [Resolve](https://webpack.js.org/configuration/resolve/#root)
- [DevServer](https://webpack.js.org/configuration/dev-server/)
- [TypeScript](https://webpack.js.org/guides/typescript/)
- [Error: Cannot find module 'webpack-cli/bin/config-yargs' #2759](https://github.com/webpack/webpack-dev-server/issues/2759)

### #9 tsconfig.json を追加する

```js
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    "target": "ESNEXT",
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */
    "declaration": true,                         /* Generates corresponding '.d.ts' file. */
    "sourceMap": true,                           /* Generates corresponding '.map' file. */
    "outDir": "./dist",                              /* Redirect output structure to the directory. */
    "rootDir": "./src",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    "lib": [
      "es2020",
      "dom"
    ],

    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */

    /* Module Resolution Options */
    "moduleResolution": "node",                  /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                             /* Base directory to resolve non-absolute module names. */
    // "paths": {},                                 /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                              /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                             /* List of folders to include type definitions from. */
    // "types": [],                                 /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,        /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,                    /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,                /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                            /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                               /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                     /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                       /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,              /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,               /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}
```

### #10 Linter & Formatter 系のインストール

```bash
yarn add -D eslint @typescript-eslint/{parser,eslint-plugin}
```

- [https://github.com/eslint/eslint](https://github.com/eslint/eslint)
- [https://github.com/typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)

```bash
yarn add -D eslint-plugin-react
```

```bash
yarn add -D prettier eslint-config-prettier
```

- [https://github.com/prettier/prettier](https://github.com/prettier/prettier)
