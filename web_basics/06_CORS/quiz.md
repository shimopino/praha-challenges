# CORSについて理解する

<!-- START doctoc -->
<!-- END doctoc -->

## #1 Quiz

Express のエコシステムには CORS の設定を簡単にできるミドルウェアが存在している。

- [https://github.com/expressjs/cors](https://github.com/expressjs/cors)

このミドルウェアを使用して、以下の条件を満たすような CORS を実装してみましょう。

- 許可する Origin は `https://example.com`
- OPTIONS メソッドに対してステータスコードを 200 で返す
- 許可する HTTP メソッドは `PUT` と `POST`
- 上記の CORS は `/users/:id` のAPIに対して実装する

<details>
<summary>回答例</summary>

```js
const corsOptions = {
    origin: "https://example.com",
    optionsSuccessStatus: 200,
    methods: "PUT,POST"
}

app.get("/users/:id", cors(corsOptions), (req, res) => {
    res.json({
        message: "CORS enable"
    })
})
```

</details>

## #2 Quiz

最初のクイズと同様に [cors](https://github.com/expressjs/cors) ミドルウェアを使用する。

以下の複数の Origin を許可する CORS を実装してみましょう。

- `https://example1.com`
- `https://example2.com`

なお今回は全てのAPIに対して適用します。

<details>
<summary>回答例</summary>

```js
const allowList = [
    "https://example1.com",
    "https://example2.com"
];

const corsOptions = {
    origin: allowList
};

app.use(cors(corsOptions));
```

なお正規表現でも問題なし

</details>

## #3 Quiz

<details>
<summary>回答例</summary>
</details>
