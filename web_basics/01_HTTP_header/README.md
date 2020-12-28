# #1 よく使うHTTPヘッダを理解する

## 課題1 主要なHTTPヘッダの役割を理解する

| ヘッダ名         | ヘッダ種類 | 送信元        |
| :--------------- | :--------- | :------------ |
| Host             | Request    | Client        |
| Content-Type     | Entity     | Client&Server |
| User-Agent       | Request    | Client        |
| Accept           | Request    | Client        |
| Referer          | Request    | Client        |
| Accept-Encopding | Request    | Client        |
| Authentication   | Request    | Client        |
| Location         | Response   | Server        |

---

### Host

Hostヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

Hostヘッダの特徴は以下になる。

- http/1.1で、唯一必須項目のヘッダである。
- クライアントがサーバにリクエストを送信する際に、サーバのドメイン名（FQDN）とポート番号を設定する。
- 1つのサーバで複数のWebサイトを運用している場合、Hostヘッダに設定されているドメイン名をもとに、仮想ホストにリクエストを振り分ける。

参考資料

- [MDN Web Docs HTTP](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Host)

---

### Content-Type

Content-Typeは、リクエストメッセージとレスポンスメッセージに含まれるメッセージボディを制御するための、エンティティヘッダの1つである。

Content-Typeヘッダの特徴は以下になる。

- リソースのメディア種別を示す
- 構文として以下の3要素を含む
  - media-type
  - charset
  - boundary

参考資料

- [MDN Web Docs Host](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Type)

---

### User-Agent

User-Agentヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

User-Agentヘッダの特徴は以下になる。

- ブラウザの種類やそのバージョン、OSの種類やそのバージョンに関する情報を含む。
- アクセス解析に使用できる。
- この情報をもとに、ユーザの環境に合わせてWebサイトのコンテンツを最適化できる
- ただし簡単に改変可能なので、過信に注意

参考資料

- [MDN Web Docs User-Agent](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/User-Agent)

---

### Accept

Acceptヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

Acceptヘッダの特徴は以下になる。

- クライアントのブラウザが処理可能なファイルの種類と、その優先度をサーバに伝える
- 対応するファイルが存在しない場合は、サーバは「406 Not Acceptable」を返す
- 品質係数qvalueを、ファイルの種別ごとに設定して優先度を決定する
  - `image/png,image/jpeg;q=0.7,image/gif;q=0.5`

参考資料

- [MDN Web Docs Accept](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept)

---

### Referer

Refererヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

Refererヘッダの特徴は以下になる。

- 直前のリンク元のURIを示す
- サーバはクライアントがどのページからアクセスしたのかわかる
- これを使ってデータ解析して、プロモーションなどを決定することができる

参考資料
  
- [MDN Web Docs Referer](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referer)

---

### Accept-Encoding

Accept-Encodingヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

Accept-Encodingヘッダの特徴は以下になる。

- クライアントのブラウザが処理できる圧縮方式をサーバに提示する
- サーバ側はContent-Encpodingヘッダを使用して、選択した圧縮方式をクライアントに伝える
- クライアントとサーバが同じ圧縮方式を選択したとしても、その圧縮方式を採用しているとは限らない
  - サーバが過負荷状態であり、圧縮アルゴリズムを実行する際のオーバヘッドを処理できない場合
  - Microsoftは、計算リソースが80％以上残っている場合は、圧縮しないことをおすすめしている

参考資料

- [MDN Web Docs Accept-Encoding](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept-Encoding)

---

### Authorization

Authorizationヘッダは、リクエストメッセージを制御するための、リクエストヘッダの1つである。

Authorizationヘッダの特徴は以下になる。

- ユーザをサーバで認証するための資格情報を含むこともある
- サーバが「401 Unauthorized」を返し、WWW-Authenticateヘッダを返した後の、リクエストに付与する

参考資料

- [MDN Web Docs Authorization](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization)

