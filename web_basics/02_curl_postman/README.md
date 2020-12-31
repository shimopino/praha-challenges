# #2 curlとpostmanに慣れる

課題に使用するcurlのバージョンは以下にな\る。

```bash
$ curl --version
curl 7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 OpenSSL/1.1.1f zlib/1.2.11 brotli/1.0.7 libidn2/2.2.0 libpsl/0.21.0 (+libidn2/2.2.0) libssh/0.9.3/openssl/zlib nghttp2/1.40.0 librtmp/2.3
Release-Date: 2020-01-08
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp 
Features: AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets
```

- [cURL Tool Documentation](https://curl.se/docs/manpage.html)

また課題に取り組む際は、[`https://httpbin.org/`](https://httpbin.org/)と、ローカルのコンテナ上で動かしているhttpbinに対してcurlを実行する。

```bash
# コンテナ起動時のコマンド
$ docker run -it -d -p 80:80 --rm kennethreitz/httpbin
```

## 課題1

cURLにて、HTTPリクエスト内のHTTPヘッダをレスポンスで返すAPIである`https://httpbin.org/headers`に対してGETリクエストを発行する。その際にカスタムHTTPヘッダとして`X-Test: hello`を付与する。

```bash
# to https
$ curl -X GET -H "X-Test: hello" "https://httpbin.org/headers"

# to Docker Container
$ curl -X GET -H "X-Test: hello" "http://localhost:80/headers"
```

サービス提供元にリクエストを送信した場合

```json
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedcb94-43e04f8740f47ae43efbb7a9", 
    "X-Test": "hello"
  }
}
```

ローカルのDockerコンテナ上にリクエストを送信した場合

```json
{
  "headers": {
    "Accept": "*/*", 
    "Host": "localhost", 
    "User-Agent": "curl/7.68.0", 
    "X-Test": "hello"
  }
}
```

### 得られた知見

使用したcURLのオプション

| オプション                    | 設定例                      | 
| ----------------------------- | --------------------------- | 
| `-X, --request <command>`     | `-X GET`                    | 
| `-H, --header <header/@file>` | `-H "X-Custom-Header: XXX"` | 

送信先環境の違い

サービス提供元へGETリクエストを送信した際、HTTPヘッダに`X-Amzn-Trace-Id`が確認された。

これはおそらく、httpbinにリクエストが送信される前段に、負荷分散のためにApplication Load Balancerを組み込みこんでおり、自動的にHTTPヘッダが追加されるため?

## 課題2

```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "hoge"}' "http://localhost:80/post"
```

問題２
Content-Typeは"application/json"
methodはPOST
bodyは {"name": "hoge"}
URLはhttps://httpbin.org/post
以下のようなレスポンスを得られるはずです
{
  "data": "{\"name\": \"hoge\"}",  // ここが重要！
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/json", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.54.0"
  }, 
  "json": {
    "name": "hoge" // ここが重要！
  }, 
  "origin": "xxxxxxxxxx",  // 自分自身のIPアドレス
  "url": "https://httpbin.org/post"
}


```bash
$ curl -X POST "http://localhost:80/post" -H "Content-Type: application/json" -d '{"userA": {"name": "hoge", "age": 29}}'
```

問題３
もう少し複雑なbodyを送信してみましょう。以下のようなオブジェクトをbodyに含めて、送信してください


{userA: {name: "hoge", age: 29}}

```bash
$ curl -X POST "http://localhost:80/post" -H "Content-Type: application/x-www-form-urlencoded" -d '{"name": "hoge"}'
```

問題４
「ごめんごめん、このエンドポイント、まだapplication/jsonに対応してないから、Content-Typeはapplication/x-www-form-urlencodedで送ってもらえる？」と先輩に頼まれました
Content-Typeを変更して、リクエストを送信してみましょう
以下のようなレスポンスを得られるはずです


{
  "data": "",  // 先ほどはここにname:hogeが含まれていた
  "form": {
    "{\"name\": \"hoge\"}": "" // 今はここに含まれている
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.54.0"
  }, 
  "json": null,  // 先ほどはここにname:hogeが含まれていた
  "url": "https://httpbin.org/post"
}




（postman）

ここまで上記課題で何度もcurlコマンドを作成しましたが、毎回コマンドを作成するのは大変です。課題を解いている間、こんなことを考えたのではないでしょうか：
以前作成したコマンドを保存しておきたい
複雑なリクエストを作成するのが辛い
もうちょっと簡単にリクエストを作成する方法があっても良さそうですよね
あるんです


postman　とは？
過去のリクエストを保存したり、複雑なリクエストをGUIから作成したり、様々な機能を備えた強化版curlみたいな物です
簡単なリクエストならcurlで事足りるのですが、複雑なリクエストになってくるとpostmanの方が便利です
例えば（後に説明しますが）OAuth2.0の認可により守られたAPIを開発している場合、認可を突破するまでに何度も通信が発生します
そのやりとりを手動でcurlで実施するのはとても面倒で、現実的ではありません
こうした認証もpostmanは一部自動化してくれます
これを機に使い方に慣れておきましょう！


postmanをインストールしてください
上記の課題（curlコマンド）と同じ結果を得られるよう、リクエストを全てpostmanで再現してください


クイズ
curlに関するクイズを作成してください
postmanに関するクイズを作成してください
クイズに関する詳細は　コチラ　を参照してください

### 参考資料

- [curl コマンド 使い方メモ](https://qiita.com/yasuhiroki/items/a569d3371a66e365316f)
- [よく使うcurlコマンドのオプション](https://qiita.com/ryuichi1208/items/e4e1b27ff7d54a66dcd9)
- [How to make a POST request with cURL](https://linuxize.com/post/curl-post-request/)
