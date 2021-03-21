# CORSについて理解する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 Quiz](#1-quiz)
- [&#035;2 Quiz](#2-quiz)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 Quiz

Express のエコシステムには CORS の設定を簡単にできるミドルウェアが存在している。

- [https://github.com/expressjs/cors](https://github.com/expressjs/cors)

このミドルウェアを使用して、以下の条件を満たすような CORS を実装してみましょう。

- 許可する Origin は `http://loclahost:8090`
- OPTIONS メソッドに対してステータスコードを 204 で返す
- 許可する HTTP メソッドは `PUT` と `POST`
- 許可する HTTP ヘッダは `Content-Type`
- 上記の CORS は `/users/:id` のAPIに対して実装する

実装の際には以下の、該当ソースコードを参考にしてもOKです。

- [https://github.com/KeisukeShimokawa/praha-challenges/blob/feature/task6-issue-30/web_basics/06_CORS/quiz/quiz-1/src/routes/router.ts#L6-L8](https://github.com/KeisukeShimokawa/praha-challenges/blob/feature/task6-issue-30/web_basics/06_CORS/quiz/quiz-1/src/routes/router.ts#L6-L8)

<details>
<summary>回答例</summary>

```js
const cors = require("cors")

// CORSの設定
const corsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin
  const ALLOW_ORIGINS = ["http://localhost:8090"]
  const ALLOW_METHODS = ["PUT", "POST"]
  const ALLOW_HEADERS = ["Content-Type"]
  const OPTIONS_SUCCESS_STATUS = 204

  // ALLOW_ORIGINSの要素以外のオリジンでは、origin:falseとなるため、CORSエラーが発生する
  const isAllowOrigin = () => {
    if (ALLOW_ORIGINS.includes(origin)) {
      return true
    }
    return false
  }

  const corsOptions = {
    origin: isAllowOrigin(),
    methods: ALLOW_METHODS.join(","),
    allowedHeaders: ALLOW_HEADERS.join(","),
    optionsSuccessStatus: OPTIONS_SUCCESS_STATUS,
  }

  console.log(corsOptions)
  callback(null, corsOptions)
}

module.exports.corsWithOptions = cors(corsOptionsDelegate)
```

あとはこれを使用すればいい。

```js
router.options("/users/:id", cors.corsWithOptions)

router.post("/users/:id", cors.corsWithOptions, (req, res) => {
  commonProcess(req, res)
})

router.put("/users/:id", cors.corsWithOptions, (req, res) => {
  commonProcess(req, res)
})
```

</details>

## #2 Quiz

最初のクイズと同様に [cors](https://github.com/expressjs/cors) ミドルウェアを使用する。

クイズ1の条件の中で Origin に関する設定を変更する。
複数の Origin を許可する CORS を実装してみましょう。

- `http://localhost:8090`
- `http://localhost:8091`

実装の際には以下の、該当ソースコードを参考にしてもOKです。

- [https://github.com/KeisukeShimokawa/praha-challenges/blob/feature/task6-issue-30/web_basics/06_CORS/quiz/quiz-2/src/routes/router.ts#L6-L14](https://github.com/KeisukeShimokawa/praha-challenges/blob/feature/task6-issue-30/web_basics/06_CORS/quiz/quiz-2/src/routes/router.ts#L6-L14)

<details>
<summary>回答例</summary>

```js
const cors = require("cors")

// CORSの設定
const corsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin
  const ALLOW_ORIGINS = ["http://localhost:8090", "http://localhost:8091"]
  const ALLOW_METHODS = ["PUT", "POST"]
  const ALLOW_HEADERS = ["Content-Type"]
  const OPTIONS_SUCCESS_STATUS = 204

  // ALLOW_ORIGINSの要素以外のオリジンでは、origin:falseとなるため、CORSエラーが発生する
  const isAllowOrigin = () => {
    if (ALLOW_ORIGINS.includes(origin)) {
      return true
    }
    return false
  }

  const corsOptions = {
    origin: isAllowOrigin(),
    methods: ALLOW_METHODS.join(","),
    allowedHeaders: ALLOW_HEADERS.join(","),
    optionsSuccessStatus: OPTIONS_SUCCESS_STATUS,
  }

  console.log(corsOptions)
  callback(null, corsOptions)
}

module.exports.corsWithOptions = cors(corsOptionsDelegate)
```

</details>
