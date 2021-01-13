# ミドルウェアの基礎

- 通常のミドルウェア関数の構築
- エラー処理を考慮したミドルウェア関数の構築
- 静的ファイルとの組み合わせ

NodeJSの場合は以下のように、1つのリクエストハンドラ関数を作成してリクエストとレスポンスの処理を行う。
レスポンスに対して`end()`を呼び出すことで、レスポンスへの書き込みが終了しレスポンスを送信する準備が整っていることを、Nodeサーバに伝えている。

```js
const http = require("http");

const onRequest = (request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

http.createServer(onRequest).listen(8888);
```

Expressの場合には、ミドルウェアスタックと呼ばれる関数の配列に対して、リクエストとレスポンスが渡される。
Expressはリクエストとレスポンスに対して、スタックの最初の関数から順番に処理を進めていく。

ミドルウェアスタックに登録する関数は、すべて同一の構造を有している。

```js
/**
 * request  : HTTPリクエスト
 * response : HTTPレスポンス
 * next     : ミドルウェアスタックの次の関数を呼び出す関数
 */
function(request, response, next)
```

またNodeJSの時の同様に、ミドルウェアスタックの中で必ず1回`response.end()`を呼び出して、NodeJSのサーバにリクエストを送信できることを伝えなければならない。

---

静的ファイルのServing

- 製作するサーバの要件
  - ロギング
    - リクエストのURLとのその時間を出力する
    - 必ず後続処理を実行する
  - static serving
    - 要求されたパスのファイルを返す
  - 404 error
    - 要求されたパスが存在しない場合は404を返す

上記の3つの要素をミドルウェア関数として構築していく。

なお、ソースコードを変更するたびに`npm start`を再実行することが面倒であれば、nodeではなくnodemonを使用してサーバを起動する。

- `npm install --save nodemon`
- `"start": "nodemon app.js"`

---

エラー処理

- エラー処理では専用のミドルウェア関数が呼び出される
- 専用のミドルウェアの呼び出し方は以下になる
  - 慣例的に`Error`オブジェクトを`next()`の引数に渡す
  - 例：`next(new Error("Something bad happened!"))`
  - 慣例的にミドルウェアスタックの最後のほうにエラー処理は追加する
- なお`next()`の引数に何も渡されなければ、エラー処理用のミドルウェアは呼び出されない
- `throw`で例外を送出した場合はミドルウェアは呼び出されないため注意が必要

エラー処理用のミドルウェア関数は以下のように定義されている。

```js
/**
 * error    : Errorオブジェクト
 * request  : HTTPリクエスト
 * response : HTTPレスポンス
 * next     : ミドルウェアスタックの次の関数を呼び出す関数
 */
function(error, request, response, next)
```

---

