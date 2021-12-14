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
