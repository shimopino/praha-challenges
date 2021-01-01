# Node.jsの基礎

モジュールの使用

- JavaScriptでは、外部モジュールの読み込みを行うために、CommonJSが開発されている
- 読み込む対象は3つ
  - ビルドインモジュール
  - サードパーティ製モジュール
  - 自作モジュール

ビルドインモジュール

- よく使用するものとしてURLの解析である
- これは`Node.js`のライブラリであり、`url`モジュールとして読み込み、`parse`関数を使用すれば解析できる

サードパーティ製モジュール

- `Node.js`では`package.json`でライブラリの管理やプロジェクトの管理を行っている

```json
{
    "name": "my-first-project",
    "author": "keisuke",
    "private": true,
    "version": "0.2.0",
    "dependencies": {}
}
```

- ではテンプレートシステムである`Mustache`を使用してみる
- このライブラリは、以下のように所定の場所に文字列を挿入することができる

```js
Mustache.render('Hello, {{first}} {{last}}!', {
    first: "Nicolas",
    last: "Cage"
});
```

- まずはプロジェクトを初期化するために`npm init`を実行する
- 次にライブラリを読み込む`npm install --save mustche`
- `--save`を付与することで、`package.json`にライブラリのインストールを反映できる

自作モジュール

- 自作モジュールを作成する際は、`module.exports`を指定して変数を1つ外部に公開することができる
- これで取り込む場合は、他のモジュールと同様に`require('./random-integer');`を指定すれば読み込むことが可能となる
- 自作モジュールを一般に公開したい場合は以下を参考
  - [Publishing a simple package to npm](http://evanhahn.com/make-an-npm-baby/)

---

`Node.js`による非同期処理

- 重要なことは、非同期で処理を実行できるだけで、同じタイミングで2つの処理ができるというわけではない点である
- ファイルI/Oなどを非同期で実行することで、ユーザーにファイルのアップロードを要求している中で、ほかのユーザーからのリクエストを処理可能
- `Express`で取り扱う外部リソースは主に2つ
  - ファイルシステム
    - ファイルの読み書き
    - etc
  - ネットワーク
    - リクエストの受信
    - レスポンスの送信
    - etc
- 非同期処理はJavaScriptのコールバック関数を呼び出す形で実行される

具体的な非同期処理の例

- 例えば以下の処理を実行した際に、出力される順番はどうなるでしょうか

```js
const fs = require('fs');

const options = { eoncoding: 'utf-8' };

fs.readFile('myfile.txt', options, (err, data) => {
  if (err) {
    console.error('Error reading file');
    return;
  }
  console.log(console.log(data));
})

console.log('global end');
```

- 処理の順番を理解するためには、コールバック、タスクキュー、イベントループの理解が必要である
- `fs.readFile`は非同期処理であり、グローバルコンテキストが終了し、コールスタックが空になった後で、引数に渡したコールバック関数が実行される
- おすすめ動画
  - [イベントループとは一体何ですか？ | Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

---

HTTPサーバの構築

- `http`モジュールを使用すると、`Node.js`でWebサーバを構築することができる
- `http`モジュールを行っていることが、`Express`で代替しているものである
- `http`モジュールの`createServer`関数を使用することで、サーバがリクエストを受け付けるたびに、コールバック関数を呼び出すサーバオブジェクトを作成できる

では実際にWebサーバを構築する

```js
// コールバック関数を定義する
const requestHandler = (req, res) => {
  console.log('In comes a request to: ' + req.url);
  res.end('Hello world');
}
```

次に`createServer`関数に、作成したコールバック関数を指定することで、クライアントからのリクエストを受け付けるたびに、コールバック関数が呼び出される。

```js
const server = http.createServer(requestHandler);
```

これでリクエストを処理するWebサーバを構築することができた。また以下のように様々なリソースに対するリクエストを定義することができる。

```js
const requestHandler = (req, res) => {
  if (req.url === '/') {
    res.end('welcome to the homepage!');
  } else if (req.url === '/about') {
    res.end('welcome to the about page!');
  } else {
    res.end('Error! file not found');
  }
}
```

上記からわかるように、このWebサーバにAPIを100個定義することになった場合を想像すると、`requestHandler`関数が肥大化することが懸念される。

そこで`Express`の出番である
