# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [チーム開発で lint を使うべき理由](#%E3%83%81%E3%83%BC%E3%83%A0%E9%96%8B%E7%99%BA%E3%81%A7-lint-%E3%82%92%E4%BD%BF%E3%81%86%E3%81%B9%E3%81%8D%E7%90%86%E7%94%B1)
- [ESLint](#eslint)
- [ESLint のおすすめルール](#eslint-%E3%81%AE%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%AB%E3%83%BC%E3%83%AB)
- [airbnb のルール](#airbnb-%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 
## チーム開発で lint を使うべき理由

linter とは、もともと C 言語においてコンパイラではチェックされないが、バグの原因となりそうなソースコードに対して、ソースの編集段階で静的解析で警告を行うことができるツールである。

また linter に独自のルールを適用することで、チーム内でソースコードがルール通りに記述されているのかチェックすることが可能となり、ソースコードの品質を保つことができる様になる。

## ESLint

ESlint とは、linter の中でも JavaScript のコードを対象とした静的解析ツールである。

下記のような対応する設定ファイルを用意しておけば解析を実行できるため、どのようなプロジェクトでも導入しておくことがおすすめである。

```js
module.exports = {
  root: true,
  extends: [/* shareable rules */],
  parser: /* parser */,
  plugins: [/* plugins */],
  rules: {
    // ... some rules
  }
};
```

参考資料

- [ESLint の Plugin と Extend の違い](https://blog.ojisan.io/eslint-plugin-and-extend/)
- [.eslintrc の env 設定ってなんぞや？](https://zenn.dev/kimromi/articles/546923b7281dcb)

## ESLint のおすすめルール

ESlint では、`"extends": "eslint:recommended"` を設定ファイルに追加した場合に適用されるルールや、その他のルールにどの様なものがあるのか [公式サイト](https://eslint.org/docs/rules/) に記述されている。

以下に重要だと感じるルールを列挙していく。なお `"extends": "eslint:recommended"` で適用できるルールは除外している。（例えば `no-unused-vars` など重要だと感じるが以下にはまとめていない。）

- [no-console](https://eslint.org/docs/rules/no-console)
  - `console` でのログ出力はデバッグの際にのみ使用して、本番環境には残しておきたいくはない
  - このルールを有効にしておくことで、不要なログ出力を消し忘れることを防ぐことが可能となる
- [array-callback-return](https://eslint.org/docs/rules/array-callback-return)
  - 配列の各要素に対して操作を行う関数を作成する
  - このコールバック関数には `return` を書き忘れることがある
  - このルールを有効にしておくことで、変換処理が不要な場合は `forEach` を使用することを矯正できる
- [no-nested-ternary](https://eslint.org/docs/rules/no-nested-ternary)
  - 三項演算子は分岐処理を短くできるので便利である
  - しかし、何回もネストさせてしまうと処理の見通しが悪くなってしまう
  - このルールを有効にしておくことで、三項演算子のネストが発生しない様になる
- [max-depth](https://eslint.org/docs/rules/max-depth)
  - 複雑な処理の場合、複数の条件分岐を書いてしまい処理の可読性が悪化することがある
  - この場合、ネストを深くするよりも論理凝集度から機能的凝集へと高めていく方がいい
  - このルールを有効にしておくことで、ネストできる深さの最大値を設定することができる
- [no-eval](https://eslint.org/docs/rules/no-eval)
  - JavaScript での `eval` はセキュリティ的に危険なメソッドである
  - このルールを有効にすることで、代替となるアプローチを矯正することができる

## airbnb のルール

プロジェクトを新規作成して、[`eslint-config-airbnb`](https://www.npmjs.com/package/eslint-config-airbnb) を適用するまでの手順を記載する。

```bash
# プロジェクト名は "linter-check"
# React x TypeScript の構成で初期化する
❯❯❯ npm init vite@latest
```

vitejs で初期化したプロジェクトには ESLint や Prettier は導入されていないため、自分で設定を追加していく必要がある。

```bash
❯❯❯ npm install --save-dev eslint
```

ただし今回は ESLint の動的に設定ファイルを生成する機能を利用する。

```
❯❯❯ npx eslint --init

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · airbnb
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-airbnb@latest
The config that you've selected requires the following dependencies:

    eslint-plugin-react@^7.27.1 @typescript-eslint/eslint-plugin@latest eslint-config-airbnb@latest eslint@^7.32.0 || ^8.2.0 eslint-plugin-import@^2.25.3 eslint-plugin-jsx-a11y@^6.5.1 eslint-plugin-react-hooks@^4.3.0 @typescript-eslint/parser@latest

✔ Would you like to install them now with npm? · No / Yes

    Installing eslint-plugin-react@^7.27.1, @typescript-eslint/eslint-plugin@latest, eslint-config-airbnb@latest, eslint@^7.32.0 || ^8.2.0, eslint-plugin-import@^2.25.3, eslint-plugin-jsx-a11y@^6.5.1, eslint-plugin-react-hooks@^4.3.0, @typescript-eslint/parser@latest
```

これで生成される設定ファイルを確認すると、`eslint-config-airbnb` のルールが設定されていることがわかる。

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // airbnb が設定されている
  extends: ["plugin:react/recommended", "airbnb"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {},
};
```

ソースコードを初期状態のままで ESLint を適用すると以下のエラーが表示される。

```
❯❯❯ npx eslint ./src --ext .ts,.tsx

/Users/shimopino/Desktop/praha/work/praha-challenges/team/51_lint/task_1/linter-check/src/App.tsx
   1:33  error  Missing semicolon                                                      semi
   2:30  error  Missing semicolon                                                      semi
   3:19  error  Missing semicolon                                                      semi
   5:1   error  Function component is not a function expression                        react/function-component-definition
   6:40  error  Missing semicolon                                                      semi
   9:5   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
   9:5   error  JSX not allowed in files with extension '.tsx'                         react/jsx-filename-extension
  10:7   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  11:9   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  12:9   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  13:9   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  14:11  error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  14:58  error  'count' is already declared in the upper scope on line 6 column 10     no-shadow
  15:23  error  `{count}` must be placed on a new line                                 react/jsx-one-expression-per-line
  18:9   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  19:16  error  `code` must be placed on a new line                                    react/jsx-one-expression-per-line
  19:16  error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  19:36  error  ` and save to test HMR updates.        ` must be placed on a new line  react/jsx-one-expression-per-line
  21:9   error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  22:11  error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  31:11  error  'React' must be in scope when using JSX                                react/react-in-jsx-scope
  42:4   error  Missing semicolon                                                      semi
  45:19  error  Missing semicolon                                                      semi

/Users/shimopino/Desktop/praha/work/praha-challenges/team/51_lint/task_1/linter-check/src/main.tsx
   1:26  error  Missing semicolon                               semi
   2:33  error  Missing semicolon                               semi
   3:21  error  Missing semicolon                               semi
   4:17  error  Unable to resolve path to module './App'        import/no-unresolved
   4:17  error  Missing file extension for "./App"              import/extensions
   4:24  error  Missing semicolon                               semi
   7:3   error  JSX not allowed in files with extension '.tsx'  react/jsx-filename-extension
  10:34  error  Missing trailing comma                          comma-dangle
  11:2   error  Missing semicolon                               semi

✖ 32 problems (32 errors, 0 warnings)
  16 errors and 0 warnings potentially fixable with the `--fix` option.
```

デフォルトで設定されている React と TypeScript 向けのルールはいくつか修正する必要がある。

例えば、デフォルトでは `.tsx` ファイル内で JSX を記述することができないため、以下のルールを追加する必要がある。

```js
module.exports = {
  // ...
  rules: {
    "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
  },
};
```

また、デフォルトでは TypeScript で相対パスの解決を自動的に行ってはくれないため、追加でライブラリを設定してパスの解決ができる様にする。

```bash
npm install --save-dev eslint-import-resolver-typescript
```

設定には下記を追加する。

```js
{
  "plugins": ["import"],
  "rules": {
    // turn on errors for missing imports
    "import/no-unresolved": "error"
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        "project": "path/to/folder",
      }
    }
  }
}
```

また、デフォルトではコンポーネントなどのファイルに外出しした内容を読み込む際に `.tsx` の拡張子を指定しないといけない設定になっている。

そこで下記のルールを追加して無効化しておく。

```js
"rules": {
   "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ]
}
```

また、React のバージョン 17 からは、JSX の変換処理の方法が変更されたため、`import React from 'react'` の記述が必須ではなくなっている。

しかし、`eslint-config-react` はデフォルトで上記の変更に対応していないため、[公式サイトの手順](https://www.npmjs.com/package/eslint-plugin-react) にしたがい下記のルールを拡張する必要がある。

```js
extends: {
  "plugin:react/jsx-runtime"
}
```

これで React と TypeScript を組み合わせた場合の最低限の準備を整えることができた。

```
❯❯❯ npx eslint ./src --ext .ts,.tsx

/Users/shimopino/Desktop/praha/work/praha-challenges/team/51_lint/task_1/linter-check/src/App.tsx
   5:13  warning  Unexpected unnamed function                                         func-names
  14:58  error    'count' is already declared in the upper scope on line 6 column 10  no-shadow

✖ 2 problems (1 error, 1 warning)
```
