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
  - [Enum 型](#enum-%E5%9E%8B)
  - [any 型](#any-%E5%9E%8B)
  - [Union 型](#union-%E5%9E%8B)
  - [Literal 型](#literal-%E5%9E%8B)
  - [Alias 型 && Union 型](#alias-%E5%9E%8B--union-%E5%9E%8B)
  - [Alias 型 && Object 型](#alias-%E5%9E%8B--object-%E5%9E%8B)
  - [function 型 && void](#function-%E5%9E%8B--void)
  - [function 型](#function-%E5%9E%8B)
  - [CallBack Function 型](#callback-function-%E5%9E%8B)
  - [unknown 型](#unknown-%E5%9E%8B)
  - [never 型](#never-%E5%9E%8B)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)
- [&#035;3 Compiler](#3-compiler)
  - [Wach Mode](#wach-mode)
  - [tsconfig.json](#tsconfigjson)
  - [コンパイル対象の絞り込みと除外](#%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%AB%E5%AF%BE%E8%B1%A1%E3%81%AE%E7%B5%9E%E3%82%8A%E8%BE%BC%E3%81%BF%E3%81%A8%E9%99%A4%E5%A4%96)
  - [target](#target)
  - [lib](#lib)
  - [allowJs & checkJs](#allowjs--checkjs)
  - [sourceMap](#sourcemap)
  - [outDir & rootDir](#outdir--rootdir)
  - [removeComments](#removecomments)
  - [noEmit](#noemit)
  - [downlevelIteration](#downleveliteration)
  - [noEmitOnError](#noemitonerror)
  - [Strict Type-Checking Options](#strict-type-checking-options)
  - [Additional Checks](#additional-checks)
  - [Debugging](#debugging)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-1)
- [&#035;4 Modern JavaScript](#4-modern-javascript)
  - [const & let](#const--let)
  - [default parameter](#default-parameter)
  - [spread operator](#spread-operator)
  - [rest parameters](#rest-parameters)
  - [Destructuring](#destructuring)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-2)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-3)

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

### Enum 型

| 型     | 具体例          | 内容                            |
| :----- | :-------------- | :------------------------------ |
| `Enum` | enum {NEW, OLD} | TypeScript 独自の型であり列挙型 |

- JavaScript で定数として文字列をそのまま指定することはエラーの元となる

  ```js
  const person = {
    name: "yota",
    age: 30,
    hobbies: ["Sports", "Cooking"]
    role: "READ_ONLY_USER"
  }
  ```

- TypeScript の`Enum`では定数を事前に型として準備することができる

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

### any 型

| 型    | 具体例 | 内容                   |
| :---- | :----- | :--------------------- |
| `Any` | \*     | どんな型での許容される |

- 可能なら使用しないほうがいい

### Union 型

- 以下の関数に関して、文字列も受け取ることができるようにするにはどうすればいいのか

  ```js
  // sample.ts
  const combine = (x: number, y: number): number => {
    const result = x + y;
    return result;
  };

  const combinedAges = combine(30, 26);
  console.log(combinedAges);
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

### Literal 型

- 値を厳密に決定するための型
  Union 型と組み合わせることで、引数に受け取れる文字列などを制御することができる

  ```js
  const combine = (
    x: number | string,
    y: number | string,
    // 以下では2つの文字列しか受け取れないようにしている
    // これで文字列が間違っている場合には、IDEにエラーが表示される
    resultConversion: "as-number" | "as-text"
  ) => {
    let result;
    if (
      (typeof x === "number" && typeof y === "number") ||
      resultConversion === "as-number"
    ) {
      // parseFloatなどでもいいが、表記が短いほうに併せている
      result = +x + +y;
    } else {
      result = x.toString() + y.toString();
    }
    return result;
  };
  ```

### Alias 型 && Union 型

- `type`キーワードを使用することで、独自の型を指定することができる

  ```js
  type Combinable = number | string;
  type ConversionDescriptor = "as-number" | "as-text";

  const combine = (
    // 事前に定義した独自の型を指定することができる
    x: Combinable,
    y: Combinable,
    resultConversion: ConversionDescriptor
  ) => {
    let result;
    if (
      (typeof x === "number" && typeof y === "number") ||
      resultConversion === "as-number"
    ) {
      // parseFloatなどでもいいが、表記が短いほうに併せている
      result = +x + +y;
    } else {
      result = x.toString() + y.toString();
    }
    return result;
  };
  ```

### Alias 型 && Object 型

- 独自の Object を定義することもできる

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

### function 型 && void

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

### function 型

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

### CallBack Function 型

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

### unknown 型

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

### never 型

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
- [[TypeScript Deep Dive] TypeScript の型システム](https://typescript-jp.gitbook.io/deep-dive/type-system)

## #3 Compiler

### Wach Mode

- ファイルを変更するたびに、自動的に TypeScript にコンパイルすることができる

  - コンパイルオプションを指定するだけでいい

    ```bash
    # -w, --watch : ファイルの監視を行って自動的コンパイルを実行する
    $ tsc app.ts -w
    ```

  - ただしこの方法だと、特定のファイルしか指定することができない

### tsconfig.json

- TypeScript が管理するフォルダを指定するために、以下のコマンドを実行して設定ファイルを作成する

  ```bash
  $ tsc --init
  >
  tsconfig.json
  ```

### コンパイル対象の絞り込みと除外

- TypeScript では、コンパイルする対象のファイルを明示的に指定したり、除外したりすることができる
- これは `tsconfig.json` に指定すればいい

  ```json
  {
    "conpilerOptions": {
      // コンパイラの設定
    },
    "exclude": [
      // 除外するファイルを指定する
      // デフォルトでは "node_modules" が指定されている
      // ただしこの設定を明示的に記載すると "node_modules" は除外されるため注意
      "**/*.dev.ts",
      "node_modules"
    ],
    "include": [
      // コンパイルするファイルを明示的に指定する
    ]
  }
  ```

### target

- `target` オプションを指定することで、JavaScript をどの ECMAScript の仕様にのっとったものにコンパイルするのか指定することができる

  - 例えば `es5` を指定すると、`const`や`let`はサポートされていないため、変数宣言部分はすべて`var`に変換される

    ```json
    {
      "compilerOptions": {
        /* Visit https://aka.ms/tsconfig.json to read more about this file */

        /* Basic Options */
        "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    }
    ```

### lib

- TypeScript で使用するライブラリを設定することができる
- コメントアウトしていた場合には、`target`に合わせて自動的にライブラリが選択される

  ```json
  {
    "compilerOptions": {
      "target": "es6",
      // 以下は "es6" を指定した際に自動的に読み込まれるライブラリ
      "lib": [
        "DOM",
        "ES6",
        "DOM.Iterable",
        "ScriptHost"
      ]
  }
  ```

### allowJs & checkJs

- TypeScript の機能を使って、JavaScript のコード自体もコンパイルすることができる
- また JavaScript のコードの検証を実行することも可能である
  ただしこの場合は TypeScript がコンパイルした JavaScript を対象に含めないように、`exclude`や`include`を設定する必要がある

  ```json
  {
    "compilerOptions": {
      // ...
      "allowJs": true, // Allow javascript files to be compiled.
      "checkJs": true // Report errors in .js files.
      // ...
    }
  }
  ```

### sourceMap

- デバッグ役立つオプションである
- TypeScript と JavaScript のソースコードの対応つけを行うファイルが生成される
- Chrome の検証ツールから、Sources に TypeScript を表示することができ、デバッグを実行することも可能となる

  ```json
  {
    "compilerOptions": {
      // ...
      "sourceMap": true // Generates corresponding '.map' file.
    }
  }
  ```

### outDir & rootDir

- TypeScript をコンパイルする際に、コンパイル対象となる TypeScript ファイルの配置場所を指定したり、コンパイルした JavaScript のファイルを出力する場所を指定することができる
- なおコンパイル元のフォルダ構造もそのまま保持される
- 実験

  - 以下のようなフォルダ構成にする

    ```bash
    -- root
       |-- dist
       |   |-- sample.js
       |-- src
       |   |-- sample.ts
       |
       |-- tsconfig.json
    ```

  - この時にコンパイル設定を以下のように設定できる

    ```json
    {
      "compilerOptions": {
        "outDir": "./dist", // .js の出力先フォルダ
        "rootDir": "./src" // .ts のコンパイル対象フォルダ
      }
    }
    ```

### removeComments

- TypeScript 内に記載されているコメントを出力しないようにする
- 出力される JavaScript のコード量を減らすことができる

  ```json
  {
    "compilerOptions": {
      "removeComments": true // コメントを出力しない
    }
  }
  ```

### noEmit

- コンパイル結果として JavaScript を出力しない
- TypeScript の機能を使ったエラー検証だけを実施したい場合に使用する

  ```json
  {
    "compilerOptions": {
      "noEmit": true // JavaScriptを出力しない
    }
  }
  ```

### downlevelIteration

- 最新の JavaScript の仕様で提案されているいくつかの for 文は、古い JavaScript だと動作しない場合がある
- そうした場合に for 文を正しく実行できるようにする
- ただしコード量が非常に増大するため、うまくいかない場合にのみ使用するといい

  ```json
  {
    "compilerOptions": {
      "downlevelIteration": true
    }
  }
  ```

### noEmitOnError

- TypeScript でコンパイルエラーが発生した場合に、JavaScript が生成されないようにする
- デフォルトだと、コンパイルエラーであっても JavaScript が生成される

  ```json
  {
    "compilerOptions": {
      "noEmitOnError": true
    }
  }
  ```

### Strict Type-Checking Options

- 厳密な型チェックを実行するためのオプションになる
- `strict` が `true` に設定されている場合、後続のオプションはすべて `true` と判断される

  ```js
  {
    "compilerOptions": {
      /* Strict Type-Checking Options */
      "strict": true /* すべての厳密な型チェックを有効化させる */,
      // "noImplicitAny": true,                 /* 暗黙的にanyの場合にエラーを発生させる */
      // "strictNullChecks": true,              /* nullではない可能性が存在する場合にエラーを発生させる */
      // "strictFunctionTypes": true,           /* 関数のパラメータや戻り値を厳密にチェックする。継承など */
      // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
      // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
      // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
      // "alwaysStrict": true,                  /* "use strict"を必ず付与する */
    }
  }
  ```

### Additional Checks

- 細かいチェックを実行することができる

  ```js
  {
    "compilerOptions": {
      /* Additional Checks */
      // "noUnusedLocals": true,                /* ローカル変数が使用されていない場合にエラーを発生させる */
      // "noUnusedParameters": true,            /* 関数などのパラメータが使用されていない場合にエラーを発生させる */
      // "noImplicitReturns": true,             /* 暗黙的にreturnした場合にエラーを発生させる */
      // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
      // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */
    }
  }
  ```

### Debugging

- 便利な拡張機能
  - ESLint
  - prettier
  - Debugger for Chrome
    - `sourceMap` を設定しておく必要がある

### 参考資料

- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Debugging TypeScript](https://code.visualstudio.com/docs/typescript/typescript-debugging)

## #4 Modern JavaScript

### const & let

- Modern な JavaScript では、大体は **ES6** を指している
- 新しく導入された機能の中でよく使用するものは `const` と `let` である
- 古い仕様で提案された `var` には、グローバルスコープと関数スコープしかないため、意図しないエラーを発生させる可能性がある

  ```js
  const age = 30;

  if (age > 29) {
    var outerScope = "out";
    let innerScope = "in";
  }

  console.log(outerScope); // 実行時にエラーが発生しない
  console.log(innerScope); // 実行時にエラーが発生する
  ```

### default parameter

- 関数呼び出し時などで、パラメータがデフォルトで有するパラメータを設定できる

  ```js
  const add = (a: number, b: number = 1) => {
    return a + b;
  };

  console.log(add(2)); // => 3
  ```

### spread operator

- **ES6** から導入されたスプレッド演算子を使用すれば、配列やオブジェクトのコピーを簡単に渡すことができる

  - 配列から要素を取り出す

    ```js
    const hobbies = ["Sports", "Cooking"];
    const activeHobbies = ["Hiking"];

    activeHobbies.push(...hobbies);
    // => activeHobbies.push(hobbies[0], hobbies[1]);
    ```

  - オブジェクトから、キーと値のペアを取り出す

    ```js
    const person = {
      name: "max",
      age: 30,
    };

    // 単なるオブジェクトの参照へのコピーではなく
    // 異なるオブジェクトへの参照として作成される
    const copiedPerson = {
      ...person,
    };
    ```

### rest parameters

- スプレッド演算子を関数の引数に使用することで、任意の数の引数を受け取ることができる。

  ```js
  // 可変長の数値型を引数に受け取る
  const add = (...numbers: number[]) => {
    // reduce
    // 第1引数のコールバック関数で現在の処理結果と、1つ1つの要素にアクセスできる
    // 第2引数で初期値を設定できる
    return numbers.reduce((curResult, curValue) => {
      return curResult + curValue;
    }, 0);
  };

  // 可変長で数値型を指定することができる
  const addedNumbers = add(5, 10, 3, 5.5);
  console.log(addedNumbers);
  ```

### Destructuring

- **ES6** では配列やオブジェクトに対して分割導入を行うことが可能である

  - 配列に関して分割代入を行ってみる

    ```js
    const hobbies = ["Sports", "Cooking"];

    const hobby1 = bobbies[0];
    const hobby2 = bobbies[1];

    const [hobby1, hobby2, ...remainingHobbies] = hobbies;
    ```

  - オブジェクトに対してもキーを指定することで値にアクセスできる

    ```js
    const person = {
      firstName: "max",
      age: 30,
    };

    // キーと同じ値を指定することで、同じ変数名に同じ値を格納できる
    const { firstName, age } = person;

    // 分割代入時に異なる変数名で値を格納できる
    const { firstName: userName, age } = person;
    ```

### 参考資料

- [JS 機能一覧](https://kangax.github.io/compat-table/es6/)
- [モダンな JavaScript の機能](https://typescript-jp.gitbook.io/deep-dive/future-javascript)

## #15 Node.js & TypeScript

### settings

- まずは環境設定を行う
- TypeScript にて以下の設定を変更しておく

  ```json
  {
    "compilerOptions": {
      // ...
      "target": "es2018",
      "module": "commonjs",
      "moduleResolution": "node",
      "outDir": "./dist",
      "rootDir": "./src"
      // ...
    }
  }
  ```

- 必要なパッケージをインストールする

  ```bash
  $ npm i -D @types/node @types/express
  ```

### using Types

- TypeScript を Node で使用する際、ESModule を使用すれば、TypeScript からコード補間などの機能を反映させることができる

  ```js
  // src/app.ts
  impoer express from "express";

  const app = express();

  app.listen(3000);
  ```

  - Express で使用するミドルウェアのハンドラーは、`@types/express` を使用することで型指定を行うことができる
  - 実際に以下のようにアプリを起動するためのトップファイルを作成できる

    ```js
    // src/app.ts

    // TypeScriptでExpressを使用するための型を読み込む
    import express, { Request, Response, NextFunction } from "express";
    import todoRoutes from "./routes/todos";

    const app = express();

    app.use(express.json());
    app.use("/todos", todoRoutes);

    // ハンドラ関数を自作する場合は、引数の型を指定することでTypeScriptの恩恵を受けることが可能となる
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        message: err.message,
      });
    });

    app.listen(3000);
    ```

  - また上記は Todo アプリの機能であるため、まずは Todo アプリに追加する内容をモデルとして定義しておく。
  - これで API に POST リクエストを投げた際に、オブジェクトのプロパティが暗黙的な `any` にならないようにすることができる

    ```js
    // src/models/todos.ts

    export class Todo {
      // コンストラクタを定義することで自動的にオブジェクトの値に紐づける
      constructor(public id: string, public text: string) {}
    }
    ```

  - では次に API にリクエストが来た際に実行する処理を行いうハンドラ関数を作成する
  - TypeScript 用の `RequestHandler` を指定すれば、関数の引数の 1 つ 1 に型を指定する必要がなくなる

    ```js
    // src/controllers/todos.ts

    // import { Request, Response, NextFunction } from "express";
    import { RequestHandler } from "express";
    import { Todo } from "../models/todos";

    // 特定のクラスの配列のみを受け取るようにできる
    const TODOS: Todo[] = [];

    export const createTodo: RequestHandler = (req, res, next) => {

      // Requestオブジェクトはどんなキーと値が含まれているのかわからない
      // そのためRequestボディの中身を特定の型にキャストする必要がある
      // 以下のようにキャストすると文字列型として認識される
      const text = (req.body as {text: string}).text;
      const newTodo = new Todo(Math.random().toString(), text);

      TODOS.push(newTodo);

      res.status(201).json({
        message: "TODOを作成しました",
        createdTodo: newTodo
      })
    }
    ```

  - あとは API のルートを設定すればいい

    ```js
    // src/routes/todos.ts

    import { Router } from "express";
    import { createTodo } from "../controllers/todos";

    const router = Router();

    router.post("/", createTodo);
    router.get("/");
    router.patch("/:id");
    router.delete("/:id");

    export default router;
    ```

### Complicated Handlers

- 残りの部分のルーターとコントローラを作成する

  - まずはルーターに残りの処理を追加する

    ```js
    // src/routes/todos

    import { Router } from "express";
    import {
      createTodo,
      deleteTodos,
      getTodos,
      updateTodos,
    } from "../controllers/todos";

    const router = Router();

    router.post("/", createTodo);
    router.get("/", getTodos);
    router.patch("/:id", updateTodos);
    router.delete("/:id", deleteTodos);

    export default router;
    ```

  - 次はコントローラの処理を CRUD に従って作成していく

    ```js

    ```

## 参考資料

- Udemy
  - [最短・最速で学ぶ TypeScript 実践入門 - 最新モダン開発には欠かせない TypeScript をマスターしよう！](https://www.udemy.com/course/typescript-typescript/)
  - [最速で学ぶ TypeScript](https://www.udemy.com/course/typescript-react-frontend/)
  - [【世界で 7 万人が受講】Understanding TypeScript - 2020 年最新版](https://nssol.udemy.com/course/understanding-typescript-jp/)
