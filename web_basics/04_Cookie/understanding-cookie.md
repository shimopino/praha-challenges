# Cookieの調査資料

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Cookieの特徴](#cookie%E3%81%AE%E7%89%B9%E5%BE%B4)
- [Cookieの生成](#cookie%E3%81%AE%E7%94%9F%E6%88%90)
- [Cookieのオプション](#cookie%E3%81%AE%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [Cookieの危険性と対策](#cookie%E3%81%AE%E5%8D%B1%E9%99%BA%E6%80%A7%E3%81%A8%E5%AF%BE%E7%AD%96)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Cookieの特徴

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

## Cookieの生成

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

## Cookieのオプション

Cookieで使用できるディレクティブは以下になる。

| オプション                  | 内容                                                                                                                                                                                                                                               | 
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `Expires=<date>`            | クッキーの有効期限をHTTPの日時スタンプで指定する<br>指定されなかった場合は**セッションクッキー**の寿命になるが、ブラウザは**セッション復元**により次回のブラウザ起動時にセッションクッキーも復元するので注意                                       | 
| `Max-Age=<number>`          | クッキーの期限までの秒数である<br>0や負の値が設定されている場合は、すぐに期限切れになる<br>`Expires`よりも優先度は高い                                                                                                                             | 
| `Secure`                    | リクエストが**SSL**と**HTTPS**を使用している場合のみ、クッキーをサーバに送信するようにする<br>ただしユーザは自由に情報を閲覧・修正できるため、機密情報は付与しないようにすべきである                                                                     | 
| `HttpOnly`                  | JavaSccriptから`Document.cookie`プロパティを使用してクッキーにアクセスすることを禁止する<br>HttpOnlyで生成されたクッキーは、`XMLHttpRequest.send()`や`fetch()`で送信される                                                                         | 
| `Domain=<domain-value>`     | クッキーの送信先ホストを指定する<br>- 指定されていない場合はサブドメインを含まない<br>- ドメインが指定された場合、すべてのサブドメインも常に含まれる<br>  `Domain=mozilla.org`を指定した場合、`developer.mozilla.org`のようなサブドメインを含む    | 
| `Path=<path-value>`         | リクエストのURLに含まれるべきパスであり、設定されていない場合はブラウザは`Cookie`を送信しない<br>指定したパスのサブディレクトも一致する<br>（`/docs`の場合は`/docs`、`/docs/Web/`、`/docs/web/HTTP`が一致する）                                    | 
| `SameSite=<samesite-value>` | - `Strict`: 同一オリジンへのリクエストに対してのみクッキーを送信する<br>- `Lax`: ユーザがリンクをクリックすることで外部サイトからURLに移動すると送信される<br>- `None`: 同一オリジンだけでなく、異なるオリジンへのリクエストでもクッキーを送信する | 
注意点

- `SameSite`
  - ブラウザは`SameSite=Lax`を規定値に持たせるような流れらしい
  - オリジンを跨ぐ場合には`SameSite=None`を指定する
  - [Feature: Cookies default to SameSite=Laxc](https://www.chromestatus.com/feature/5088147346030592)

## Cookieの危険性と対策

情報をクッキーに保存するときの前提として、クッキーの値がエンドユーザーは自由に確認・変更できることである。

### セッション固定攻撃

### 中間者攻撃

### クロスサイトスクリプティング (XSS)

### クロスサイトリクエストフォージェリ攻撃 (CSRF)



サイトがユーザーを認証する場合、ユーザーが認証するたびに、すでに存在するセッションクッキーも含めて、セッションクッキーを再生成して再送する必要があります。この手法は、第三者がユーザーのセッションを再利用するセッション固定攻撃を防ぐのに役立ちます。

HttpOnly 属性を持つクッキーは、JavaScript の Document.cookie API にはアクセスできません。サーバーに送信されるだけです。例えば、サーバー側のセッションを持続させるクッキーは JavaScript が利用する必要はないので、 HttpOnly 属性をつけるべきです。この予防策は、クロスサイトスクリプティング (XSS) 攻撃を緩和するのに役立ちます。

クッキーがオリジン間リクエストで送信されないことを主張することで、クロスサイトリクエストフォージェリ攻撃 (CSRF) に対していくらか防御することができます。


## 参考資料

- [[MDN Web Docs] Set-Cookie](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
- [[MDN Web Docs] HTTP Cookie の使用](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)
- [GDPR.EUによるCookieの分類](https://gdpr.eu/cookies/)
- [新しい Cookie 設定 SameSite=None; Secure の準備を始めましょう](https://developers-jp.googleblog.com/2019/11/cookie-samesitenone-secure.html)
- [Googleのポリシーと規約](https://policies.google.com/technologies/cookies#managing-cookies)
- [[MDN Web Docs] 同一オリジンポリシー](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)
- [[MDN Web Docs] 攻撃の種類](https://developer.mozilla.org/ja/docs/Web/Security/Types_of_attacks#Cross-site_scripting_(XSS))

