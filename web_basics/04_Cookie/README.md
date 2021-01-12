# 課題4 Cookieを理解する

<!-- START doctoc -->
<!-- END doctoc -->

## Cookieの挙動を理解する

課題1への回答を記載する前に、Cookieの基礎知識をまとめる。

### Cookieとは何か

Cookieとは、サーバがクライアントのブラウザに送信するデータである。
ブラウザは、渡されたデータを保存し、その後のリクエストとともに同じサーバにデータを返送する。

こうすることで、異なるリクエスト間で状態を持たせることが可能となる。
用途は主に3つ存在する。

- セッション管理
  - ログイン
  - ショッピングカート
  - ゲームのスコア
  - そのほかのサーバが保持しておくべきもの
- パーソナライゼーション
  - ユーザ設定
  - テーマ
  - その他の設定
- トラッキング
  - ユーザの行動の記録
  - 分析

### Cookieの生成

Cookieはサーバ側は`Set-Cookie`ヘッダを使用し、クライアントは`Cookie`ヘッダを使用する。
Cookieの値をやり取りする流れは以下になる。

![](assets/cookie-set.svg)

NodeJSを使用する場合には以下のように設定する。

```js
const requestHandler = (request, response) => {
  response.setHeader("Set-Cookie", "session_id=1234");
};
```

Expressを使用する場合は、より簡単にCookieとそのオプションを設定することができる。

```js
app.get("/", (request, respose) => {
  response.cookie("session_id", "1234", {
    // オプション設定
    httpOnly: true,
    secure: true,
    domain: "example.com",
    path: "/cookie"
  })
});
```

リクエストのCookieを取得するには、[cookie-parser](https://github.com/expressjs/cookie-parser)を使用する。

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/', (request, response) => {
  // Cookies that have not been signed
  console.log('Cookies: ', request.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', request.signedCookies)
});
```

### Cookieのオプション

Cookieの仕様がまとめられている[RFC6265](https://tools.ietf.org/html/rfc6265)には、以下のオプションが定義されている。

| オプション              | 内容                                                                                                                                                                                                                                                                            | 
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `Expires=<date>`        | クッキーの有効期限をHTTPの日時スタンプ（`Date`）で指定する<br><br>指定されなかった場合は**セッションクッキー**の寿命になるが、ブラウザは**セッション復元**により次回のブラウザ起動時にセッションクッキーも復元するので注意                                                      | 
| `Max-Age=<number>`      | クッキーの期限までの秒数<br><br>0や負の値が設定されている場合は、すぐに期限切れになる<br>`Expires`よりも優先度は高い                                                                                                                                                            | 
| `Secure`                | リクエストが**SSL**と**HTTPS**を使用している場合のみ、クッキーをサーバに送信するようにする<br><br>ただしCookie自体は暗号化されておらず、ユーザは自由に値を閲覧・修正できるため、機密情報は付与しないようにすべきである                                                          | 
| `HttpOnly`              | JavaSccriptから`Document.cookie`プロパティを使用してクッキーにアクセスすることを禁止する<br><br>`XMLHttpRequest.send()`や`fetch()`と一緒に送信される                                                                                                                            | 
| `Domain=<domain-value>` | クッキーの送信先ホストを指定する<br>(1) 指定されていない場合はサブドメインを含めない<br>(2) 指定された場合、すべてのサブドメインも常に含まれる<br><br>`Domain=mozilla.org`を指定した場合、`developer.mozilla.org`のようなサブドメインを含む<br><br>できれば指定しないほうがいい | 
| `Path=<path-value>`     | 対象のCookieが利用されるパスを指定する<br><br>指定した場合はサブディレクトリも一致するため、`/docs`の場合には`/docs`や`/docs/web`、`/docs/web/HTTP`に対してCookieが送信される<br><br>セキュリティにはあまり役に立たない                                                         | 

またRFC6265の改訂を目指している[RFC6265bis]( )では、新たに`SameSite`属性が定義されている。
この属性値の中身を説明する前に、まず`same-site`と`same-origin`といったセキュリティ境界の違いを理解しておく必要がある。

- `same-origin`
  - 以下の3つの組み合わせ
    - スキーム
    - ホスト名
    - ポート番号
  - 具体例
    - `same-origin`
      `https://www.example.com:443`と`https://www.example.com`
- `same-site`
  - [Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List)に定義されている`.co.jp`や`.github.io`なども含むeTLDを使用する
  - 以下の2つの組み合わせ
    - eTLD
    - eTLDの1階層下のサブドメイン
  - 具体例
    - `same-site`
      `https://www.example.com:443`と`https://login.example.com`
- `schemeful same-site`
  - 以下の3つの組み合わせ
    - eTLD
    - eTLDの1階層下のサブドメイン
    - スキーム

