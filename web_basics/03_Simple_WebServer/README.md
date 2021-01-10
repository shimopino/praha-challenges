# リクエストをパースする Web サーバを構築する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

<<<<<<< HEAD
- [リクエストをパースする Web サーバを構築する](#リクエストをパースする-web-サーバを構築する)
  - [課題 1](#課題-1)
    - [cURL](#curl)
    - [Postman](#postman)
  - [課題 2](#課題-2)
    - [`application/x-www-form-urlencoded`](#applicationx-www-form-urlencoded)
    - [`application/json`](#applicationjson)
    - [使い分け](#使い分け)
  - [VSCode で行う設定など](#vscode-で行う設定など)
=======
- [課題 1](#%E8%AA%B2%E9%A1%8C-1)
  - [cURL](#curl)
  - [Postman](#postman)
- [課題 2](#%E8%AA%B2%E9%A1%8C-2)
  - [`application/x-www-form-urlencoded`](#applicationx-www-form-urlencoded)
  - [`application/json`](#applicationjson)
  - [使い分け](#%E4%BD%BF%E3%81%84%E5%88%86%E3%81%91)
- [VSCode で行う設定など](#vscode-%E3%81%A7%E8%A1%8C%E3%81%86%E8%A8%AD%E5%AE%9A%E3%81%AA%E3%81%A9)
>>>>>>> febc912aba859c7faba4f29e63133bd5108d1160

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題 1

### Express の実装メモ

リクエストを parse する際に、以前は`body-parser`モジュールが使用されていたが、Express4.x 以降からは`express`自体がラップを提供している。

- [express.json などの実装](https://github.com/expressjs/express/blob/508936853a6e311099c9985d4c11a4b1b8f6af07/lib/express.js#L78)

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

[https://documenter.getpostman.com/view/9645891/TVt2c3oU](https://documenter.getpostman.com/view/9645891/TVt2c3oU)

### VSCode Rest Client

単純なリクエストであれば VSCode の拡張機能である「[Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)」を使用することが可能である。

以下のコマンドを`.http`という拡張子のファイルに記載しておけば、HTTP リクエストとそのレスポンスを確認することができる。

```bash
GET http://localhost:8080/ HTTP/1.1

###

POST http://localhost:8080/ HTTP/1.1
Content-Type: application/json

{
    "name": "hoge"
}

###

POST http://localhost:8080/ HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=hoge
```

### NodeJS のストリーム形式

#### 参考資料

- [strean-handbook](https://github.com/meso/stream-handbook)
- [Node.js の Stream API の概要](https://qiita.com/takaaki7/items/fbc33dff1e17fe6a3d38)
- [Node.js Stream を使いこなす](https://qiita.com/masakura/items/5683e8e3e655bfda6756)
- [ストリーム処理とは何か？＋ 2016 年の出来事](https://qiita.com/kimutansk/items/60e48ec15e954fa95e1c)
- [Why is Node.js scalable?](https://stackoverflow.com/questions/16949483/why-is-node-js-scalable)
- [Node.js の Stream API で大量プッシュ通知を高速化するテクニック (1/2)](https://www.atmarkit.co.jp/ait/articles/1502/12/news026.html)

## 課題 2

POST リクエストを送信する際に、`Content-Type`による挙動の違いをまとめる。

### `application/x-www-form-urlencoded`

```bash
$ curl https://httpbin.org/post \
  --request POST \
  --data "name=hoge"

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
$ curl https://httpbin.org/post \
  --request POST \
  --data '{"name": "hoge"}' \
  --header "Content-Type: application/json"

>>
POST /post HTTP/2
Host: httpbin.org
user-agent: curl/7.68.0
accept: */*
content-type: application/json
content-length: 16

{"name": "hoge"}
```

### 使い分け

- URL-Encoding の特徴
  - `+`や`%20`などの統一がされていない
  - 末尾の改行に敏感
