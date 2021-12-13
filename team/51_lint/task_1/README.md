# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [チーム開発で lint を使うべき理由](#%E3%83%81%E3%83%BC%E3%83%A0%E9%96%8B%E7%99%BA%E3%81%A7-lint-%E3%82%92%E4%BD%BF%E3%81%86%E3%81%B9%E3%81%8D%E7%90%86%E7%94%B1)
- [ESLint](#eslint)
- [ESLint のおすすめルール](#eslint-%E3%81%AE%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%AB%E3%83%BC%E3%83%AB)
- [extends と plugings の違い](#extends-%E3%81%A8-plugings-%E3%81%AE%E9%81%95%E3%81%84)
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

## extends と plugings の違い

## airbnb のルール
