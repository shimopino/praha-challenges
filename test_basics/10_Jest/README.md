# 課題10「jestで単体テストを書こう」

<!-- START doctoc -->
<!-- END doctoc -->

## 課題1

優良コースですが Udemy の [Unit Testing for Typescript & NodeJs Developers with Jest](https://www.udemy.com/course/unit-testing-typescript-nodejs/) を受講しました。

TypeScriptとNode.jsを使ったアプリに対して単体テストを行う内容で非常にわかりやすかったです。

上記コースを進めながら以下のサイトを辞書的に使ってました。

https://jestjs.io/docs/ja/getting-started
https://jestjs.io/docs/ja/using-matchers
https://jestjs.io/docs/ja/asynchronous
https://jestjs.io/docs/ja/setup-teardown
https://jestjs.io/docs/ja/mock-functions

## 課題2

https://github.com/KeisukeShimokawa/praha-challenge-templates/tree/feature/task10-jest-unittest/jestSample

## 課題3

### 質問1: なぜ元の関数はカバレッジが100％のテストを書けなかったのか

`asyncSumOfArraySometimesZero` と `getFirstNameThrowIfLong` でカバレッジが100％のテストを記述することができない理由は、それぞれの関数がほかのオブジェクトに依存する形で実装されているためである。

`asyncSumOfArraySometimesZero ` 関数の場合は、ランダムで例外を送出してしまう `DatabaseMock` オブジェクトに依存しており、単体テストを実行するたびに挙動が変化してしまい、常にカバレッジが100％のテストを実装することが難しい。

同様に `getFirstNameThrowIfLong` 関数の場合は、外部APIに通信を行い、その結果を受けてランダムに例外を送出してしまう `NameApiService` オブジェクトに依存しており、こちらでも単体テストを実行するたびに挙動が変化してしまい、常にカバレッジが100％のテストを実装することが難しい。

### 質問2: 依存性の注入とは何か

### 質問3: 依存性の注入によるモジュール同士の結合度の強さはどのように変化したのか

### 質問4: 単体テストで外部サービスとの通信が発生する場合のデメリットは何か

### 質問5: sumOfArrayを空配配列時に例外ではなく0を返すように修正してみましょう

そもそもの [`Array.prototype.reduce()`] メソッドの使い方を振り返る。

```js
/*
 * @param callback      : 配列の全ての要素に対して実行される関数
 * @param initialValue  : コールバックの最初の呼び出しの最初の引数として使用する値
*/
arr.reduce(callback( accumulator, currentValue[, index[, array]] ) {
  // return result from executing something for accumulator or currentValue
}[, initialValue]);
```

つまり `sumOfArray` を以下のように変更すればいい。

```js
export const sumOfArray = (numbers: number[]): number => {
  // コールバック関数の後で空配列時の初期値を0を指定すればいい
  return numbers.reduce((a: number, b: number): number => {
      return a + b;
  }, 0);
};
```

上記の変更を加えた後でテストを実行すると、以下のようにもともと例外を送出していることを検証しているテストケースが失敗していることがわかる。

```bash
Jestで単体テストを書こう
  sumOfArray
    ✓ [1, 1]を渡すと2が返ってくる (1 ms)
    ✕ 空の配列を渡すと例外が送出される (1 ms)
    ✓ [1]を渡すと1が返ってくる
    ✓ [-2, 2]を渡すと0が返ってくる
    ✓ [0.2, 0.1]を渡すと0.3が返ってくる (1 ms)
  asyncSumOfArray
    ✓ [1, 1]を渡すと2が返ってくる
    ✕ 空の配列を渡すと例外が送出される (2 ms)
    ✓ [1]を渡すと1が返ってくる
    ✓ [-2, 2]を渡すと0が返ってくる
    ✓ [0.2, 0.1]を渡すと0.3が返ってくる (1 ms)
  asyncSumOfArraySometimesZero
      ✓ デフォルト引数のコンストラクタ
      ✓ DI: [1, 1]を渡せば2が返ってくる (1 ms)
      ✓ DI: []を渡せば0が返ってくる (1 ms)
  getFirstNameThrowIfLong
      ✓ デフォルト引数のコンストラクタ (1 ms)
      ✓ 取得した名前の長さが指定した最大値よりも短い場合はそのまま返す
      ✓ 取得した名前の長さが指定した最大値よりも長い場合に例外送出 (1 ms)
```

### 質問6: 質問5に対応する単体テストを実装してみましょう

## 課題4

 

## 参考資料

- [Facebook製のJavaScriptテストツール「Jest」の逆引き使用例](https://qiita.com/chimame/items/e97883fd46b67529d59f)