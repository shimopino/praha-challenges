<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [APIの構築](#api%E3%81%AE%E6%A7%8B%E7%AF%89)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# APIの構築

- ではJSONを使ったAPIを構築していく

---

APIの説明

- JSONを介してコンピュータ間の通信を行う
  - クライアントは以下のようにHTTPリクエストを送信する

    ```js
    /timezone?tz=America+Los_Angeles
    ```

  - サーバは以下のようなJSONをレスポンスとして送信する

    ```json
    {
      "time": "2015-06-09T16:20:00+01:00",
      "zone": "America/Los_Angeles"
    }
    ```

- 上記のようなAPIを構築しておけば、どのようなコンピュータが相手であってもJSONに対応していれば通信することが可能となる
  - 画面でいい
  - モバイルアプリでもいい
  - CLIからでもいい

---

ExpressでのAPI構築

- 以下の要件を満たすサーバを構築してみましょう
  - エンドポイントは`/random/<min>/<max>`
  - リクエストとして`<min>`から`<max>`までの整数から1つをランダムにJSONレスポンスとして返す
    
    ```json
    {
        "result": "ランダムに選択した整数",
    }
    ```
    
  - `<min>`あるいは`<max>`が`NaN`の場合は以下を返す
    - ステータスコードは400
    - リクエストとして以下のJSONオブジェクトを返す
      
      ```json
      {
          "error": "Bad Request"
      }
      ```

---

CRUDを満たすAPIの構築

- CRUDに対応するAPIを構築する
- HTTPリクエストで対応するメソッドは以下になる
  - GET
    - サーバのリソースを取得する
    - HTMLファイルや画像などを取得する
    - 重要な点は`Idempotent`であること
    - つまりリソースに対してGETリクエストを投げる場合、いつどのようなタイミングで実行しても結果が変化することがないということである
  - POST
    - サーバに新たなレコードを生成する
    - 記事の投稿や写真の投稿など
    - 重要な点は`Idempotent`ではないこと
    - つまり1回目のPOSTと、2回目・3回目以降のPOSTでは結果が変化する点である
  - PUT
    - サーバのレコードを変更する
    - 記事の更新など
    - 重要な点は`Idempotent`であること
    - つまり何百回とPUTしようと、更新先の値は同じリクエストである限り変化しないということである
  - DELETE
    - サーバのレコードを削除する
    - 記事の削除など
    - 重要な点は`Idempotent`であること
    - PUTと同様に、何度リクエストを投げても削除したということが返ってくる
- Expressでは、HTTPメソッドとURLに対して、1対1でリクエストハンドラを定義することができる
  
  ```js
  app.get("/", (req, res) => { /** ハンドラ **/})
  app.post("/", (req, res) => { /** ハンドラ **/})
  app.put("/", (req, res) => { /** ハンドラ **/})
  app.delete("/", (req, res) => { /** ハンドラ **/})
  ```

- 注意点としてはPOSTとPUTの境界は曖昧であることである
  - PUTでもレコードの作成はできる
  - 仕様的にはPUTはレコードを新たなオブジェクトで上書きすること
  - 部分的な更新にはPATCHを使えとある
- こうした使い分けは明確に定義されていないため、自身でアプリを作成する際は、どのメソッドを対応させるか考える必要がある

---

APIのバージョン管理

- APIのバージョン管理を行いたい場合がある
- これはつまり以下のようにURLを分けることに該当する
  - バージョン1
    
    ```js
    /v1/timezone
    ```

  - バージョン2

    ```js
    /v2/timezone
    ```

- Expressでは`Router`を使うことで上記のようなバージョン管理を簡単に実行することができる。
- つまりは`v1`と`v2`へのアクセスで、異なる`Router`に振り分ける考え方である
  - メインとなるコード

    ```js
    const apiVersion1 = require("./api1.js");
    const apiVersion2 = require("./api2.js");

    app.use("/v1", apiVersion1);
    app.use("/v2", apiVersion2);
    ```

  - バージョン1

    ```js
    const api = express.Router();

    app.get("/timezone", (req, res) => {
      res.send("api 1");
    });

    module.exports = api;
    ```

  - バージョン2

    ```js
    const api = express.Router();

    app.get("/timezone", (req, res) => {
      res.send("api 1");
    });

    module.exports = api;
    ```

---

HTTPステータスコードの設定

- HTTPステータスを正しく設定することは、APIを利用するユーザにとっても重要である
- HTTPステータスのそれぞれの意味に関して、以下のように様々な資料が存在している
  - [サーバ視点からの大雑把な意味](https://twitter.com/stevelosh/status/372740571749572610)
  - [Wikipediaのリスト](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- よく使用するであろうステータスコードをまとめる
  - 100番台
    - 100: Continue
    - 101: Switching Protocols
  - 200番台
    - 200: OK
    - 201: Created
    - 202: Accept
    - 204: No Content
  - 300番台
    - 301: Moved Permanently
    - 303: See Other
    - 307: Temporary Redirect
  - 400番台
    - 400: Bad Request
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Not Found
  - 500番台
    - 500: Internal Server Error