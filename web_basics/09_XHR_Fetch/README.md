# XMLHttpRequestについて理解する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [質問: XMLHttpRequestとは何でしょうか](#%E8%B3%AA%E5%95%8F-xmlhttprequest%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
    - [XMLHttpRequestとは何か?](#xmlhttprequest%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
    - [XMLHttpRequestをどのように使用するのか?](#xmlhttprequest%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B)
    - [実際にリクエストを送信してみる](#%E5%AE%9F%E9%9A%9B%E3%81%AB%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%92%E9%80%81%E4%BF%A1%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B)
    - [GithubのAPIに関して](#github%E3%81%AEapi%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
  - [質問: ブラウザのアドレスバーを使用したHTTPリクエストとの違いは何ですか](#%E8%B3%AA%E5%95%8F-%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%83%90%E3%83%BC%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9Fhttp%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%A8%E3%81%AE%E9%81%95%E3%81%84%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%99%E3%81%8B)
  - [質問: Cookieの送信はどのように実行すればいいでしょうか](#%E8%B3%AA%E5%95%8F-cookie%E3%81%AE%E9%80%81%E4%BF%A1%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [質問: CORSにはどのような対処を行えばいいでしょうか](#%E8%B3%AA%E5%95%8F-cors%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E5%87%A6%E3%82%92%E8%A1%8C%E3%81%88%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [追加調査内容](#%E8%BF%BD%E5%8A%A0%E8%AA%BF%E6%9F%BB%E5%86%85%E5%AE%B9)
  - [質問: Fetch APIとは何でしょうか](#%E8%B3%AA%E5%95%8F-fetch-api%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
    - [Fetch APIとは何か?](#fetch-api%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
    - [Fetch APIをどのように使用するのか?](#fetch-api%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B)
    - [実際にリクエストを送信してみる](#%E5%AE%9F%E9%9A%9B%E3%81%AB%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%92%E9%80%81%E4%BF%A1%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B-1)
    - [async & await を使ってシンプルに記述する](#async--await-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E3%81%AB%E8%A8%98%E8%BF%B0%E3%81%99%E3%82%8B)
    - [Fetch APIの初期化をより詳しく見てみる](#fetch-api%E3%81%AE%E5%88%9D%E6%9C%9F%E5%8C%96%E3%82%92%E3%82%88%E3%82%8A%E8%A9%B3%E3%81%97%E3%81%8F%E8%A6%8B%E3%81%A6%E3%81%BF%E3%82%8B)
  - [質問: fetch で画像を送信することはできるのか](#%E8%B3%AA%E5%95%8F-fetch-%E3%81%A7%E7%94%BB%E5%83%8F%E3%82%92%E9%80%81%E4%BF%A1%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%AF%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%AE%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

### 質問: XMLHttpRequestとは何でしょうか

#### XMLHttpRequestとは何か?

**XMLHttpRequest** は、ブラウザに組み込まれているHTTPリクエストを実行することが可能なJavaScriptのオブジェクトである。

その特徴として、HTTPリクエストを **非同期** で行ってサーバからデータを取得し、表示しているページを再読み込みすることなく取得データを反映することが可能である。

非同期通信を行うための現代的なAPIとして `fetch` が存在しており、現在は `XMLHttpRequest` は非推奨になっている。

`XMLHttpRequest` を使用する目的は主に以下の3点になっている。

- 既存の古いバージョンのスクリプトに対応させたい場合
- 古いブラウザへの対応や、[`polyfills`](https://remysharp.com/2010/10/08/what-is-a-polyfill) を使いたくない場合
- `fetch` がまだ対応していない、ファイルアップロードの進捗状況の制御などを利用したい場合

参考資料

- [XMLHttpRequestの仕様](https://xhr.spec.whatwg.org/)
- [[MDN] XMLHttpRequest](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest)
- [[javascript.info] XMLHttpRequest](https://javascript.info/xmlhttprequest)

---

#### XMLHttpRequestをどのように使用するのか?

`XMLHttpRequest` では以下の3ステップに従ってリクエストを送信する。

1. `XMLHttpRequest` オブジェクトを生成する
   
    ```js
    // https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/XMLHttpRequest
    const xhr = new XMLHttpRequest();
    ```

2. 生成した`XMLHttpRequest`オブジェクトの初期設定を行う
   
    ```js
    /*
    * https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/open
    * 
    * @param {string} method - 使用するHTTPリクエストを指定する
    * @param {string} URL - 通信先となるリソースのURLを指定する
    * @param {boolean} async - リクエストを非同期的に実行するか同期的に実行するか決める
    * @param {string} user - Basic認証を行う際のユーザ名
    * @param {string} password - Basic認証を行う際のパスワード
    */
    xhr.open(method, URL, [async, user, password])
    ```

3. 接続を確立してリクエストをサーバに送信する

    ```js
    /*
    * https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/send
    * 非同期通信の場合には、このメソッドはリクエストの送信が成功する終了する
    * レスポンスはメソッドではなく、イベント発火によって取得する
    * 
    * @param body - XHRのリクエストで送信される本文データ
    */
    xhr.send([body])
    ```

送信したリクエストに対するレスポンスを受け取りたい場合には、上記のようなメソッドではなく `XMLHttpRequest` に登録されているイベントを使用する。

主に使用するであろうイベントは以下の3種類になる。

- `load`
  - リクエストが正常に完了し、レスポンスが全てダウンロードされた場合に発火する
  - HTTPステータスコードは関係ないため、400番台でも500番台でも、レスポンスがダウンロードさえできれば発火する点に注意が必要である
  - 使用例

    ```js
    // https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/load_event

    // onloadプロパティを使用して呼び出す関数を指定する
    xhr.onload = () => {
        alert(`loaded: ${xhr.status} ${xhr.response}`);
    }

    // addEventListenerを使用して呼び出す関数を指定する
    xhr.addEventListener("load", () => {
        alert(`loaded: ${xhr.status} ${xhr.response}`);
    })
    ```

- `error`
  - ネットワークが繋がっていなかったり、URLが無効なものであったりと、リクエスト自体が正常にできていない場合に発火する
  - 使用例

    ```js
    // https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/error_event

    // onerrorプロパティを使用して呼び出す関数を指定する
    xhr.onerror = () => {
        alert(`network error`);
    }

    // addEventListenerを使用して呼び出す関数を指定する
    xhr.addEventListener("error", () => {
        alert(`network error`);
    })
    ```

- `progress`
  - レスポンスをダウンロードしている際に定期的に発火する
  - ダウンロードの進捗状況などが確認できる
  - 使用例

    ```js
    // https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/progress_event

    // onprogressプロパティを使用して呼び出す関数を指定する
    xhr.onprogress = (event) => {
        alert(`received ${event.loaded} of ${event.total}`);
    }

    // addEventListenerを使用して呼び出す関数を指定する
    xhr.addEventListener("progress", (event) => {
        alert(`received ${event.loaded} of ${event.total}`);
    })
    ```

  - このイベントに登録された関数は、上記の例のように [`ProgressEvent`](https://developer.mozilla.org/ja/docs/Web/API/ProgressEvent) オブジェクトを受け取る
  - `ProgressEvent` オブジェクトは3つのプロパティを有している
    - `lengthComputable`
      - 読み取り専用
      - 進捗状況の測定が可能なのかを示す真偽値が格納されている
    - `loaded`
      - 読み取り専用
      - すでにダウンロードされたレスポンスのサイズが格納されている
    - `total`
      - 読み取り専用
      - ダウンロード対象のレスポンスの全体サイズが格納されている

上記の流れにしたがってオブジェクトのメソッドやプロパティを使用することで、非同期的にHTTPリクエストを送信し、そのレスポンスを受信することが可能となる。

参考資料

- [[MDN] XMLHttpRequest の使用](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#monitoring_progress)
- [[MDB] XMLHttpRequest のイベント](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest#events)

---

#### 実際にリクエストを送信してみる

[xhr](./xhr) フォルダにて、`https://api.github.com` で公開されているAPIから、てアカウントに関する情報を `XMLHttpRequest` を使用して取得を行っている。

具体的なコードは以下になる。

```js
// ボタン要素をまずは作成する
const btn = document.createElement("button");
btn.textContent = "Button";

// ボタン要素に対してクリックイベントを登録する
btn.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.github.com/users/KeisukeShimokawa");
  xhr.addEventListener("load", () => {
    // レスポンスを受け取った場合は全て "load" イベントが発火する
    // サーバからのレスポンスに応じて処理を行いたい場合は、以下のように
    // ステータスコードから判定するようにする
    if (xhr.status != 200) {
      console.log(`error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log(`${xhr.status} (got ${xhr.response.length} bytes)`);
      console.log(xhr.response)
      console.log(xhr.getResponseHeader("Content-Type"));
      console.log(xhr.getAllResponseHeaders());
    }
  })
  xhr.addEventListener("error", () => {
    alert("request failed");
  })
  xhr.send();
})

document.body.appendChild(btn);
```

上記コードでは、`XMLHttpRequest` に登録されているいくつかのプロパティを使用している。
代表的なものを以下にまとめておく。

- [`status`](https://developer.mozilla.org/ja/docs/Web/API/XMLHTTPRequest/status)
  - 読み取り専用
  - レスポンスでの数値でのHTTPステータスコードを返す
  - リクエストが完了する前や送信がエラーになった場合、ブラウザはステータスとして0を返す
- [`statusText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText)
  - 読み取り専用
  - HTTPサーバから返されるレスポンスのステータスメッセージを返す
  - 例えば `"OK"` や `"Not Found"` などが格納されている
  - リクエストの [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) が `UNSENT` や `OPENED` の場合には、空文字が返される
  - サーバがステータスメッセージを明示していない場合は、デフォルト値の `"OK"` が返される
- [`responseType`](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/responseType)
  - 列挙型の文字列値であり、レスポンスに含まれているデータ型を示している
  - 空文字の場合にはデフォルト値である `text` が含まれている
  - 列挙型自体は [`XMLHttpRequestResponseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestResponseType) で定義されている
- [`response`](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/response)
  - `responseType` に従うレスポンスのボディを返す
  - `open` を使った初期化後や `send` を使ったリクエストの送信前に、`responseType` の値を設定することで、特定の形式でデータを提供するようにリクエストすることが可能である

プロパティ以外にも、`XMLHttpRequest` には便利なメソッドが提供されている。

- [`getResponseHeader()`](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/getResponseHeader)
  - 指定した名称のレスポンスヘッダーの値を返す
  - 以下のように指定することでヘッダ値を取得することができる

    ```js
    const contentType = xhr.getResponseHeader("content-type");
    ```

- [`getAllResponseHeaders()`](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)
  - 全てのレスポンスヘッダーを `CRLF` で区切った文字列として返す
  - なおヘッダ名は最新の仕様書にあるように全て小文字で返す
  - 以下のようにヘッダを取得して正規表現で分割することも可能である

    ```js
    // ヘッダ文字列をすべて取得
    const headers = xhr.getAllResponseHeaders();

    // ヘッダ文字列を個別のヘッダの配列に変換
    const arr = headers.trim().split(/[\r\n]+/);

    // ヘッダ名と値のマッピングを生成する
    const headerMap = {};
    arr.forEach((line) => {
      const parts = line.split(": ");
      const header = parts.shift();
      const value = parts.join(": ");
      headerMap[header] = value;
    })

    // getResponseHeader()と同じような指定方法が可能となる
    const contentType = headerMap["content-type"]
    ```

後はこれらを活用して処理を記述していけばいい。

#### GithubのAPIに関して

Github の API は Restful であり、論理的に分割されたリソースをHTTPメソッドで操作することができる。

上記の例では、ユーザというリソースに対して GET リクエストを送信しており、CRUD 操作でいうところの読み込み（READ）を行っている。

また Github API からレスポンスヘッダを見てみると、特有のヘッダが存在していることに気づく。

```bash
cache-control: public, max-age=60, s-maxage=60
...
x-github-media-type: github.v3; format=json
x-ratelimit-limit: 60
x-ratelimit-remaining: 53
x-ratelimit-reset: 1613194842
x-ratelimit-used: 7
```

これらのヘッダーの意味は以下になる。

- `x-github-media-type`
  - 使用するデータの形式を指定する
- `x-ratelimit-limit`
  - 1時間で使用可能なリクエスト数
- `x-ratelimit-remaining`
  - 現在の制限内で発行できるリクエストの残数
- `x-ratelimit-reset`
  - [UTC epoch seconds](http://en.wikipedia.org/wiki/Unix_time) で指定される現在の制限がリセットされる時間
  - 以下のように確認できる

    ```js
    new Date(<x-ratelimit-reset> * 1000)

    // Sat Feb 13 2021 14:40:42 GMT+0900 (日本標準時)
    new Date(1613194842 * 1000)
    ```

- `x-ratelimit-used`
  - すでに発行したリクエストの数

使用するユーザにとって非常にわかりやすい命名である。

参考資料

- [Github API Guide](https://docs.github.com/ja/rest/guides)
- [Github の API仕様書](http://developer.github.com/v3/gists/#list-gists)
- [Github のメディアタイプ](https://docs.github.com/ja/rest/overview/media-types)
- [Rate Limiting](https://docs.github.com/en/enterprise-server@3.0/rest/overview/resources-in-the-rest-api#rate-limiting)
- [翻訳: WebAPI 設計のベストプラクティス](https://qiita.com/mserizawa/items/b833e407d89abd21ee72#%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E5%88%B6%E9%99%90%E6%83%85%E5%A0%B1%E3%81%AF%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%83%98%E3%83%83%E3%83%80%E3%81%AB%E5%85%A5%E3%82%8C%E3%82%88%E3%81%86)

### 質問: ブラウザのアドレスバーを使用したHTTPリクエストとの違いは何ですか

ブラウザのアドレスバーを使用したHTTPリクエストとの違いは、ページ遷移の有無である。

ブラウザのアドレスバーにURLを打ち込みHTTPリクエストを送信した場合、送信先のサーバ（あるいはキャッシュ）から返ってくるHTMLの文書をブラウザのページに表示する。

`XMLHttpRequest` や `fetch` では非同期的にHTTPリクエストを送信することで、ページ遷移させることなく必要なデータをサーバから取得することができる。

### 質問: Cookieの送信はどのように実行すればいいでしょうか

`XMLHttpRequest` オブジェクトの `withCredentials` プロパティを使用して、[Cookies](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies) や [Authorization](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Authorization) ヘッダ、TLSでのクライアント証明などの機密情報を使った、アクセス制御を行うリクエストを送信することも可能である。

このプロパティをデフォルト値である `false` に設定していると、Cross-Origin なリクエストを送信する際に Cookie などの認証情報は無視されてしまう。

具体的には以下のように使用する。

```js
// XMLHttpRequestオブジェクトの生成
const xhr = new XMLHttpRequest();

// 認証情報を使用する
xhr.wothCredentials = true;

// XMLHttpRequestの設定を行う
xhr.open("POST", "/api/v1/user");

// 送信する
xhr.send(JSON.stringfy({
    name: "keisuke",
    email: "shimokawa@example.com"
}))
```

これでHTTPリクエストを送信する際に、送信先のドメインに紐づいている Cookie 情報を送信することが可能となる。

参考資料

- [XMLHttpRequestの仕様](https://xhr.spec.whatwg.org/#the-withcredentials-attribute)
- [[MDN] XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)

### 質問: CORSにはどのような対処を行えばいいでしょうか

> HTTPリクエストを送信した際に「No 'Access-Control-Allow-Origin' header is present on the requested resource」というエラーが発生した。

ブラウザバーに URL を打ち込んでページ遷移を行う、いわゆる top-level navigation とは異なり、`fetch` や `XMLHttpRequest` などのJavaScriptを通じたHTTPリクエストを発行する場合、ブラウザの [**Same-Origin Policy**](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy) によって、異なるオリジンに対するリクエストは、サーバからのレスポンスを受け取ったとしてもブラウザがそのレスポンスを拒否してしまう。

もしも異なるオリジンに対してHTTPリクエストを使用してレスポンスを取得したい場合は [**Cross-Origin Resource Sharing**](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS) を使用して、リクエストを発行しているクライアントのオリジンをサーバ側で許可する必要がある。

例えば `https://foo.example` から `XMLHttpRequest` を使用して以下のようなHTTPリクエストを発行する場合を考える。

```js
const URL = "https://bar.example"
const xhr = new XMLHttpRequest();
xhr.open("GET", URL);
xhr.addEventListener("load", somehandler);
xhr.send();
```

このときサーバは、レスポンスヘッダに `Access-Control-Allow-origin` を設定して、HTTPリクエストの送信元を指定しなければ、レスポンスを受け取ったとしてもサーバ側はレスポンスを破棄してしまう。

`express` を使用する場合は以下のように設定する。

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  // ↓でリクエスト送信元のオリジンを指定してCORSを実行する
  res.header("Access-Control-Allow-origin", "https://foo.example")
  res.json({
    message: "this response can avoid browser's Same-Origin Policy!"
  })
})
```

上記のようにサーバ側で特定のHTTPヘッダを付与することで、CORSが可能となる。

より詳細な内容を知りたい場合は、[課題6の調査資料](../06_CORS) を参照する。

## 追加調査内容

### 質問: Fetch APIとは何でしょうか

#### Fetch APIとは何か?

[`fetch`](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) とは、JavaScript の [`Promise`](https://jsprimer.net/basic/async/) を活用した非同期通信のための API であり、`XMLHttpRequest` よりも強力で柔軟な操作が可能である。

参考資料

- [JavaScript Primer](https://jsprimer.net/)
- [JavaScript Promiseの本](https://azu.github.io/promises-book/)

#### Fetch APIをどのように使用するのか?

`fetch` は、`Promise` の構文を使用することでシンプルに非同期処理のチェーンを記述することができる。

例えば JSON 形式のデータを取得する場合には以下のように記述できる。

```js
fetch("https://example.com/users.json")
  .then(response => {
    console.log(response.status);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => {
    console.error(error);
  })
```

`fetch` ではリクエストのレスポンスを表している `Response` オブジェクトで `resolve` されて後続の `.then` メソッドのチェーンが実行されていく。

また途中で `reject` された場合には `.catch` メソッドが呼び出される。

#### 実際にリクエストを送信してみる

`XMLHttpRequest` を使った場合と同じように `https://api.github.com` に対してリクエストを送信してユーザ情報を取得してみる。

```js
btn.addEventListener("click", () => {
  fetch("https://api.github.com/users/KeisukeShimokawa")
    .then((response) => {
      // HTTPステータスコードが200番台なら `true` を返す
      if (!response.ok) {
        console.error(response);
      } else {
        console.log(`${response.status} (got ${respose.headers.get("content-length")} bytes)`)
        return response.json();
      }
    }).then(data => {
      console.log(data)
    }).catch(error => {
      console.error(error);
    })
})
```

処理の内容自体は `XMLHttpRequest` と似たような感じで記述することができる。

上記の例で注意する必要がある点は `response.headers.get("content-length")` である。Cross-Origin なリクエストを送信している場合、ブラウザの `Network` タブから確認できるヘッダを、JavaScript からも読み取ることができるとは限らない。

JavaScript から読み取ることができるようにするためには、サーバ側が以下のようなヘッダを付与している必要がある。

```bash
Access-Control-Expose-Headers: Content-Length
```

ヘッダ以外にも [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) で確認できる内容は数多く存在する。
以下ではその中から代表的なものを紹介する。

- [`ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
  - 読み取り専用
  - レスポンスのステータスが200番台（200 - 299）の場合に `true` を返す
- [`status`](https://developer.mozilla.org/en-US/docs/Web/API/Response/status)
  - 読み取り専用
  - 数値形式の HTTP ステータスコードを返す
- [`statusText`](https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText)
  - 読み取り専用
  - HTTP ステータスコードに応じたメッセージを返す
  - 例えばステータスコードが 200 の場合に `"OK"` を返す
  - デフォルトでは空文字である
  - HTTP/2 でもステータスメッセージを持っていないため空文字になる
- [`type`](https://developer.mozilla.org/en-US/docs/Web/API/Response/type)
  - 読み取り専用
  - レスポンスの Type を返す
  - 例えば以下の値が格納されている
    - `basic`
      - 通常であり、同一オリジンのレスポンスに対して付与される
    - `cors`
      - 異なるオリジンからのレスポンスに対して付与される
    - `error`
      - ネットワークエラーに対して付与される
      - レスポンスのステータスは0になり、ヘッダは空で変更できないものになる
    - `opaque`
      - 異なるオリジンへの `no-cors` 設定を行ったときのレスポンスに対して付与される
    - `opaqueredirect`
      - リクエストで `redirect: "manual"` 設定が指定されたときに付与される 
- [`url`](https://developer.mozilla.org/en-US/docs/Web/API/Response/url)
  - 読み取り専用
  - レスポンスを返してきたサーバの URL が格納されている

これまでに見てきたように `fetch` は `XNLHttpRequest` と比較して、より柔軟な処理を可読性を高く保ったまま記述することができる。

参考資料

- [Introduction to fetch()](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types)
- [[MDN] サーバからのデータ取得](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)
- [Working with the Fetch API](https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api)
- [How to get the content-length of the response from a request with fetch()](https://stackoverflow.com/questions/48266678/how-to-get-the-content-length-of-the-response-from-a-request-with-fetch)

#### async & await を使ってシンプルに記述する

上記の処理を ES2017で導入された `async/await` で記述する。

```js
// コールバック関数を `async` で指定する
btn.addEventListener("click", async () => {
  let data;

  try {
    const response = await fetch("https://api.github.com/users/KeisukeShimokawa")
    if (!response.ok) {
      console.error(response);
    } else {
      console.log(`${response.status} (got ${respose.headers.get("content-length")} bytes)`)
      data = await response.json();
    }
  } catch(error) {
    console.error(error);
  }

  console.log(data);
})
```

参考資料

- [[JavaScript Promise の本] Async Function](https://azu.github.io/promises-book/#chapter5-async-function)

#### Fetch APIの初期化をより詳しく見てみる

次に `fetch` でリクエストに対して適用できる設定を見ていく。

```js
fetch("https://api.github.com/users/KeisukeShimokawa", {

  /*
  * 使用するHTTPメソッドを指定する
  * 
  * GET, POST, DELETE, などなど
  */
  method: "GET",

  /*
  * 使用するHTTPヘッダを指定する
  * 
  * 一部の名称は禁止されているため注意
  * https://developer.mozilla.org/ja/docs/Glossary/Forbidden_header_name
  */
  headers: {
    "Content-Type": "application/json"
  },

  /*
  * リクエストに追加する本文を指定する
  * 
  * Blob, BufferSource, FormData, URLSearchParams, USVString, ReadableStream, etc
  */
  body: undefined,

  /*
  * リクエストのリファラーを指定する
  * 
  * 同じオリジンのURL、"about:client"、空文字のいづれかを指定する
  */
  referer: "about:client",

  /*
  * リクエストで使用するリファラーポリシーを指定する
  * https://w3c.github.io/webappsec-referrer-policy/#referrer-policies
  * 
  * no-referrer, no-referrer-when-downgrade, same-origin, 
  * origin, strict-origin, origin-when-cross-origin,
  * strict-origin-when-cross-origin, unsafe-url
  */
  referrerPolicy: "no-referrer-when-downgrade",

  /*
  * リクエストで使用したいモードを指定する
  * 
  * cors:        デフォルト値であり Cross-Origin リクエストを許可する
  * no-cors:     安全な Cross-Origin リクエストのみを許可する
  * same-origin: Cross-Origin リクエストを許可しない
  */
  mode: "cors",

  /*
  * リクエストに使用したい認証情報
  * デフォルトでは Cookie は送信されないため注意
  * 
  * omit:        同一・異なるオリジンの両方で認証情報を決して送信しない
  * inclide      常に認証情報を送信する
  * same-origin: デフォルト値であり、同一オリジンに対してのみ認証情報を送信する
  */  
  credentials: "same-origin",

  /*
  * リクエストで使用したいキャッシュモードを指定する
  * https://developer.mozilla.org/ja/docs/Web/API/Request/cache
  * 
  * reload:         通常はHTTPキャッシュを参照せず、許可があるときにみ使用する
  * default:        標準的なHTTPキャッシュのルールとヘッダに従う
  * no-cache:       HTTPキャッシュが存在すると条件付きリクエストを送信する
  * no-store:       HTTPキャッシュを無視する
  * force-cache:    必ずHTTPキャッシュを参照し、なければリクエストを送信する
  * only-if-cached: HTTPキャッシュからのみレスポンスを返す
  */
  cache: "default",

  /*
  * 使用するリダイレクトモードを指定する
  * 
  * follow: 自動でリダイレクトに従う。デフォルトの挙動
  * error:  リダイレクトの際にエラーを伴って中止する
  * manual: 手動でリダイレクトを処理する
  */
  redirect: "follow",

  /*
  * リソースに subresource integrity 値を含めることができる
  * https://developer.mozilla.org/ja/docs/Web/Security/Subresource_Integrity
  */
  integrity: "",

  /*
  * 長生きするリクエストを許可する
  * 
  */
  keepalive: false,

  /*
  * AbortSignal オブジェクトのインスタンス
  * https://developer.mozilla.org/ja/docs/Web/API/AbortSignal
  * 
  * AbortController経由で `fetch` リクエストと通信したり、中止できたりする
  */
  signal: undefined,
})
```

参考資料

- [[MDN] WindowOrWorkerGlobalScope.fetch()](https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch)

### 質問: fetch で画像を送信することはできるのか

[`Blob`](https://developer.mozilla.org/ja/docs/Web/API/Blob) オブジェクトを使用することで、画像を送信することが可能である。

```html
<canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

<input type="button" value="Submit" onclick="submit()">

<script>
  canvasElem.onmousemove = (event) => {
    const ctx = canvasElem.getContext("2d");
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
  };

  const submit = async (event) => {
    const blob = await new Promise(resolve => canvasElem.toBlob(resolve, "image/png"));
    const response = await fetch("/article/fetch/post/image", {
      method: "POST",
      body: blob
    });
    const data = await response.json();
    console.log(data);
  }

</script>
```

参考資料

- [[MDN] Canvas API](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)
- [Syntax for async arrow function](https://stackoverflow.com/questions/42964102/syntax-for-async-arrow-function)
- [[javascript.info] Fetch](https://javascript.info/fetch)
- [[javascript.info] FormData](https://javascript.info/formdata)

### URLを安全に設定するにはどうすればいいのか

#### URLオブジェクトとは何でしょうか

`fetch` や `XMLHttpRequest` を使用する場合、URLを文字列で指定することができるが、文字列の代わりに JavaScript の組み込み関数として提供されている `URL` オブジェクトを使用することができる。

このオブジェクトの API は以下のようになっている。

```js
/*
* @param {string} url  : フルパスか相対パスを指定する
* @param {string} base : 相対パスの場合はOriginを指定する
*/
new URL(url, [base]);
```

具体的には以下のように使い分けることができる。

```js
// URLをフルパスで指定する場合
const url1 = new URL("https://api.github.com/users/KeisukeShimokawa");

// 相対パスとbaseを指定する場合
const url2 = new URL("/users/KeisukeShimokawa", "https://api.github.com");
```

この URL オブジェクトには様々なプロパティが存在している。

```js
const url = new URL("https://api.github.com/users/KeisukeShimokawa?name=keisuke#sample");

console.log(url.hash);      // #sample
console.log(url.host);      // api.github.com
console.log(url.hostname);  // api.github.com
console.log(url.origin);    // https://api.github.com
console.log(url.password);  // 
console.log(url.pathname);  // /users/KeisukeShimokawa
console.log(url.port);      // 
console.log(url.protocol);  // https:
console.log(url.href);      // https://api.github.com/users/KeisukeShimokawa?name_keisuke#sample
console.log(url.search);    // ?name=keisuke
console.log(url.username);  // 
```

上記のうちパスワードやユーザ名はHTTP認証を指定した際に登録される。

この URL オブジェクトを文字列の代わりに `fetch` の引数に指定することができる。

```js
const url = new URL("https://api.github.com/users/KeisukeShimokawa");
fetch(url)
```

参考資料

- [[javascript.info] URL Objects](https://javascript.info/url)

#### URLをどのようにエンコーディングするのでしょうか

URLをエンコーディングしたい場合には、大きく以下の2つの方法が存在している。

- `URL` オブジェクトを使用する
  - [RFC3986](https://tools.ietf.org/html/rfc3986) に準拠するエンコーディングを実行する
  - IPv6 などを正しくエンコーディングすることが可能である
- `encode*` 関数を使用する
  - [RFC2396](https://tools.ietf.org/html/rfc2396) に準拠するエンコーディングを実行する

  ```js
  // URL全体をエンコード/デコードする
  encodeURI
  decodeURI

  // 検索文字列やハッシュ以下の値をエンコード/デコードする
  encodeURIComponent
  decodeURIComponent
  ```

例えば検索文字列などは、空白や特殊文字を含んでいる可能性があるため、以下のようにエンコーディングしてから、URLに結合させる。

```js
const query = encodeURIComponent("music");
const value = encodeURIComponent("Rock&Roll");
const url = `https://google.com/search?${query}=${value}`;
console.log(url); // https://google.com/search?q=Rock%26Roll
```

RFCでURLに含めてはいけない文字が、UTF-8に従ってエンコーディングされていることがわかる。

参考資料

- [[javascript.info] URL Objects](https://javascript.info/url)

### ファイルのアップロード機能を実装してみましょう

