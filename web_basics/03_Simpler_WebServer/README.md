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

