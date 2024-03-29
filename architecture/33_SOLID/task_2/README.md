# 任意課題

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [凝集度](#%E5%87%9D%E9%9B%86%E5%BA%A6)
  - [1. 機能的凝集](#1-%E6%A9%9F%E8%83%BD%E7%9A%84%E5%87%9D%E9%9B%86)
  - [2. 逐次的凝集](#2-%E9%80%90%E6%AC%A1%E7%9A%84%E5%87%9D%E9%9B%86)
  - [3. 通信的凝集](#3-%E9%80%9A%E4%BF%A1%E7%9A%84%E5%87%9D%E9%9B%86)
  - [4. 手順的凝集](#4-%E6%89%8B%E9%A0%86%E7%9A%84%E5%87%9D%E9%9B%86)
  - [5. 時間的凝集](#5-%E6%99%82%E9%96%93%E7%9A%84%E5%87%9D%E9%9B%86)
  - [6. 論理的凝集](#6-%E8%AB%96%E7%90%86%E7%9A%84%E5%87%9D%E9%9B%86)
  - [7. 偶発的凝集](#7-%E5%81%B6%E7%99%BA%E7%9A%84%E5%87%9D%E9%9B%86)
- [結合度](#%E7%B5%90%E5%90%88%E5%BA%A6)
  - [1. メッセージ結合](#1-%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E7%B5%90%E5%90%88)
  - [2. データ結合](#2-%E3%83%87%E3%83%BC%E3%82%BF%E7%B5%90%E5%90%88)
  - [3. スタンプ結合](#3-%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%E7%B5%90%E5%90%88)
  - [4. 制御結合](#4-%E5%88%B6%E5%BE%A1%E7%B5%90%E5%90%88)
  - [5. 外部結合](#5-%E5%A4%96%E9%83%A8%E7%B5%90%E5%90%88)
  - [6. 共通結合](#6-%E5%85%B1%E9%80%9A%E7%B5%90%E5%90%88)
  - [7. 内部結合](#7-%E5%86%85%E9%83%A8%E7%B5%90%E5%90%88)
- [凝集度の判定ロジック例](#%E5%87%9D%E9%9B%86%E5%BA%A6%E3%81%AE%E5%88%A4%E5%AE%9A%E3%83%AD%E3%82%B8%E3%83%83%E3%82%AF%E4%BE%8B)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 凝集度

凝集度は、コードがどれだけそのモジュール (クラスや関数) の責任分担に集中しているのかをあらわす尺度であり、SOLID原則のうち、単一責任の原則とも関係している。

凝集度が高いモジュールは、堅牢性・信頼性・再利用性・可読性などの点で好ましく、常に凝集度の高いモジュールを設計できるように、知識や経験を身に着けておくべきである。

凝集度は、高いほど良いとされている順序尺度であり、以下の順番にしたがって凝集度は高くなっている。

1. 機能的凝集
2. 逐次的凝集
3. 通信的凝集
4. 手順的凝集
5. 時間的凝集
6. 論理的凝集
7. 偶発的凝集

### 1. 機能的凝集

単一の機能のみを提供するモジュールである。

例えば以下は引数でプリミティブ型を受け取り、引数同士の掛け算を行っているだけの単純なモジュールである。

```typescript
/**
 * 引数で与えられた税抜き価格と税率から、税込み価格を計算する
 * 
 * @param {number} price - 税抜き価格
 * @param {number} taxrate - 税率
 */
function calculateTaxPrice(
  price: number,
  taxrate: number
): number {
  return price * taxrate;
}
```

### 2. 逐次的凝集

ある部分の出力が別の部分の入力となるような部分を集めたモジュールである。

例えば以下の関数では、引数で与えられた数値の計算結果を、関数内で呼び出しているほかの関数への入力として渡している。

```typescript
/**
 * 商品のIDをもとに、商品の税込み価格を計算する
 * 
 * @param {string} - 商品のID
 * @return {number} 商品の税込み価格
 */
function getProductPrice(productId: string): number {

  // getOriginalPrice関数の出力を、calculateTaxPrice関数に渡す
  const productPrice = getOriginalPrice(productId);
  const taxPrice = calculateTaxPrice(productPrice);
  return taxPrice;
}
```

### 3. 通信的凝集

同じデータを扱う部分を集めたモジュールである。

例えば以下の関数では、引数で与えられたデータに対して、異なる操作を実行する複数のモジュールがまとめられている。

```typescript
/**
 * 商品IDをもとに、対象の商品の情報を更新する
 * 
 * @param {string} - 商品ID
 */
function changeProductInfo(productId: string): void {
  changeProductName(productId);
  changeProductPrice(productId);
  changeProductOwner(productId);
}
```

なおこの段階では関数内での実行順序に意味はない。

### 4. 手順的凝集

実行順番に意味のあるものを集めたモジュールである。

例えば以下の関数では、引数で与えられたデータに対して、先に整合性などの確認を行い、そのあとで実行したい操作を実現している。

```typescript
/**
 * 商品IDをもとに、対象の商品の整合性確認と商品情報更新を実行する
 * 
 * @param {string} - 商品ID
 */
function checkAndChangeProductInfo(productId: string): void {
  // 先に整合性の確認を行う
  !existProduct(productId);
  !checkProductStatus(productId);

  // 整合性の確認が終了した後で、更新処理を実行する
  changeProductInfo(productId);
}
```

### 5. 時間的凝集

モジュール内の各部分が時間的に近く動作するモジュールである。

例えば以下の関数では、アプリケーションの初期化処理を1つのモジュールにまとめた関数であり、時間的に近いだけで実行順序に意味はない。

```typescript
/**
 * アプリケーションを立ち上げる際に、設定ファイルやDBとの接続
 * ロガーの生成などを行う`
 * 
 * 時間的に近いだけで、実行順序を入れ替えても動作する
 */
function initializeApp(): void {
  initConfig();
  connectDB();
  getLogger();
}
```

### 6. 論理的凝集

論理的に似ている複数の処理が1つにまとまったモジュールである。

例えば以下の関数では、論理的に似た意味を持つ関数を引数で渡されたフラグを用いて分岐させており、実行側はモジュールの内部構造を意識してフラグを渡さなければならない。

```typescript
/**
 * 論理的に似た複数の処理を、引数のフラグで分岐実行させる
 * 
 * @param {boolean} - 分岐フラグ
 */
function aggregateProcess(isSomething: boolean): void {
  if isSomething {
    logicallyResembleFuncA();
  } else {
    logicallyResembleFuncB();
  }
}
```

### 7. 偶発的凝集

無作為に集められたモジュールが存在しており、各部分に関連性がないモジュールである。

例えば以下の関数では、内部のモジュールや処理には何も関連性はなく、とりあえずは動いているような状況である。

```typescript
/**
 * 無作為な処理が実行されている
 */
function randomProcess(): void {
  const user = getUser(userId);
  const taxPrice = calculateTaxPrice(1000, 1.08);
  console.log("processing");
}
```

実際は偶発的凝集を発生させてしまうようなことはない。

## 結合度

結合度は、モジュール同士がどの程度相互依存しているのかを示す尺度である。

結合度が低いほど、各モジュールの関連性は伝搬せず、意図しない箇所で不具合が発生してしまうことを防ぐことができる。

結合度は以下の順番に従って低いとされている。

1. メッセージ結合
2. データ結合
3. スタンプ結合
4. 制御結合
5. 外部結合
6. 共通結合
7. 内部結合

### 1. メッセージ結合

最も結合度が低く、引数のないメソッド呼び出しによる結合である。

例えば以下の関数では、関数の内部でさらに関数を呼び出しているが引数は渡していないため、関数同士の結合度は低いとされる。

```typescript
function main() {
  initialize();
  setUP();
}
```

### 2. データ結合

プリミティブな値の引数を使って、モジュール間でのデータ共有を行う結合である。

例えば以下の関数では、関数内で生成したプリミティブな値を、関数内のほかの関数 (モジュール) に対して、引数として渡して、計算結果を受け取っている。

```typescript
function main() {
  const radius = 1.0;
  const area = calculateArea(radius);
}
```

### 3. スタンプ結合

複数のモジュールがデータ構造を共有し、その一部のみを使ったり、異なる部分を使ったりする結合である。

例えば以下の関数では、`User` というデータ構造をモジュールに渡している。

```typescript
function main() {
  const user: User = {
    name: 'keisuke shimokawa',
    address: 'xxx-xxx',
    phone: 'xxx-xxx-xxx'
  }

  const result = updateUser(user);
}
```

スタンプ結合では、モジュールが必要としないフィールドが変更されることにより、モジュールのレコードを読み取る方法を変更することに繋がってしまう可能性がある。

### 4. 制御結合

関数パラメータを使って、対象のモジュールに何をすべきかについての情報を渡すことで、別のモジュール処理の流れを制御する結合である。

```typescript
function main() {
  logicallyResembleFunc(true);
}

function logicallyResembleFunc(isSomething: boolean) {
  // 論理的凝集が発生する
  if isSomething {
    logicallyResembleFuncA();
  } else {
    logicallyResembleFuncB();
  }
}
```

モジュールの実装からわかるように、論理的凝集が発生してしまう。

### 5. 外部結合

外部結合は、単一のグローバル変数に依存しており、外部ツールやデバイスの通信に関連する処理を実行する際に発生することがある。

```typescript
function exeternalCoupling1() {
  // グローバルなシングルトンにキャッシュを保存
  const userCache = UserCacheImpl.getInstance();
  const user = userCache("user1");
}

function exeternalCoupling2() {
  const newUser = {
    name: 'sample1'
  }
  // グローバルなシングルトンからキャッシュを取得
  const userCache = UserCacheImpl.getInstance();
  userCache.update("user1", newUser);
}
```

### 6. 共通結合

複数のモジュールが同じグローバルデータにアクセスできる状態である。

例えば以下の関数では、それぞれのモジュールが共通のグローバル変数を編集しており、予期しない副作用が発生してしまう可能性が存在する。

```typescript
const user = {
  name: 'sample1',
  address: 'xxxxxxxxxx',
  phone: 'xxx-xxx-xxx'
}

function updateUser1() {
  user.name = 'sample2';
}

function updateUser2() {
  user.address = 'oooooooooo';
}
```

### 7. 内部結合

あるモジュールが、別のモジュールの内部動作によって変化したり、依存したりする。

例えば以下の関数では、モジュール内で呼び出しているほかのモジュールに変更が加えられると、呼び出し元のモジュールにも変更を加えなければならない可能性が発生する。

```typescript
function internalJoinTypeMethod(name: string): Employee {
  const employees = unJoinTypeMethod();
  const result = employees.filter((employee) => employee.includes(name));

  return result;
}

function unJoinTypeMethod(): Employees {
  return [new Employee('name1'), new Employee('name2'), new Employee('name3')];
}
```

## 凝集度の判定ロジック例

以下に面白いツイートがあったので載せておく。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Cohesion(凝集度)という概念が作られた47年前の論文読んでみたら、すでに完成された無茶苦茶分かりやすい判定ロジックが書いてあるのですよね。<a href="https://t.co/vOCxwswUOt">https://t.co/vOCxwswUOt</a> <a href="https://t.co/caHHmSoZkO">pic.twitter.com/caHHmSoZkO</a></p>&mdash; :craftsman/kawasima (@kawasima) <a href="https://twitter.com/kawasima/status/1382682335301099522?ref_src=twsrc%5Etfw">April 15, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

1. モジュールの機能を説明する文を書く
2. 句点を含む、複数の文から構成されている、または1つ以上の動詞を持っている
    - 1つ以上の機能を持っている
    - 逐次的凝集、通信的凝集の可能性が高い
3. 文が時間と関係している単語 (「最初」「次に」「～の後」「～するとき」) を」含む
    - 逐次的凝集、一時的凝集の可能性が高い
4. 文の述語が、単一の特定オブジェクトを含んでいない
    - 論理的凝集の可能性が高い
5. 「初期化」や「クリーンアップ」が含まれている
    - 一時的凝集

ただしこの記述はオブジェクト指向の考え方が出てくる前の判定例なので、今使用する場合は適宜言い換えが必要らしい。

## 参考資料

- [[Wikipedia] 凝集度](https://ja.wikipedia.org/wiki/%E5%87%9D%E9%9B%86%E5%BA%A6)
- [[Wikipedia] 結合度](https://ja.wikipedia.org/wiki/%E7%B5%90%E5%90%88%E5%BA%A6)
- [ オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling](https://speakerdeck.com/sonatard/coheision-coupling)
- [良いコードとは何か - エンジニア新卒研修 スライド公開](https://speakerdeck.com/moriatsushi/liang-ikodotohahe-ka-enziniaxin-zu-yan-xiu-suraidogong-kai)
- [モジュール結合度について](https://qiita.com/eKushida/items/39bdb3f88fb68ecd66f6)
- [TypeScript Playground](https://www.typescriptlang.org/play?#code/PQKhFgCgAIWxUfUA6mhzBkHBygJBkJEMgYhkPoMg4L0ByjQWQZBC+UB4LQCwZ9Bw50GkGTQQAZ9Ae+MH8GCwJIZAIKMHTvQTQZA0QxRY0EXAACABwCGAJxkBbaAG8AdgFdFAIwCmcgL7QpcgJYBjXdAC00ImXLjo0+UtWad+owBcZADwVvK1taJwk5XW8NOTV3LT1DO3YKcWAoADMNNXNvUwB7WPMZABtzDWKZIIAVfwAFM0sAChFjBt0ALmgPBIAaFt8Ayo6u+P0oAEpO7v1VFoiomNaLKzgBwN0AbigDKChQCBg4QDFVQEGVQDsGAEkAEU5AIIZKQGsGRlOz1g5yHgFhQ7EflwVlCoAM7eMxqADmRlsL2uYXm0Vi6lGiRebxShzSkEy2VyBWg4Mi9TyABMNDl6stGiYSWTvBdiZ0QWDwZMRp45LMYNBzAUQa0aeS2tAALz4yIAeTM4NMahKFKa1NJOXp4y2XJ5aj5A3lVlFRVK5SGNT8OqpcgF3h1qrmkQR0G1bTVO0gezATlO1zuj0YgD-tQCGMWcXoBRg0AjBqcQAvZoAG0yETjCsgBqiZMshNmgHquqQyWRy+UKAAsZBDdESlXS1Ok8maLfTGaDk6yAG55UzEznQbkFosl2kAOSUuirpZVavb5k7BO7gspitpw5aY8LE-NpfFAHc1PpB7PidbIM7XQdROmvU9-YHzoAXU0AECqAcgNAF0egFioyinUNRziAfO1ADIRMZ+cdcgKTCEoTTE5YQxLMcVzDtdHMABrABBNRiQAYXHYtl1nctKxnZUGWgQCWU6JsWzbaBgGAaBAAlFB5rxvM5H04T9ADEGFoAEJdD8UwQUnbwt1w3d21YscYNgniAGVfCiIE+LpHc1RacjoFo+iH0AGQZACFfQAwuUAdQZcEAGP1kEYKNADPFQAwFw-b9vlHNCeIuLCZLnPcgA)