上記が`same-site`の定義となっている。
では改めて`SameSite`属性の値を見てみる。

| オプション        | 内容                                                                                                                                                                                                                                                                          | 
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `SameSite=Strict` | `same-site`である場合にのみCookieを送信する<br><br>CSRF攻撃をするには、`same-site`なサーバからリクエストを発行する必要があるため、よりセキュリティに強い<br><br>ただし別のサイトからの`<a>`タグによるクリック遷移でさえCookieを送信しなくなるため。利便性を損なう可能性がある | 
| `SameSite=Lax`    | `<a>`タグののようにほかのドメインへのGETリクエストに対してCookieを付与し、それ以外は`Strict`と同じ<br><br>HTML FormやXMLHttpRequestを使ったPOSTリクエストに、`iframe`などにはCookieは設定されない                                                                             | 
| `SameSite=None`   | 制限なくCookieが送信される                                                                                                                                                                                                                                                    | 

## 課題1

### `www.hoge.com`で発行されたクッキーは`www.fuga.com`にも送信されるのか

- 送信されない
  - `same-site`の考えに基づくとこの2つのサイトは`cross-site`となる
    - `www.hoge.com`: `.hoge.com`
    - `www.fuga.com`: `.fuga.com`

### `hoge.com:8080`で発行されたクッキーは`hoge.com:9090`に送信されるのか

- 送信される
  - SOP境界とは異なり`same-site`ではポート番号を含めない
    - `hoge.com:8080`: `hoge.com`
    - `hoge.com:9090`: `hoge.com`

### `www.hoge.com`で発行されたクッキーは`www.api.hoge.com`にも送信されるのか

- 送信される
  - `same-site`の考えに基づくとこの2つのサイトは`same-site`となる
    - `www.hoge.com`: `.hoge.com`
    - `www.api.hoge.com`: `.hoge.com`

### `Set-Cookie: Domain=hoge.com`を設定した場合に`api.hoge.com`にもクッキーは送信されるのか

- 送信される
  - `Domain`を設定した場合、すべてのサブドメインに対してCookieは送信されるため

### ブラウザからクッキーの値が取得できないようにすることは可能なのか

- 可能
  - ブラウザから`document.cookie`を使用することでCookieの値を設定することが可能である
  - これはセッション固定化攻撃にも使われる
  - ただしCookieに`HttpOnly`を設定すれば、HTTPヘッダによる変更しかできなくなる

### HTTPS通信の場合だけクッキーを送信することはできるのか

- 可能
  - Cookieに`Secure`を設定すればHTTPS通信の場合にのみCookieが送信される
  - 細心のブラウザだと`http:`のサイトでは`Secure`はもう使用できない

### クッキーに`Expires`を設定した場合の挙動はどうなるでしょうか

- Cookieに有効期限がつく
  - `Expires`にHTTPの日時（`Date`）を設定する
  - ブラウザは設定されている日時に達していない場合にのみCookieをサーバに送信する

### `SameSite`を設定した場合の挙動はどうなるでしょうか

- 指定した値によって挙動は異なる
  - `Strict`
    - `same-site`でのみCookieは送信される
  - `Lax`
    - 他のサイトからのGETリクエストによる遷移にはCookieが付与される
    - そのほかのPOSTリクエストなどではCookieは付与されない
  - `None`
    - 制限なくCookieが送信される

### クッキーに格納してはいけない情報として3つ例をあげてみましょう

- Cookieの値自体が暗号化されているわけではないため、盗まれることを考慮して機密情報は含めないようにする
  - パスワード
  - クレジットカード情報

### クッキーとローカルストレージはどのように使い分ければいいでしょうか

- データを誰が使うのかが異なる
  - `Cookie`: サーバ側が使用する
  - `localStorage`: クライアント側が使用する

### Web掲示板サービス開発している際に、XSSにより他ユーザのクッキー情報が抜き出される仕組みとその対策はどのようなものでしょうか

- 
- 防ぐ方法
  - 通信経路の盗聴
    - `Secure`を設定する
  - JavaScriptによるアクセス
    - `HttpOnly`を設定する

## 参考資料

- [[MDN Web Docs] Set-Cookie](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
- [[MDN Web Docs] HTTP Cookie の使用](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)
- [GDPR.EUによるCookieの分類](https://gdpr.eu/cookies/)
- [新しい Cookie 設定 SameSite=None; Secure の準備を始めましょう](https://developers-jp.googleblog.com/2019/11/cookie-samesitenone-secure.html)
- [Googleのポリシーと規約](https://policies.google.com/technologies/cookies#managing-cookies)
- [[MDN Web Docs] 同一オリジンポリシー](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)
- [[MDN Web Docs] 攻撃の種類](https://developer.mozilla.org/ja/docs/Web/Security/Types_of_attacks#Cross-site_scripting_(XSS))
