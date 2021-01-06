# Quiz

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Quiz](#quiz)
  - [cURLに関するQuiz](#curlに関するquiz)
    - [#1 Quiz](#1-quiz)
    - [#2 Quiz](#2-quiz)
    - [#3 Quiz](#3-quiz)
  - [Postmanに関するQuiz](#postmanに関するquiz)
    - [#1 Quiz](#1-quiz-1)
    - [#2 Quiz](#2-quiz-1)
    - [#3 Quiz](#3-quiz-1)
    - [参考情報](#参考情報)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## cURLに関するQuiz

### #1 Quiz

`https://httpbin.org`にパラメータとして`show_env=1`を追加してGETリクエストを以下のように送信します。

```bash
$ curl https://httpbin.org/headers\?show_env=1 \
  --request GET \
  --header "X-Forwarded-For: 192.168.0.1"
```

この出力結果は以下のようになります。

```json
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedd223-4c94d877234f441660a03807", 
    "X-Forwarded-For": "192.168.0.1, 203.0.111.1", 
    "X-Forwarded-Port": "80", 
    "X-Forwarded-Proto": "http"
  }
}
```

この時、`X-Forwarded-***`の値が上記のように設定されている理由は何でしょうか。

<details>
<summary>回答例</summary>

`X-Forwarded-Proto`ヘッダは、プロキシやロードバランサへ接続するために使用したクライアントのプロトコル（HTTP、HTTPS）を特定するためのヘッダです。

以下のようにALBがEC2に通信を転送する際にHTTPヘッダを付与しています。

![](./assets/quiz1_answer.svg)

参考資料

- [[MDN Web Docs] X-Forwarded-Proto](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Forwarded-Proto)

</details>

### #2 Quiz

クイズ1で実行したcurlコマンドに関して、リクエスト内容だけではなく、サーバからのレスポンスヘッダも表示してみましょう。

<details>
<summary>回答例</summary>

`-i`あるいは`--include`オプションを付与することでレスポンスを確認することができます。

```bash
$ curl https://httpbin.org/headers\?show_env=1 \
  --request GET \
  --header "X-Forwarded-For: 192.168.0.1" \
  --include
```

</details>

### #3 Quiz

このファイルと同じフォルダ階層に存在する`quiz.json`を、POSTリクエスト時に送信するリクエストボディとして設定し、`https://httpbin.org/post`にリクエストを送信してみましょう。

<details>
<summary>回答例</summary>

`-d`オプションでボディのデータを指定する際に、`@`プレフィックスを使用することで、ファイルを指定できます。

```bash
$ curl https://httpbin.org/post \
  --request POST \
  --data "@quiz.json" \
  --header "Content-Type: application/json"
```

</details>

## Postmanに関するQuiz

なお回答は以下のURLで公開しています。

[https://documenter.getpostman.com/view/9645891/TVt2bNXz](https://documenter.getpostman.com/view/9645891/TVt2bNXz)

### #1 Quiz

Postmanで環境変数に以下の値を設定し、環境変数を参照する形でGETリクエストを送信してみましょう。

| 環境変数 | 値                  |
| :------- | :------------------ |
| HOST_URL | https://httpbin.org |

### #2 Quiz

Postmanで環境変数として`UUID4_Token`という変数名に、値を何も設定しない状態にします。

その状態で、`https://httpbin.org/uuid`に対してGETリクエストを送信します。

ではPostmanで、リクエストを送信した後で自動的にレスポンスボディに含まれる`uuid`プロパティの値を、環境変数`UUID4_Token`に格納するスクリプトを作成してみましょう。

<details>
<summary>ヒント</summary>

Postmanでは`Tests`タブにスクリプトを登録できる。

`Tests`タブの右側に表示されている[`learn more about tests script`](https://learning.postman.com/docs/writing-scripts/test-scripts/)を参考にできます。

</details>

<details>
<summary>回答例</summary>

```js
if(pm.response.to.have.status(200)){
    // 環境変数の値を初期化する
    pm.environment.unset('UUID4_Token')
    // UUID4_Toknnという環境変数に、レスポンスのuuidの値を格納する
    pm.environment.set('UUID4_Token', pm.response.json().uuid)
}
```

</details>

### #3 Quiz

`https://httpbin.org/post`へPOSTリクエストを送信します。その際にクイズ2で得られた`uuid`プロパティの値を、`x-api-key`というカスタムHTTPヘッダに設定してリクエストを送信してみましょう。

### 参考情報

クイズ2とクイズ3は、スクリプトを活用することで1つのリクエストにまとめることができます。

<details>
<summary>実装例</summary>

@kamimi01 さんより

1. Pre-request Scripts
   
    ```js
    // UUIDを取得するURL
    const requestURL = `${pm.environment.get("HOST_URL")}/uuid`;

    pm.sendRequest(requestURL, (err, response) => {
        pm.environment.unset('UUID4_Token'); // initialize environment variable

        const uuid = response.json()["uuid"];
        pm.globals.set("UUID4_Token", uuid);
    });
    ```

2. Request
    
    ```bash
    >> POST {{HOST_URL}}/post
    >> Headers x-api-key: {{UUID4_TOKEN}}
    ```

3. Tests

    ```js
    const expectedKey = "X-Api-Key";
    const expectedValue = pm.globals.get("UUID4_Token");

    // confirm the response headers contains the generated uuid value
    pm.test("headers_check", () => {
        const actualValue = pm.response.json()["headers"][expectedKey];
        pm.expect(actualValue).to.eql(expectedValue);
    });
    ```

</details>
