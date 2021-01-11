# リクエストをパースする Web サーバを構築する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題 1](#%E8%AA%B2%E9%A1%8C-1)
  - [Express の実装メモ](#express-%E3%81%AE%E5%AE%9F%E8%A3%85%E3%83%A1%E3%83%A2)
  - [cURL](#curl)
  - [Postman](#postman)
  - [VSCode Rest Client](#vscode-rest-client)
  - [request.body はなぜストリーム形式なのか](#requestbody-%E3%81%AF%E3%81%AA%E3%81%9C%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%A0%E5%BD%A2%E5%BC%8F%E3%81%AA%E3%81%AE%E3%81%8B)
    - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)
- [課題 2](#%E8%AA%B2%E9%A1%8C-2)
  - [`application/x-www-form-urlencoded`](#applicationx-www-form-urlencoded)
  - [`application/json`](#applicationjson)
  - [使い分け](#%E4%BD%BF%E3%81%84%E5%88%86%E3%81%91)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題 1

### Express の実装メモ

リクエストを parse する際に、以前は`body-parser`モジュールが使用されていたが、Express4.x 以降からは`express`自体がラップを提供している。

- [express.json などの実装](https://github.com/expressjs/express/blob/508936853a6e311099c9985d4c11a4b1b8f6af07/lib/express.js#L78)

Jsonオブジェクトをパースする際に`express.json()`をミドルウェアとして登録することが通常のやり方である。

ここでJSONモジュールの`JSON.parse`を使用すると大きく性能が低下する。これは`JSON.parse`が同期処理にしか対応しておらず、ブロッキング処理となってしまうからである。

- [Node.js徹底攻略 ─ ヤフーのノウハウに学ぶ、パフォーマンス劣化やコールバック地獄との戦い方](https://eh-career.com/engineerhub/entry/2019/08/08/103000)

### cURL

```bash
$ curl localhost:8080 -H "Content-Type: application/json"
{"text":"hello world"}

$ curl localhost:8080 -d '{"name": "hoge"}' -H "Content-Type: application/json"
{"name":"hoge"}

$ curl localhost:8080 -d '{"name": "hoge"}'
{"error":"400! Bad Request"}
```

### Postman

[https://documenter.getpostman.com/view/9645891/TVt2c3oU](https://documenter.getpostman.com/view/9645891/TVt2c3oU)

### VSCode Rest Client

単純なリクエストであれば VSCode の拡張機能である「[Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)」を使用することが可能である。

以下のコマンドを`.http`という拡張子のファイルに記載しておけば、HTTP リクエストとそのレスポンスを確認することができる。

```bash
GET http://localhost:8080/ HTTP/1.1

###

POST http://localhost:8080/ HTTP/1.1
Content-Type: application/json

{
    "name": "hoge"
}

###

POST http://localhost:8080/ HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=hoge
```

### request.body はなぜストリーム形式なのか

- Nodejs の特徴

  - コールバック関数を利用したノンブロッキング I/O を提供する

    - 同期的的なファイル I/O

      ```js
      const fs = require("fs");
      const data = fs.readFileSync("./file.md");
      // 後続処理はファイル読み込みが終了するまでブロックされる
      ```

    - 非同期的なファイル I/O

      ```js
      const fs = require("fs");
      fs.reaFile("./file.md", (err, data) => {
        if (err) throw err;
      });
      // 後続処理はブロックされることなく実行される
      ```

- Nodejs でのストリームの取り扱い

  - Nodejs では`Stream`オブジェクトでデータストリームを扱っている
  - ノンブロッキング I/O の形式でファイルの読み書きを記載すると、以下のように書ける

    ```js
    fs.readFile("file.md", (err, data) => {
      fs.writeFile("dest.md", data);
    });
    ```

    - しかし上記の処理では、すべてのデータを読み切った後で、すべてのデータを書き込む処理になっている
    - 対象のファイルの容量が 2GB の場合には、メモリも同様に 2GB 消費することになる

  - ストリーム API を使用することで、ファイルをチャンクごとに読み込みから書き込みまで実行することができる。

    - ストリームをそのまま使用する場合

      ```js
      const src = fs.createReadStream("file.md");
      const dest = fs.createWriteStream("file.md");

      src.on("data", (chunk) => dest.write(chunk));
      src.on("end", () => dest.end());
      ```

    - `pipe()`を使用する場合

      ```js
      const src = fs.createReadStream("file.md");
      const dest = fs.createWriteStream("file.md");

      src.pipe(dest);
      ```

  - `body-parser`の例

    - `body-parser`でもストリーム形式でリクエストを処理している。

    - 例えば以下のように`Content-Encoding`をもとにパイプ処理を実行している。

      ```js
      function contentstream(req, debug, inflate) {
        var encoding = (
          req.headers["content-encoding"] || "identity"
        ).toLowerCase();
        // ...

        switch (encoding) {
          case "deflate":
            stream = zlib.createInflate();
            debug("inflate body");
            req.pipe(stream);
            break;
          case "gzip":
            stream = zlib.createGunzip();
            debug("gunzip body");
            req.pipe(stream);
            break;
          case "identity":
            stream = req;
            stream.length = length;
            break;
        }
      }
      ```

    - 参考資料

      - [body-parser の該当処理](https://github.com/expressjs/body-parser/blob/master/lib/read.js#L158)

#### 参考資料

- [Nodejs Stream API](https://nodejs.org/api/stream.html)
- [ブロッキングとノンブロッキングの概要](https://nodejs.org/ja/docs/guides/blocking-vs-non-blocking/)
- [strean-handbook](https://github.com/meso/stream-handbook)
- [Node.js の Stream API の概要](https://qiita.com/takaaki7/items/fbc33dff1e17fe6a3d38)
- [Node.js Stream を使いこなす](https://qiita.com/masakura/items/5683e8e3e655bfda6756)
- [ストリーム処理とは何か？＋ 2016 年の出来事](https://qiita.com/kimutansk/items/60e48ec15e954fa95e1c)
- [Why is Node.js scalable?](https://stackoverflow.com/questions/16949483/why-is-node-js-scalable)
- [Node.js の Stream API で大量プッシュ通知を高速化するテクニック (1/2)](https://www.atmarkit.co.jp/ait/articles/1502/12/news026.html)

## 課題 2

POST リクエストを送信する際に、`Content-Type`による挙動の違いをまとめる。

### `application/x-www-form-urlencoded`

```bash
$ curl https://httpbin.org/post \
  --request POST \
  --data "name=hoge"

>>
POST /post HTTP/2
Host: httpbin.org
user-agent: curl/7.68.0
accept: */*
content-length: 9
content-type: application/x-www-form-urlencoded

name=hoge
```

### `application/json`

```bash
$ curl https://httpbin.org/post \
  --request POST \
  --data '{"name": "hoge"}' \
  --header "Content-Type: application/json"

>>
POST /post HTTP/2
Host: httpbin.org
user-agent: curl/7.68.0
accept: */*
content-type: application/json
content-length: 16

{"name": "hoge"}
```

### 使い分け

| Content-Type | `x-www-form-urlencoded`                                                           | `json`                                |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------- |
| データ形式   | key=value                                                                         | {"key": "value"}                      |
| 用途         | HTML フォームを介した POST リクエスト                                             | XMLHttpRequest<br>Fetch API           |
| 特徴         | - json のような階層構造のデータを扱うことは難しい<br>- パーセントエンコーディング | - 近年の API でよく使用されている形式 |

- 参考資料

  - [[MDN Web Docs] POST](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/POST)
  - [[OAUTH-WG] application/x-www-form-urlencoded vs JSON](https://mailarchive.ietf.org/arch/msg/oauth/D4d6dCQSvmO1G3ST5q6_xQ6En4w/)
