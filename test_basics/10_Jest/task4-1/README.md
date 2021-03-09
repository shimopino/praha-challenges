# 課題 4 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [環境設定](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)
  - [package.json](#packagejson)
  - [.prettierrc.json](#prettierrcjson)
  - [.eslintrc.json](#eslintrcjson)
  - [tsconfig-google.json](#tsconfig-googlejson)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

[src/query.ts](src/query.ts) には、OSS の CMS ツールである [Crowi](https://github.com/crowi/crowi) 内で使用されている関数が定義されており、使用例として `ElasticSearch` に投入する前の処理として採用されています。

ではこのモジュール内で定義されている `parseQuery` 関数に対する単体テストを実装してみましょう。

コードのカバレッジが 90％になるような単体テストにしてみましょう。

> 100％を達成することはできないため、90％まででOKです。

## 環境設定

今回は Google が提供している [gts](https://github.com/google/gts) を使ってみました。

詳細なスタイルガイドは以下になります。

- [https://google.github.io/styleguide/tsguide.html](https://google.github.io/styleguide/tsguide.html)

実行したのは以下のコマンドのみです。

```bash
$ yarn init -y
$ npx gts init
```

ちなみに各種設定は以下のようになっていました。

### package.json

```js
"scripts": {
    "lint": "gts lint",
    "clean": "gts clean",
    "compile": "tsc",
    "fix": "gts fix",
    "prepare": "yarn run compile",
    "pretest": "yarn run compile",
    "posttest": "yarn run lint"
}
```

### .prettierrc.json

```js
{
  "bracketSpacing": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
```

### .eslintrc.json

```js
{
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended",
    "prettier"
  ],
  "plugins": [
    "node",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "block-scoped-var": "error",
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error",
    "eol-last": "error",
    "prefer-arrow-callback": "error",
    "no-trailing-spaces": "error",
    "quotes": ["warn", "single", { "avoidEscape": true }],
    "no-restricted-properties": [
      "error",
      {
        "object": "describe",
        "property": "only"
      },
      {
        "object": "it",
        "property": "only"
      }
    ]
  },
  "overrides": [
    {
      "files": ["**/*.ts", "**/*.tsx"],
      "parser": "@typescript-eslint/parser",
      "extends": [
        "plugin:@typescript-eslint/recommended"
      ],
      "rules": {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-warning-comments": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/camelcase": "off",
        "node/no-missing-import": "off",
        "node/no-empty-function": "off",
        "node/no-unsupported-features/es-syntax": "off",
        "node/no-missing-require": "off",
        "node/shebang": "off",
        "no-dupe-class-members": "off",
        "require-atomic-updates": "off"
      },
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
      }
    }
  ]
}
```

### tsconfig-google.json

```js
{
  "compilerOptions": {
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "declaration": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2018"],
    "module": "commonjs",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "pretty": true,
    "sourceMap": true,
    "strict": true,
    "target": "es2018"
  },
  "exclude": [
    "node_modules"
  ]
}
```
