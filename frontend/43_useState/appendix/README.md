# 補足

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Closure](#closure)
- [useState](#usestate)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[Getting Closure on React Hooks by Shawn Wang | JSConf.Asia 2019](https://www.youtube.com/watch?v=KJP1E-Y-xyo&t=1065s) を実践する。

## Closure

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

## useState

まずは `useState` 関数の入出力を定義する。

```ts
function useState(initialValue) {
  return [state, setState];
}
```

そこで初期値として与えられた値を状態として格納し、新しい値を受け取ってその状態を更新するための関数を作成すると以下の様になる。

```ts
function useState(initialValue) {
  const _val = initialValue;
  const state = _val;
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}
```

この場合、状態を更新する関数を呼び出しても一度返り値として返した状態の変数は中身が変わることはない。

```ts
const [count, setCount] = useState(1);

console.log(count); // 1
setCount(2);
console.log(count); // 1
```

このためには関数内に閉じている変数を返すような処理を追加する必要がある。

```ts
function useState(initialValue) {
  const _val = initialValue;
  const state = () => _val;
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}
```

これで関数を実行すれば現在の状態を取得することができる。

```ts
const [count, setCount] = useState(1);

console.log(count()); // 1
setCount(2);
console.log(count()); // 2
```

## 参考資料

- [Getting Closure on React Hooks](https://www.swyx.io/hooks/)
- [Deep dive: How do React hooks really work?](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)
