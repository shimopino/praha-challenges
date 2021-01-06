# #2 curlとpostmanに慣れる

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [得られた知見](#%E5%BE%97%E3%82%89%E3%82%8C%E3%81%9F%E7%9F%A5%E8%A6%8B)
    - [`Host`](#host)
    - [`X-Amzn-Trace-Id`](#x-amzn-trace-id)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [得られた知見](#%E5%BE%97%E3%82%89%E3%82%8C%E3%81%9F%E7%9F%A5%E8%A6%8B-1)
    - [`origin`](#origin)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
- [課題4](#%E8%AA%B2%E9%A1%8C4)
  - [得られた知見](#%E5%BE%97%E3%82%89%E3%82%8C%E3%81%9F%E7%9F%A5%E8%A6%8B-2)
- [課題5](#%E8%AA%B2%E9%A1%8C5)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

curlのバージョンは以下になります。

```bash
$ curl --version
curl 7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 OpenSSL/1.1.1f zlib/1.2.11 brotli/1.0.7 libidn2/2.2.0 libpsl/0.21.0 (+libidn2/2.2.0) libssh/0.9.3/openssl/zlib nghttp2/1.40.0 librtmp/2.3
Release-Date: 2020-01-08
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp 
Features: AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets
```

- [cURL Tool Documentation](https://curl.se/docs/manpage.html)

また課題に取り組む際は、[`https://httpbin.org/`](https://httpbin.org/)と、ローカルのコンテナ上で動かしているhttpbinに対してcurlを実行します。

```bash
# コンテナ起動時のコマンド
$ docker run -it -d -p 80:80 --rm kennethreitz/httpbin
```

## 課題1

cURLにて、HTTPリクエスト内のHTTPヘッダをレスポンスで返すAPIである`https://httpbin.org/headers`に対してGETリクエストを発行します。その際にカスタムHTTPヘッダとして`X-Test: hello`を付与します。

```bash
# to https
$ curl -X GET -H "X-Test: hello" "https://httpbin.org/headers"

# to Docker Container
$ curl -X GET -H "X-Test: hello" "http://localhost:80/headers"
```

サービス提供元にリクエストを送信した場合の結果は以下になります。

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

ローカルのDockerコンテナ上にリクエストを送信した場合は以下になります。

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

使用したcURLのオプションは以下になります。

| オプション                    | 設定例                      | 
| ----------------------------- | --------------------------- | 
| `-X, --request <command>`     | `-X GET`                    | 
| `-H, --header <header/@file>` | `-H "X-Custom-Header: XXX"` | 

送信先環境の違いによって、特定のHTTPヘッダに格納される値は異なっている。

#### `Host`

`Host`にはリクエストの送信先のホスト名が入る。Dockerの場合はローカル環境が送信先になるため、`localhost`が格納されています。

#### `X-Amzn-Trace-Id`

サービス提供元へGETリクエストを送信した際、HTTPヘッダに`X-Amzn-Trace-Id`が確認されました。

これはおそらく、httpbinにリクエストが送信される前段に、負荷分散のためにApplication Load Balancerを組み込みこんでおり、自動的にHTTPヘッダが追加されるためだと考えている。（確証なし）

- [X-Amzn-Trace-Id を使用して Application Load Balancer リクエストをトレースする方法を教えてください。](https://aws.amazon.com/jp/premiumsupport/knowledge-center/trace-elb-x-amzn-trace-id/)

## 課題2

cURLにて、POSTリクエストを`https://httpbin.org/post`に送信します。その際にHTTPヘッダとして`Content-Type: "application/json"`を追加し、ボディには`{"name": "hoge"}`を追加します。

```bash
# to https
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "hoge"}' "https://httpbin.org/post"

# to Docker Container
$ curl -X POST -H "Content-Type: application/json" -d '{"name": "hoge"}' "http://localhost:80/post"
```

サービス提供元にリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "{\"name\": \"hoge\"}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/json", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedd333-2004a9504bb454e574d7de23"
  }, 
  "json": {
    "name": "hoge"
  }, 
  "origin": "203.0.111.1", # RFC5737に準拠した値に変換
  "url": "https://httpbin.org/post"
}
```

ローカルのDockerコンテナ上にリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "{\"name\": \"hoge\"}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/json", 
    "Host": "localhost", 
    "User-Agent": "curl/7.68.0"
  }, 
  "json": {
    "name": "hoge"
  }, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

### 得られた知見

使用したcURLのオプションは以下になります。

| オプション          | 設定例                  | 
| ------------------- | ----------------------- | 
| `-d, --data <data>` | `-d '{"name": "hoge"}'` | 

#### `origin`

`origin`の値には、クライアントの送信元IPアドレスが格納されます。

Dockerコンテナの場合は、すべての通信がローカルネットワーク上で行われるため、ローカルIPアドレスが適用されます。

サービス提供元の場合は、クライアントのローカルIPアドレスは、ブロードバンドルーターなどのNAT機能により、グローバルIPアドレスに変換されるため、サービス提供元からはこのグローバルIPアドレスしか見ることはできません。

- [あなたの情報確認くん](https://www.ugtop.com/spill.shtml)
- [IPアドレス確認（IPアドレスチェック）ツール](luft.co.jp/cgi/ipcheck.php)

## 課題3

多少複雑なボディである`{userA: {name: "hoge", age: 29}}`を同様にPOSTリクエストで送信します。

```bash
# to https
$ curl -X POST -H "Content-Type: application/json" -d '{"userA": {"name": "hoge", "age": 29}}'  "https://httpbin.org/post"

# to Docker Container
$ curl -X POST -H "Content-Type: application/json" -d '{"userA": {"name": "hoge", "age": 29}}' "http://localhost:80/post" 
```

サービス提供元にリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "38", 
    "Content-Type": "application/json", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedd834-25b5dfa551e03cae54e1c547"
  }, 
  "json": {
    "userA": {
      "age": 29, 
      "name": "hoge"
    }
  }, 
  "origin": "203.0.111.1", # RFC5737に準拠した値に変換
  "url": "https://httpbin.org/post"
}
```

ローカルのDockerコンテナ上にリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "38", 
    "Content-Type": "application/json", 
    "Host": "localhost", 
    "User-Agent": "curl/7.68.0"
  }, 
  "json": {
    "userA": {
      "age": 29, 
      "name": "hoge"
    }
  }, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

## 課題4

cURLにて、POSTリクエストを`https://httpbin.org/post`に送信します。その際にHTTPヘッダとして`Content-Type: "application/json"`を追加し、ボディには`{"name": "hoge"}`を追加します。

```bash
# to https
$ curl -X POST -d '{"name": "hoge"}' "https://httpbin.org/post"

# to Docker Container
$ curl -X POST -d '{"name": "hoge"}' "http://localhost:80/post"
```

サービス提供元へリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "{\"name\": \"hoge\"}": ""
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.68.0", 
    "X-Amzn-Trace-Id": "Root=1-5fedd9b3-0e2949bc0f9c8fc0535346d7"
  }, 
  "json": null, 
  "origin": "203.0.111.1", # RFC5737に準拠した値に変換
  "url": "https://httpbin.org/post"
}
```

ローカルのDockerコンテナ上にリクエストを送信した場合は以下になります。

```bash
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "{\"name\": \"hoge\"}": ""
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "localhost", 
    "User-Agent": "curl/7.68.0"
  }, 
  "json": null, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

### 得られた知見

リクエストの本文のタイプを指定する`Content-Type`は、指定しなければ`application/x-www-form-urlencoded`が格納されます。

これはリクエストを以下のように変換することと同じです。

```bash
POST /post HTTP/1.1
HOST httpbin.org
Content-Type: application/x-www-form-urlencoded

name=hoge
```

なお`Content-Type`が上記の形式であれば、以下に定義されている単純リクエストの条件を満たすため、プリフライトリクエストは送信されません。

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

## 課題5

ローカル環境のPostmanでも同じ結果は得られていますが、情報共有としてオンライン環境で作成したリクエストをドキュメント化したほうが便利なので、以下に配置します。

[https://documenter.getpostman.com/view/9645891/TVt1ARGc](https://documenter.getpostman.com/view/9645891/TVt1ARGc)

## 参考資料

- [curl コマンド 使い方メモ](https://qiita.com/yasuhiroki/items/a569d3371a66e365316f)
- [よく使うcurlコマンドのオプション](https://qiita.com/ryuichi1208/items/e4e1b27ff7d54a66dcd9)
- [How to make a POST request with cURL](https://linuxize.com/post/curl-post-request/)
