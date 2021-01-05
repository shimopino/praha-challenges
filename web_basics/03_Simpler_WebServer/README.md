# リクエストをパースするWebサーバを構築する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [cURL](#curl)
  - [Postman](#postman)
- [課題2](#%E8%AA%B2%E9%A1%8C2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

リクエストをparseする際に、以前は`body-parser`モジュールが使用されていたが、Express4.x以降からは`express`自体がラップを提供している。

- [express.jsonなどの実装](https://github.com/expressjs/express/blob/508936853a6e311099c9985d4c11a4b1b8f6af07/lib/express.js#L78)

### cURL

```bash
$ curl localhost:8080 -H "Content-Type: application/json"
{"text":"hello world"}

$ curl localhost:8080 -d '{"name": "hoge"}' -H "Content-Type: application/json"
{"name":"hoge"}

$ curl localhost:8080 -d '{"name": "hoge"}'
{"error":"400! Bad Request"}
```

### Postman

[https://documenter.getpostman.com/view/9645891/TVt2c3oU](https://documenter.getpostman.com/view/9645891/TVt2c3oU
)

## 課題2

POSTリクエストを送信する際に、`Content-Type`による挙動の違いをまとめる。

### `application/x-www-form-urlencoded`

```bash
$ curl --request POST --data "name=hoge" "https://httpbin.org/post"

>>
POST /post HTTP/2
Host: httpbin.org
user-agent: curl/7.68.0
accept: */*
content-length: 9
content-type: application/x-www-form-urlencoded

name=hoge
```

### `application/json`

```bash
$ curl --data '{"name": "hoge"}' --header "Content-Type: application/json" "https://httpbin.org/post"

>>
POST /post HTTP/2
Host: httpbin.org
user-agent: curl/7.68.0
accept: */*
content-type: application/json
content-length: 16

{"name": "hoge"}
```
