# Expressの基礎

`Express`の基礎

- `Express`自体は、`Node.js`の組み込みモジュールである`http`の上で構築されたライブラリである
- またミドルウェアとルーティングの機能を見ていく

---

ミドルウェア

- まずは`Express`の準備を行う
  - 新規フォルダを作成（[./helloworld](./helloworld)）
  - `package.json`を`npm init`で初期化
  - `npm install --save express`でモジュールをインストール
- 次に`Express`で`Node.js`のときと同様にWebサーバを構築する
  - モジュールを読み込んだ後で、`const app = express();`を実行することで、`app`というコールバック関数を取得する
  - リクエストハンドラ関数自体は、`Node.js`の場合と変化なし
  - あとは`Node.js`の場合と同じように、`createServer`に対してコールバック関数である`app`を渡す

これで`Express`を使った簡易的なWebサーバを構築することができた。しかしこれだとミドルウェアの機能を発揮することができていない

---

ミドルウェアの具体像

- `Node.js`の場合には、すべてのリクエストを1つのリクエストハンドラ関数で受け付けていた
- `Express`の場合には、複数のミドルウェア、つまり複数のリクエストハンドラ関数を組み合わせて、別個の処理を別個の関数で処理することができる
- 以下のミドルウェアの場合
  - すべてのリクエストに対してログを取得する
  - すべてのリクエストに対してリクエストのユーザ認証を行う
  - ユーザ認証が成功したリクエストに対してのみ、後続の処理を実行する
- ただし必ずミドルウェアから最低1回でもリクエストにレスポンスを返す必要がある

ではミドルウェアのスタックを構築していく。

- 具体的に以下のように2つのミドルウェアを登録する
- 最初のミドルウェアが、登録対象のコールバック関数の引数に`next`を受け取っていることがわかる
- 実際に以下を起動すると、連続的にコールバック関数が呼び出されていることがわかる

```js
// ロギング用のミドルウェア
app.use((req, res, next) => {
  console.log('In comes a request to: ' + req.url);
  next();
});

// リクエスト処理用のミドルウェア
app.use((req, res) => {
  res.writeHead(200, {'Content-Type': 'tet/plain'});
  res.end('hello world');
});
```

では次にユーザ認証を行うミドルウェアを登録してみましょう

- 現在時刻の分が偶数の場合は後続の処理を返す
- 奇数の場合は、ステータスコード403で返す
- これは以下のようにすれば問題なし

```js
// ロギング用のミドルウェア
app.use((req, res, next) => {
  console.log('In comes a request to: ' + req.url);
  next();
});

// 認証用のミドルウェア
app.use((req, res, next) => {
  const minute = (new Date()).getMinutes();
  if ((minute % 2) === 0) {
    next();
  } else {
    res.status = 403;
    res.end('Not Authorized');
  }
});

// リクエスト処理用のミドルウェア
app.use((req, res) => {
  res.writeHead(200, {'Content-Type': 'tet/plain'});
  res.end('hello world');
});
```

これで認証用のミドルウェアを構築することができた。
ではロギング用のミドルウェアを、自作関数からサードパーティ製モジュールに変更してみましょう。

- 使用するモジュールは`morgan`
- `npm install --save morgan`
- 以下のように自作のロギング用のミドルウェアを置き換えればいい

```js
const logger = require('morgan');

// サードパーティ製ロギング用のミドルウェア
app.use(logger('short'));
```

これで再度Webサーバにアクセスすると、ログが出力されていることがわかる。

---

そのほかのミドルウェア

- `Express`では、HTMLやCSSなどの静的ファイルをServingすることも可能
- 静的ファイルへのパスを設定する（`/public`）
- `Express`が提供している静的ファイルのホスティングが可能なミドルウェア`express.static`を使用する。
- 該当するファイルが見つかれば、この時点でレスポンスを返して後続の処理を実行しない

```js
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
```

なお今回は`file.txt`を配置しているため、静的ファイルが表示されないはずである。
上記以外にも、便利なミドルウェアは数多く存在している。

- `connect-ratelimit`
  - 指定時間に受け付けるリクエスト数を制限できる
- `Helmet`
  - HTTPヘッダを追加して攻撃に頑強なアプリを構築できる
- `cookie-parser`
  - ブラウザから渡されるCookieを解析できる
- `response-time`
  - 処理にかかった時間を計測できる

---

ルーティング

- ルーティングでは、HTTPメソッドとURLに紐づけて、呼び出すリクエストハンドラを個別に定義する機能を提供する
- `Express`では、`app.get(path)`や`app.post(path)`を使用することで、別個にリクエストハンドラを指定することができる
- 実際に以下のようにリソースと、リクエストハンドラの組み合わせで定義できる