---

### Location

Locationヘッダは、レスポンスメッセージを制御するための、レスポンスヘッダの1つである。

Locationヘッダの特徴は以下になる。

- クライアントに、リダイレクト先を伝えるために使用する
- ステータスコードが「3XX」や「201」の場合にのみ意味を持つ
- ほとんどのWebブラウザは、自動的にLocationヘッダのURLにアクセスする

参考資料

- [MDN Web Docs Location](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Location)

---

### Refererの追加質問

> aタグに`target="=blank"`を設定しており、`rel=noreferrer`を設定していなかった場合、どのような問題が発生するでしょうか

> 同じオリジンの時はrefererの情報を全部送って、別オリジンの時は、オリジン情報だけをrefererとして送信するために、HTTPリクエストのヘッダーにはどのような値を追加すればいいでしょうか

HTTPリクエストの`Referer`ヘッダに設定する情報は、サーバ側のレスポンスヘッダである`Referrer-Policy`ヘッダで制御することができる。

なお、Referrerに設定する値には以下のパターンが存在している。

- 送信しない
- 送信する
  - オリジンのみ（`https://example.com/`）
  - オリジン、パス、クエリ文字列を含む（`https://example.com/page.html?param1=example`）

実際の`Referrer-Policy`ヘッダに設定できる値は以下になる。

- `no-referrer`
  - `Referer`ヘッダには値を設定しない
- `no-referrer-when-downgrade`
  - `Referrer-Policy`ヘッダが設定されていない場合のデフォルトの挙動
  - HTTPのプロトコルのセキュリティがダウングレードする場合には、URLを設定しない（HTTP → HTTPS）
  - 最近は`strict-origin-when-cross-origin`をデフォルトにする動きあり
- `origin`
  - 直前のサイトURLのオリジンのみを送信する
  - 遷移元が`https://example.com/page.html`の場合には、`https://example.com/`を送信する
- `origin-when-cross-origin`
  - 同一オリジン間の移動時には、パスを含めたURLを送信する
  - 異なるオリジン間では、オリジンのみを送信する（`origin`と同じ）
- `same-origin`
  - 同一オリジン間の移動時でには、完全なURLを送信する
  - 異なるオリジン間の移動時には、URLを送信しない
- `strict-origin`
  - 基本は`origin`と同じ
  - ただしHTTP → HTTPSの場合に、URLを送信しない
- `strict-origin-when-cross-origin`
  - HTTPS → HTTPSの場合にのみ、URLを送信する
  - 同一オリジン間移動時には、URLを送信する
  - 異なるオリジン間の移動時には、オリジンのみを送信する
- `unsafe-url`
  - URLを送信する

HTML内で上記の`Referrer-Policy`ヘッダを制御することが可能である。

```html
<!-- 文書全体に適用 -->
<meta name="referrer" content="origin">

<!-- aタグ、areaタグ、imgタグ、iframeタグ、scriptタグ、linkタグ -->
<a href="http://example.com" referrerpolicy="origin">

<!-- aタグ、areaタグ、linkタグ -->
<a href="http://example.com" rel="noreferrer">
```

参考資料

- [Referer header: privacy and security concerns](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
- [W3C Referrer-Policy](https://triple-underscore.github.io/webappsec-referrer-policy-ja.html)

---

### コンテンツネゴシエーション

サーバはHTML5やCSS、画像などの様々なファイルをリソースとして有している。クライアントが、URLを指定してこうしたリソースを取得しようとした場合、サーバ側は指定されたリソースのうち、クライアントに適したリソースを選択する（日本語のファイルや圧縮方式など）。

参考資料

- [Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)

## 課題2 HTTPヘッダに関するクイズを作成する

> 例：「User-agentを使って、ユーザがモバイル端末を使用していることを判定しようとした場合、どのような誤検知や問題が想定されるでしょうか？」

### #1 Quiz


