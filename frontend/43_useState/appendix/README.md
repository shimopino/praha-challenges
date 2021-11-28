# 補足

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [React Hooks 深掘り](#react-hooks-%E6%B7%B1%E6%8E%98%E3%82%8A)
  - [Closure](#closure)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## React Hooks 深掘り

[Getting Closure on React Hooks by Shawn Wang | JSConf.Asia 2019](https://www.youtube.com/watch?v=KJP1E-Y-xyo&t=1065s) を実践する。

### Closure

数値をインクリメントしていく関数を作成する場合、グローバルスコープの変数を使用すると以下の様に記述することができる。

```ts
let foo = 1;

function add() {
  foo = foo + 1;
  return foo;
}

console.log(add()); // 2
console.log(add()); // 3
console.log(add()); // 4
console.log(add()); // 5
console.log(add()); // 6
```

これで数値をインクリメントさせる関数を記述することができた。

しかし、今のままでは変数がグローバルスコープであるため、コードのどこからでも変数できてしまう状況である。

```ts
console.log(add()); // 2
console.log(add()); // 3
foo = 9999;
console.log(add()); // 10000
```

そこで **クロージャ** の概念を使用することで、関数内に変数のスコープを閉じる様にし、返り値として関数を返す高階関数を設計する。

```ts
function getAdd() {
  let foo = 1;
  return function () {
    foo = foo + 1;
    return foo;
  };
}
```

これで `getAdd()` 関数の実行時に内部の変数を初期化させ、返り値の関数を実行することで内部の変数をインクリメントさせることができる様になる。

```ts
const add = getAdd();
console.log(add()); // 2
console.log(add()); // 3
console.log(add()); // 4
console.log(add()); // 5
console.log(add()); // 6
```

しかし、関数を取得するためにわざわざ `getAdd()` 関数を呼び出すのは少々面倒である。

そこで即時関数を使用したモジュールパターンと呼ばれるものが存在する。

```ts
const add = (function () {
  let foo = 1;
  return function () {
    foo = foo + 1;
    return foo;
  };
})();
```

## 参考資料

- [Getting Closure on React Hooks](https://www.swyx.io/hooks/)
- [Deep dive: How do React hooks really work?](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)
