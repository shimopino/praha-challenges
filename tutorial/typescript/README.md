# TypeScript の基礎

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;01 TypeScript の導入](#01-typescript-%E3%81%AE%E5%B0%8E%E5%85%A5)
  - [TypeScript の特徴](#typescript-%E3%81%AE%E7%89%B9%E5%BE%B4)
  - [TypeScript が提供しているもの](#typescript-%E3%81%8C%E6%8F%90%E4%BE%9B%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%82%82%E3%81%AE)
- [&#035;02 Types](#02-types)
  - [プリミティブ型](#%E3%83%97%E3%83%AA%E3%83%9F%E3%83%86%E3%82%A3%E3%83%96%E5%9E%8B)
  - [オブジェクト型](#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E5%9E%8B)
  - [配列型](#%E9%85%8D%E5%88%97%E5%9E%8B)
  - [Tuple 型](#tuple-%E5%9E%8B)
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

### Enum型

| 型      | 具体例 | 内容                                    |
| :------ | :----- | :-------------------------------------- |
| `Enum` | enum {NEW, OLD} | TypeScript 独自の型であり列挙型 |

- JavaScriptで定数として文字列をそのまま指定することはエラーの元となる

  ```js
  const person = {
    name: "yota",
    age: 30,
    hobbies: ["Sports", "Cooking"]
    role: "READ_ONLY_USER"
  }
  ```

- TypeScriptの`Enum`では定数を事前に型として準備することができる

  ```js
  // 定数の値を指定しない場合は、0から自動的にインクリメントされる
  // それぞれ数値や文字列を明示的に割り振ることが可能である
  enum Role {
    ADMIN,
    READ_ONLY,
    AUTHOR
  }

  const person = {
    name: "yota",
    age: 30,
    hobbies: ["Sports", "Cooking"]
    role: Role.READ_ONLY
  }
  ```

### any型

| 型      | 具体例 | 内容                                    |
| :------ | :----- | :-------------------------------------- |
| `Any` | * | どんな型での許容される |

- 可能なら使用しないほうがいい

### Union型

- 以下の関数に関して、文字列も受け取ることができるようにするにはどうすればいいのか

    ```js
    // sample.ts
    const combine = (x: number, y: number): number => {
      const result =  x + y;
      return result;
    };

    const combinedAges = combine(30, 26);
    console.log(combinedAges)
    ```

- 縦線`|`を付与することで、型を複数指定することができる

  ```js
  const combine = (x: number | string, y: number | string) {
    // const result = x + y; とするとエラーが生じる
    // TypeScriptは数値型が足されたのか、文字列が結合されたのかわからない

    // そこでJavaScriptはRuntime時に型が決まるため、その型をtypeofで検知して分岐処理させる
    let result;
    if (typeof x === "number" && typeof y === "number") {
      result = x + y;
    } else {
      result = x.toString() + y.toString();
    }
    return result;
  }
  ```

### Literal型

- 値を厳密に決定するための型
  Union型と組み合わせることで、引数に受け取れる文字列などを制御することができる

  ```js
  const combine = (
    x: number | string,
    y: number | string,
    // 以下では2つの文字列しか受け取れないようにしている
    // これで文字列が間違っている場合には、IDEにエラーが表示される
    resultConversion: "as-number" | "as-text",
  ) => {
    let result;
    if (
      (typeof x === "number" && typeof y === "number")
      ||
      (resultConversion === "as-number")
    ) {
      // parseFloatなどでもいいが、表記が短いほうに併せている
      result = +x + +y;
    } else {
      result = x.toString() + y.toString();
    }
    return result;
  }
  ```

### Alias型 && Union型

- `type`キーワードを使用することで、独自の型を指定することができる

  ```js
  type Combinable = number | string;
  type ConversionDescriptor = "as-number" | "as-text";

  const combine = (
    // 事前に定義した独自の型を指定することができる
    x: Combinable,
    y: Combinable,
    resultConversion: ConversionDescriptor,
  ) => {
    let result;
    if (
      (typeof x === "number" && typeof y === "number")
      ||
      (resultConversion === "as-number")
    ) {
      // parseFloatなどでもいいが、表記が短いほうに併せている
      result = +x + +y;
    } else {
      result = x.toString() + y.toString();
    }
    return result;
  }
  ```

### Alias型 && Object型

- 独自のObjectを定義することもできる

  ```js
  type User = {
    name: string;
    age: number;
  }

  const greet = (user: User) {
    console.log("Hi, I am " + user.name);
  }

  const isOlder = (user: User, checkAge: number) {
    return checkAge > user.age;
  }
  ```

### function型 && void

- 関数の戻り値の型を指定することができる

  - 以下のように返り値の型を指定する

    ```js
    // 以下は本来は返り値の型を指定しないほうがいい
    // TypeScriptが型推論できるのなら、そちらに型指定は任せたほうがいい
    const add = (x: number, y:number): number {
      return x + y;
    }
    ```

  - 返り値が存在しない場合、`void`を指定して、関数内で`return`が存在していないことを明示することができる

    ```js
    const printresult = (n: number): void {
      console.log("Result: " + n);
    }

    printResult(10);
    ```

### function型

- 変数に関数を受け取ることができるように型指定を使うことができる

  ```js
  // これで、この変数には関数しか代入することができない
  let conbineValues: Function;

  conbineValues = add;
  conbineValues = 5; // raise Error
  ```

  - 固有の関数自体を型指定することができる

    ```js
    let conbineValues: (a: number, b: number) => number;

    conbineValues = add;
    conbineValues = printResult; // raise Error
    ```

### CallBack Function型

- 引数で関数を受け取って実行するコールバック関数に関しても、型指定することができる

  ```js
  // コールバック関数の引数の型を厳密に指定する必要がある
  const addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
    const result = n1 + m2;
    cb(result);
  }

  // 引数で数値型以外を指定すると、エラーが発生する
  addAndHandle(10, 20, (result) => {
    console.log(result);
  });
  ```

### unknown型

- `unknown`型を指定すると、`any`型と異なり、型チェックを行うことを強制することができる

  ```js
  let userInput: unknown;
  let userName: string;

  userInput = "max";

  // 文字列型である変数"userName"に対して、代入する値が"string"であることを保証している
  if (typeof userInput === "string") {
    userName = userInput;
  }

  // userInputが文字列であるのか不明なためエラーが発生する
  userName = userInput;
  ```

### never型

- 関数の返り値として、何も返さないことを指定することができる

  - `void`型では、別に関数内で`return`を使用しても問題なかった

    ```js
    const generateError = (message: string, code: number): void {
      throw {message: message, errorCode: code};
    }

    const result = generateError("エラーが発生しました", 500);
    console.log(result);
    ```

  - `never`型では、返り値が **ありえない** ことをしていできる
    これはエラーの送出などに使用する

    ```js
    // never型を使用して、返り値がありえないことを指定している
    const generateError = (message: string, code: number): never {
      throw {message: message, errorCode: code};
    }

    const result = generateError("エラーが発生しました", 500);
    console.log(result);
    ```

### 参考資料

- [[TypeScript Docs] Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [[TypeScript Deep Dive] TypeScriptの型システム](https://typescript-jp.gitbook.io/deep-dive/type-system)

## 参考資料

- Udemy
  - [最短・最速で学ぶ TypeScript 実践入門 - 最新モダン開発には欠かせない TypeScript をマスターしよう！](https://www.udemy.com/course/typescript-typescript/)
  - [最速で学ぶ TypeScript](https://www.udemy.com/course/typescript-react-frontend/)
  - [【世界で 7 万人が受講】Understanding TypeScript - 2020 年最新版](https://nssol.udemy.com/course/understanding-typescript-jp/)
 