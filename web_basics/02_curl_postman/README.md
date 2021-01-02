<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;2 curlとpostmanに慣れる](#2-curl%E3%81%A8postman%E3%81%AB%E6%85%A3%E3%82%8C%E3%82%8B)
  - [課題1 cURLでのGetリクエスト](#%E8%AA%B2%E9%A1%8C1-curl%E3%81%A7%E3%81%AEget%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# #2 curlとpostmanに慣れる

curlのバージョンは以下になる。

```bash
$ curl --version
curl 7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 OpenSSL/1.1.1f zlib/1.2.11 brotli/1.0.7 libidn2/2.2.0 libpsl/0.21.0 (+libidn2/2.2.0) libssh/0.9.3/openssl/zlib nghttp2/1.40.0 librtmp/2.3
Release-Date: 2020-01-08
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp 
Features: AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets
```

また課題に取り組む際は、ローカルのコンテナ上で動かしているhttpbinに対してcurlを実行する。

```bash
$ docker run -it -d -p 80:80 --rm kennethreitz/httpbin
```


## 課題1 cURLでのGetリクエスト

```bash
$ curl -X GET -H "X-Test: hello" "http://localhost:80/get"
```



以下のリクエストをcurlコマンドでhttpbinに送信してください
curlコマンドをペアと比較して、なぜそのような書き方をしたのか、話し合ってみましょう
問題１
カスタムヘッダーを加える（X-Test='hello'）
methodはGET
URLはhttps://httpbin.org/headers
以下のようなレスポンスを得られるはずです
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.54.0", 
    "X-Test": "hello" // ここが重要！
  }
}

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