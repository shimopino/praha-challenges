<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [ルーティングの基礎](#%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%81%AE%E5%9F%BA%E7%A4%8E)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ルーティングの基礎

- ルーティングにより、リクエストに対応するリクエストハンドラを呼び出せる

そもそもルーティングとは何でしょうか

- `www.example.com/olivia`に対するHTTPリクエストの構造を考える
  - HTTPリクエストの構造は以下になるはず
  - `GET /olivia HTTP/1.1`
- Expressでは、HTTPリクエストに対して`パス`と`URI`の組み合わせ手に対して、1対1で呼び出すリクエストハンドラを定義できる

```js
app.get("/olivia", (req, res) => {
  res.send("Welcome to the Olivia Homepage");
});

app.use((req, res) => {
  res.status(404);
  res.send("Not Found");
});
```

---

複雑なルーティング

- `Ruby on Rails`では、ルーティングを定義するためにメソッドとURIと、リクエストハンドラの組み合わせを1つのファイルで定義できる
- `Express`ではルーティングの組み合わせはどこでも定義することができる
- `:`を使用すれば任意の文字列にマッチするルーティングが可能

```js
app.get("/users/:userid", (req, res) => {
  const = parseInt(req.params.userid, 10);
})
```

正規表現を用いたルーティング

- 正規表現を使用して複雑なルーティングを実現できる
  - `/users/<integer only>`のように整数のみのIDを受けれたい場合
    - `/^\/users\/(\d+)$/`
      - URLの先頭がスラッシュ(`/`)
      - `/users/`以下は任意の数値、かつ1桁以上
  - `/users/<integer>-<integer>`のように整数のIDに範囲を持たせたい場合
    - `/^\/users\/(\d+)-(\d+)$/`
    - 1つ目の数値指定の応用例
  - バージョン3あるいは4のUUIDにマッチさせたい場合
    - `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
      - x: hex-digit
      - y: 8, 9, A, B
    - `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`

---

ルーティングを使用してアプリを分割する

- Expressのバージョン4以降では、大量のルーティングを扱うために`Router`が導入された
- `Router`は以下のように使用する

まずはリクエストハンドラの処理を変更する。
この際に以下のように`/api`あてのリクエストは、すべて別のファイルで定義している`apiRouter`に渡している。

```js
const apiRouter = require("./routes/api_router");

// ...

app.get("/api", apiRouter);
```

あとは`api_router`内でリクエストをさらに振り分けるようにする。

```js
const api = express.Router();

api.use((req, res, next) => {
  // /api以下へのリクエストに必ず実行するミドルウェア
});

api.get("/users". (req, res) => { /** ミドルウェア **/ });
api.post("/users". (req, res) => { /** ミドルウェア **/ });

api.get("/messages". (req, res) => { /** ミドルウェア **/ });
api.post("/messages". (req, res) => { /** ミドルウェア **/ });
```

---

静的ファイルのホスティング

- 静的ファイルホスティングでは、フォルダ構造を保持する必要はない
- つまりサーバ上の`offensive-photos-folder`フォルダに存在している画像に対して、`/offensve`というURLでアクセスさせることが可能である

```js
const photoPath = path.resolve(__dirname, "offensive-photos-folder");
app.use("/offensive", express.static(photoPath));
```

- 上記を活用すれば、URLごとに異なるフォルダをホスティングさせることも可能である

```js
const publicPath = path.resolve(__dirname, "public");
const userUploadPath = path.resolve(__dirname, "user_uploads");

app.use("/public", express.static(publicPath));
app.use("/uploads", express.static(userUploadPath));
```

- 正規表現を使って、ユーザーごとにプロフィール画像を表示させることも可能

```js
app.get("/users/:userid/profile_photo", (req, res) => {
  res.sendFile(getProfilePhotoPath(req.params.userid));
});
```

---

HTTPSの使用

- 秘密鍵と公開鍵、証明書を準備できればHTTPS化は簡単に実行できる
- またHTTPサーバとHTTPSサーバの両方を実行できる

```js
const httpsOptions = {
  key: fs.readFileSync("path/to/private/key.pem"),
  cert: fs.readFileSync("path/to/certificate.pem")
};

http.createServer(app).listen(80);
https.createServer(httpsOptions, app).listen(443)
```

---

ここまでの知識の活用



