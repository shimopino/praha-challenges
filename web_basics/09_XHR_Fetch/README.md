<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [XMLHttpRequestについて理解する](#xmlhttprequest%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E7%90%86%E8%A7%A3%E3%81%99%E3%82%8B)
  - [課題1](#%E8%AA%B2%E9%A1%8C1)
    - [質問](#%E8%B3%AA%E5%95%8F)
    - [回答](#%E5%9B%9E%E7%AD%94)
      - [XMLHttpRequestとは何か?](#xmlhttprequest%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
      - [XMLHttpRequestをどのように使用するのか?](#xmlhttprequest%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8B)
    - [質問](#%E8%B3%AA%E5%95%8F-1)
    - [回答](#%E5%9B%9E%E7%AD%94-1)
    - [質問](#%E8%B3%AA%E5%95%8F-2)
    - [回答](#%E5%9B%9E%E7%AD%94-2)
    - [質問](#%E8%B3%AA%E5%95%8F-3)
    - [回答](#%E5%9B%9E%E7%AD%94-3)
  - [追加調査内容](#%E8%BF%BD%E5%8A%A0%E8%AA%BF%E6%9F%BB%E5%86%85%E5%AE%B9)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# XMLHttpRequestについて理解する

## 課題1

### 質問

> XMLHttpRequestとは何でしょうか

### 回答

#### XMLHttpRequestとは何か?

**XMLHttpRequest** は、ブラウザに組み込まれているHTTPリクエストを実行することが可能なJavaScriptのオブジェクトである。

その特徴として、HTTPリクエストを **非同期** で行ってサーバからデータを取得し、表示しているページを再読み込みすることなく取得データを反映することが可能である。

非同期通信を行うための現代的なAPIとして `fetch` が存在しており、現在は `XMLHttpRequest` は非推奨になっている。

`XMLHttpRequest` を使用する目的は主に以下の3点になっている。

- 既存の古いバージョンのスクリプトに対応させ耐場合
- 古いブラウザへの対応や、`polyfills` を使いたくない場合
- `fetch` がまだ対応していない、ファイルアップロードの進捗状況の制御などを利用したい場合

参考資料

- [XMLHttpRequestの仕様](https://xhr.spec.whatwg.org/)
- [[MDN] XMLHttpRequest](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest)

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
    * @param {boolean} async - リクエストを非同期的に実行するか同期的に実行するか決める。デフォルトはtrue
    * @param {string} user - Basic認証を行う際のユーザ名
    * @param {string} password - Basic認証を行う際のパスワード
    */
    xhr.open(method, URL, [async, user, password])
    ```

3. 接続を確立してリクエストをサーバに送信する

    ```js
    /*
    * https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/send
    * 非同期通信の場合には、このメソッドはリクエストの送信自体を行うと終了し、レスポンス自体はイベント発火によって取得する
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

### 質問

> ブラウザのアドレスバーを使用したページ遷移との違いは何ですか

### 回答

### 質問

> Cookieの送信はどのように実行すればいいでしょうか

### 回答

### 質問

> HTTPリクエストを送信した際に「No 'Access-Control-Allow-Origin' header is present on the requested resource」というエラーが発生した。
> どのような対処を行えばいいでしょうか

### 回答



## 追加調査内容