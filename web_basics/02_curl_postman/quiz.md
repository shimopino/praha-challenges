<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Quiz](#quiz)
  - [cURLに関するQuiz](#curl%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8Bquiz)
    - [&#035;1 Quiz](#1-quiz)
    - [&#035;2 Quiz](#2-quiz)
    - [&#035;3 Quiz](#3-quiz)
  - [Postmanに関するQuiz](#postman%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8Bquiz)
    - [&#035;1 Quiz](#1-quiz-1)
    - [&#035;2 Quiz](#2-quiz-1)
    - [&#035;3 Quiz](#3-quiz-1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quiz

curlとpostmanに関するクイズを作成する。
（作問数の制限なし）

## cURLに関するQuiz
### #1 Quiz

`https://httpbin.org`にパラメータとして`show_env=1`を追加してGETリクエストを以下のように送信する。

```bash
curl -X GET -H "X-Forwarded-For: 192.168.0.1" http://httpbin.org/headers\?show_env=1
```

この出力結果は以下のようになる。

```json
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedd223-4c94d877234f441660a03807", 
    "X-Forwarded-For": "192.168.0.1, 133.204.161.1", 
    "X-Forwarded-Port": "80", 
    "X-Forwarded-Proto": "http"
  }
}
```

この時、`X-Forwarded-***`の値が上記のように設定されている理由は何でしょうか

<details>
<summary>回答例</summary>

`X-Forwarded-Proto`ヘッダは、プロキシやロードバランサへ接続するために使用したクライアントのプロトコル（HTTP、HTTPS）を特定するためのヘッダである。

![](./assets/quiz1_answer.svg)

参考資料

- [[MDN Web Docs] X-Forwarded-Proto](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Forwarded-Proto)

</details>

### #2 Quiz

クイズ1で実行したcurlコマンドに関して、リクエスト内容ではなく、サーバからのレスポンスヘッダとレスポンスボディを確認してみましょう。

<details>
<summary>回答例</summary>

`-i`オプションを付与することでレスポンスを確認することができる。

```bash
$ curl -i -X GET -H "X-Forwarded-For: 192.168.0.1" http://httpbin.org/headers\?show_env=1
```

</details>

### #3 Quiz

このファイルと同じフォルダ階層に存在する`quiz.json`を、POSTリクエスト時に送信するリクエストボディとして設定し、`https://httpbin.org/post`にリクエストを送信してみましょう

<details>
<summary>回答例</summary>

`-d`オプションでボディのデータを指定する際に、`@`プレフィックスを使用することで、ファイルを指定できる。

```bash
$ curl -X POST -d "@quiz.json" -H "Content-Type: application/json" "https://httpbin.org/post"
```

</details>

## Postmanに関するQuiz

なお回答は以下のURLで公開している。

[https://documenter.getpostman.com/view/9645891/TVt2bNXz](https://documenter.getpostman.com/view/9645891/TVt2bNXz)

### #1 Quiz

Postmanで環境変数に以下の値を設定し、環境変数を参照する形でGETリクエストを送信してみましょう。

| 環境変数 | 値                  |
| :------- | :------------------ |
| HOST_URL | https://httpbin.org |

### #2 Quiz

Postmanで環境変数として`UUID4_Token`という変数名に、値を何も設定しない状態にする。

その状態で、`https://httpbin.org/uuid`に対してGETリクエストを送信する。

ではPostmanで、リクエストを送信した後で自動的にレスポンスボディに含まれる`uuid`プロパティの値を、環境変数`UUID4_Token`に格納するスクリプトを作成してみましょう。

<details>
<summary>ヒント</summary>

Postmanでは`Tests`タブにスクリプトを登録できる。

`Tests`タブの右側に表示されている[`learn more about tests script`](https://learning.postman.com/docs/writing-scripts/test-scripts/)を参考にできる。

</details>

### #3 Quiz

`https://httpbin.org/post`へPOSTリクエストを送信する。その際にクイズ2で得られた`uuid`プロパティの値を、`x-api-key`というカスタムHTTPヘッダに設定してリクエストを送信してみましょう。
