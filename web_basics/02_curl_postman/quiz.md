# Quiz

<!-- START doctoc -->
<!-- END doctoc -->

## cURLに関するQuiz

### #1 Quiz

`https://httpbin.org`にパラメータとして`show_env=1`を追加してGETリクエストを以下のように送信します。

```bash
curl -X GET -H "X-Forwarded-For: 192.168.0.1" http://httpbin.org/headers\?show_env=1
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

![](./assets/quiz1_answer.svg)

参考資料

- [[MDN Web Docs] X-Forwarded-Proto](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Forwarded-Proto)

</details>

### #2 Quiz

クイズ1で実行したcurlコマンドに関して、リクエスト内容ではなく、サーバからのレスポンスヘッダとレスポンスボディを確認してみましょう。

<details>
<summary>回答例</summary>

`-i`あるいは`--include`オプションを付与することでレスポンスを確認することができます。

```bash
$ curl -i -X GET -H "X-Forwarded-For: 192.168.0.1" http://httpbin.org/headers\?show_env=1
```

</details>

### #3 Quiz

このファイルと同じフォルダ階層に存在する`quiz.json`を、POSTリクエスト時に送信するリクエストボディとして設定し、`https://httpbin.org/post`にリクエストを送信してみましょう。

<details>
<summary>回答例</summary>

`-d`オプションでボディのデータを指定する際に、`@`プレフィックスを使用することで、ファイルを指定できます。

```bash
$ curl -X POST -d "@quiz.json" -H "Content-Type: application/json" "https://httpbin.org/post"
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
