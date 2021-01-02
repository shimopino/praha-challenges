# リクエストをパースするWebサーバを構築する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [リクエストをパースするWebサーバを構築する](#リクエストをパースするwebサーバを構築する)
  - [課題1](#課題1)
    - [cURL](#curl)
    - [Postman](#postman)
  - [課題2](#課題2)

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

