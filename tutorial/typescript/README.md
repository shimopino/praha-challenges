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

### TypeScript の特徴

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

### TypeScript が提供しているもの

- 型
- 新しい仕様の JavaScript の後方互換性
- ジェネリクス
- デコレータなど
- 柔軟なコンパイルオプション

## #02 Types

JavaScript での主な型

### プリミティブ型

| 型        | 具体例       | 内容                               |
| :-------- | :----------- | :--------------------------------- |
| `number`  | 1, 5.3, -10  | 整数や浮動小数点を含むすべての数値 |
| `string`  | "Hi", \`Hi\` | すべての文字列                     |
| `boolean` | true, false  | true または false                  |

- TypeScript の利便性を見てみる

  - まずはプリミティブ型を使用する関数を作成してみる

    ```js
    // sample.ts
    const addFunc = (x: number, y: number): number => {
      return x + y;
    };

    const number1 = 1;
    const number2 = 2;
    addFunc(number1, number2); // => 3
    ```

  - では上記のコードの中でなぜ変数宣言の際に型を指定していないのか

    - TypeScript の型推論機能を使っているため
    - 型を完璧に推論できる場合、明示的に型を指定すると冗長的な書き方になってしまう

### オブジェクト型

| 型       | 具体例    | 内容                              |
| :------- | :-------- | :-------------------------------- |
| `object` | {age, 30} | JavaScript のすべてのオブジェクト |

- TypeScript では、オブジェクトに対して有するプロパティやその型を指定することができる

  ```js
  // 以下は型推論できるため、推奨されないやり方になる
  const person: {
    name: string, // "name"という名称で、文字列型
    age: number, // "age"という名称で、数値型
  } = {
    name: "yota",
    age: 30,
  };
  ```

- ネスト構造を有する Object 型の型指定も可能である

  ```js
  const person: {
    id: string,
    price: number,
    tags: string[],
    details: {
      title: string,
      description: string,
    },
  } = {
    id: "abc1",
    price: 12.99,
    tags: ["great-offer", "hot-and-new"],
    details: {
      title: "Red Carpet",
      description: "A great carpet - almost brand-new!",
    },
  };
  ```

### 配列型

| 型       | 具体例      | 内容                           |
| :------- | :---------- | :----------------------------- |
| `object` | [1, 20, 30] | どんあ値も受け取ることができる |

- 配列型に対して型指定を実施してみる

  ```js
  // 配列の指定は [] でできる
  const favoriteActivities: string[] = ["Sports", "Reading"];

  // 配列の型を指定しているため、ループで取得する要素も型に従う
  for (const hobby of favoriteActivities) {
    // 文字列と認識しているため、文字列メソッドへの補間も有効になる
    console.log(hobby.toUpperCase());
  }
  ```

### Tuple 型

| 型      | 具体例 | 内容                                    |
| :------ | :----- | :-------------------------------------- |
| `Tuple` | [1, 2] | TypeScript 独自の型であり、要素数が固定 |

- TypeScript 独自に定義している型も使用することができる

  ```js
  const person: {
    name: string,
    age: number,
    bobbies: stringp[],
    role: [number, string], // Tuple型
  } = {
    name: "yota",
    age: 20,
    bobbies: ["Sports", "Cooking"],
    role: [2, "author"],
  };

  // 最後の要素に追加することができない
  person.role.push("sample");
  // 2番目の要素は文字列のみが有効
  person.role[1] = 10;
  ```

## 参考資料

- Udemy
  - [最短・最速で学ぶ TypeScript 実践入門 - 最新モダン開発には欠かせない TypeScript をマスターしよう！](https://www.udemy.com/course/typescript-typescript/)
  - [最速で学ぶ TypeScript](https://www.udemy.com/course/typescript-react-frontend/)
  - [【世界で 7 万人が受講】Understanding TypeScript - 2020 年最新版](https://nssol.udemy.com/course/understanding-typescript-jp/)
