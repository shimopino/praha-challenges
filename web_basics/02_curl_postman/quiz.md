# Quiz

curlとpostmanに関するクイズを作成する。
（作問数の制限なし）

## #1 Quiz

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

## #2 Quiz


## #3 Quiz