```js
app.get('/', (req, res) => {
  res.end('welcome to homepage');
})

app.get('/about', (req, res) => {
  res.end('welcome to the about page');
})

app.get('/weather', (req, res) => {
  res.end('the current weather is nice');
})

// 任意の文字列も受け付けることが可能
app.get('/hello/:who', (req, res) => {
  // 脆弱性あり
  res.end('hello, ' + req.params.who + '.');
})

app.use((req, res) => {
  res.statusCode = 404;
  res.end('404!');
})
```

---

リクエストとレスポンスの拡張

- 詳細は[公式APIDocs参照](http://expressjs.com/en/4x/api.html)
- リダイレクトなども使用可能
  - `res.redirect("helloworld")`
  - `res.redirect("http://example.com")`
- リクエストのプロパティやメソッドを使用して、特定のIPアドレスをブロックすることもできる

```js
const EVIL_IP = "123.45.67.89";

app.use((req, res, next) => {
  if (req.id === EVIL_IP) {
    res.status(401).send("Not allowed");
  } else {
    next()
  }
});
```

---

Views

- SPAが流行ってはいるが、動的にHTMLを生成したい場合もある
- `Express`では、テンプレートエンジンとしてELS、Pugなどが存在している
- 方法は以下である
  - viewsが格納されているフォルダを指定する
  - テンプレートエンジンを指定する
    - ELSを使用する場合
    - `npm install --save ejs`
    - [https://github.com/tj/ejs](https://github.com/tj/ejs)
  - テンプレート文法
    - `index.ejs`を作成する
    - `<%= message %>`で挿入個所を指定する
  - `Express`で指定する
    - `res.render(<>, object)`を使用する
- 全体像としては以下になる

```js
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    message: "Hey everyone! This is my webpage"
  });
});
```

---

上記をまとめて利用する

- では投稿されたエントリを一覧化するホームページと、エントリを投稿できるWebサービスを構築する
- まずはプロジェクトの初期設定を行う
  - `npm init`
    - `"start": "node app"`を`package.json`の`scripts`に登録する
  - 必要なライブラリをインストールする
    - `npm install --save express morgan body-parser ejs@2.3.3`
    - この中で`body-parser`はPOSTリクエストのボディを解析するために使用する
- ではまずWebAPIを作成する

以下にWebAPIの構成と実装を記載する。

- まずは投稿されたentriesをメモリに格納できるようにする

```js
const entries = [];
app.locals.entries = entries;
```

- 次に`morgan`を使用してロギング機能を追加する

```js
app.use(logger("dev"));
```

- 次にFormを使用してPOSTリクエストされた際に、inputに入力された値を取得できるようにする
- `nody-parser`ミドルウェアを使用することで、リクエストハンドラの`req`オブジェクトのボディの値に`req.body.value`の形式でアクセスできるようになる

```js
app.use(bodyParser.urlencoded({ extended: false }))
```

- ここまで出来たらWebAPIの実装に移る
- 仕様は以下になる
  - `"/"`へのGETリクエスト
    - `index.ejs`を返す
  - `"/new-entry"`へのGETリクエスト
    - `new-entry.ejs`を返す
  - `"/new-entry"`へのPOSTリクエスト
    - ボディに`title`あるいは`body`が設定されていない場合はステータスコード400を返す
    - `title`と`body`、`published`をキーにもつオブジェクトを`entries`に追加する
    - `"/"`にリダイレクトさせる
  - 上記以外のリクエストの場合
    - ステータスコード404を返し、`404.ejs`を返す

実際に実装したものは`app.js`を確認してみましょう

では次に画面の実装をしましょう。

- 実装する画面は全部で以下の5つ
  - `index.ejs`
  - `header.ejs`
  - `footer.ejs`
  - `new-entry.ejs`
  - `404.ejs`
- renderで表示する画面はすべてヘッダーとフッターを有している
- bootstrapで多少修飾する
- ヘッダーとフッターの画面は以下の条件を満たすように作成する
  - `header.ejs`
    - bootstrapを読み込む
    - `Write in the guestbook`というリンクを作り、`/new-entry`にGETリクエストを送信する
  - `footer.ejs`
    - 閉じタグのみ
- では各画面を作成するが、`ejs`を他の画面で取り込む場合には、`<% include <page name> %>`を使用する
- エラー画面は以下の条件を満たす用に作成する
  - `404.ejs`
    - h2の「404!」のみ
- 初期画面は以下の条件を満たすように作成する
  - `index.ejs`
