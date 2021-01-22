# TypeScript の基礎

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;01 TypeScript の導入](#01-typescript-%E3%81%AE%E5%B0%8E%E5%85%A5)
- [02 Types](#02-types)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #01 TypeScript の導入

- TypeScript の特徴

  - TypeScript はブラウザで直接実行できない
  - TypeScript は JavaScript にコードをコンパイルすることで、新しい機能を JavaScript に導入したり、エラー検証を実行することができる
  - JavaScript はブラウザで実行するためにバリデーションが甘く、想定していない動作を発生する可能性がある

    ```js
    const addFunc = (x, y) => {
      return x + y;
    };

    addFunc(1, 3); // => 4
    addFunc("1", "3"); // => "13"
    ```

  - TypeScript では型を指定することでより安全に関数を作成することができる

    ```js
    // sample.ts
    const addFunc = (x: number, y: number): number => {
      return x + y;
    };

    addFunc(1, 3); // => 4
    addFunc("1", "3"); // raise Error
    ```

  - あとはこの TypeScript のファイルをコンパイルすれば、JavaScript のコードが生成される

    ```bash
    $ tsc sample.ts
    ```

- TypeScript が提供しているもの

  - 型
  - 新しい仕様の JavaScript の後方互換性
  - ジェネリクス
  - デコレータなど
  - 柔軟なコンパイルオプション

## 02 Types

## 参考資料

- Udemy
  - [最短・最速で学ぶ TypeScript 実践入門 - 最新モダン開発には欠かせない TypeScript をマスターしよう！](https://www.udemy.com/course/typescript-typescript/)
  - [最速で学ぶ TypeScript](https://www.udemy.com/course/typescript-react-frontend/)
  - [【世界で 7 万人が受講】Understanding TypeScript - 2020 年最新版](https://nssol.udemy.com/course/understanding-typescript-jp/)
