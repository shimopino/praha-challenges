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
  - [回答](#%E5%9B%9E%E7%AD%94)
  - [質問: CORSにはどのような対処を行えばいいでしょうか](#%E8%B3%AA%E5%95%8F-cors%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E5%87%A6%E3%82%92%E8%A1%8C%E3%81%88%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [追加調査内容](#%E8%BF%BD%E5%8A%A0%E8%AA%BF%E6%9F%BB%E5%86%85%E5%AE%B9)
  - [Fetch APIとは何か](#fetch-api%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [](#)

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

- [Github の API仕様書](http://developer.github.com/v3/gists/#list-gists)
- [Github のメディアタイプ](https://docs.github.com/ja/rest/overview/media-types)
- [Rate Limiting](https://docs.github.com/en/enterprise-server@3.0/rest/overview/resources-in-the-rest-api#rate-limiting)
- [翻訳: WebAPI 設計のベストプラクティス](https://qiita.com/mserizawa/items/b833e407d89abd21ee72#%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E5%88%B6%E9%99%90%E6%83%85%E5%A0%B1%E3%81%AF%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%83%98%E3%83%83%E3%83%80%E3%81%AB%E5%85%A5%E3%82%8C%E3%82%88%E3%81%86)

### 質問: ブラウザのアドレスバーを使用したHTTPリクエストとの違いは何ですか

ブラウザのアドレスバーを使用したHTTPリクエストとの違いは、ページ遷移の有無である。

ブラウザのアドレスバーにURLを打ち込みHTTPリクエストを送信した場合、送信先のサーバ（あるいはキャッシュ）から返ってくるHTMLの文書をブラウザのページに表示する。

`XMLHttpRequest` や `fetch` では非同期的にHTTPリクエストを送信することで、ページ遷移させることなく必要なデータをサーバから取得することができる。

### 質問: Cookieの送信はどのように実行すればいいでしょうか

### 回答

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

## 追加調査内容

### Fetch APIとは何か

`fetch` とは、JavaScript の [`Promise`](https://jsprimer.net/basic/async/) を活用した非同期通信のための API であり、`XMLHttpRequest` よりも強力で柔軟な操作が可能である。


参考資料

- [JavaScript Primer](https://jsprimer.net/)
- [JavaScript Promiseの本](https://azu.github.io/promises-book/)

### 

