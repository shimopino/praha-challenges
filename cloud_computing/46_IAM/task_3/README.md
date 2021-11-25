# 課題 3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [クイズ 1](#%E3%82%AF%E3%82%A4%E3%82%BA-1)
- [クイズ 2](#%E3%82%AF%E3%82%A4%E3%82%BA-2)
- [クイズ 3](#%E3%82%AF%E3%82%A4%E3%82%BA-3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## クイズ 1

IAM ポリシーのデザインパターンの 1 つにホワイトリストパターンが存在している。

ホワイトリストパターンでは、許可する権限のみ付与しているパターンであり、例えば次の例は S3 に関して特定のバケットへの特定のアクションのみを許可する形となっている。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::example-bucket"
    }
  ]
}
```

ではこのホワイトリストパターンのメリット・デメリットはなんでしょうか。

<details>
<summary>回答例</summary>
<div>

- メリット
  - 原則として必要最小限の権限のみを付与するのでセキュリティ面での信頼性が高い
  - 例えば、悪意を持って S3 を削除しようとしてもできない
  - 事前に十分な設計が必要となる
- デメリット

  - 事前に設計をしておかなければ権限を付与することができない
  - 新規プロジェクトであり、さまざまな環境を試す際には、この最小権限の原則だと効率が悪化してしまう
  - 結果として、管理コストが高くなってしまう

- [AWS の薄い本　 IAM のマニアックな話](https://www.amazon.co.jp/-/en/%E4%BD%90%E3%80%85%E6%9C%A8%E6%8B%93%E9%83%8E-ebook/dp/B085PZCMG2/ref=sr_1_6?keywords=IAM&qid=1637847751&sr=8-6)

</div>
</details>

## クイズ 2

IAM ポリシーのデザインパターンの 1 つにブラックリストパターンが存在している。

ブラックリストパターンでは許可しない権限のみを剥奪するパターンであり、例えば以下では、S3 バケットに対して新規作成や削除ができないように権限を制限している。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:eleteBucket", "s3:CreateBucket"],
      "Effect": "Deny",
      "Resource": "*"
    }
  ]
}
```

ではこのブラックリストパターンのメリット・デメリットはなんでしょうか。

<details>
<summary>回答例</summary>
<div>

- メリット
  - 禁止事項のみを定義する
  - そのため IAM ポリシーの設計・設定が最小限で済むことが多い
  - 事前に必要な権限を設計できていなかった場合でも、後から禁止事項を定義することができる
- デメリット
  - 想定していないサービスが使えるようになってしまう
  - AWS に新規サービスが追加されると、管理者権限をブラックリストで運用している場合、新規サービスはアクセスが許可されてしまうことになる

ちなみに AWS の権限はデフォルトで暗黙的拒否なので、許可のステートメントを作成した上でブラックリストで拒否している運用になる。

そのためホワイトリストとブラックリストを組み合わせて運用することが一般的である。

- [AWS の薄い本　 IAM のマニアックな話](https://www.amazon.co.jp/-/en/%E4%BD%90%E3%80%85%E6%9C%A8%E6%8B%93%E9%83%8E-ebook/dp/B085PZCMG2/ref=sr_1_6?keywords=IAM&qid=1637847751&sr=8-6)

</div>
</details>

## クイズ 3

<details>
<summary>回答例</summary>
<div>

</div>
</details>
