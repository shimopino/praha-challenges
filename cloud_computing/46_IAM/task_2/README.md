# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [IAM ユーザーを作成する](#iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
  - [管理者権限を有する IAM ユーザーを作成する](#%E7%AE%A1%E7%90%86%E8%80%85%E6%A8%A9%E9%99%90%E3%82%92%E6%9C%89%E3%81%99%E3%82%8B-iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## IAM ユーザーを作成する

### 管理者権限を有する IAM ユーザーを作成する

ルートユーザーとしてログインした後は以下の手順に従えばいい。

1. ID とパスワードでアクセス可能な `Administrator` ユーザーを作成する

   ![](assets/Administrator_user.png)

2. 作成するユーザーに対して `AdministratorAccess` 権限を付与する

   ![](assets/AdministratorAccess.png)

この `AdministratorAccess` 権限の中身を見てみると以下のようになっており、全てのリソースに対する全ての操作が実行可能となっていることがわかる。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```

### 一般権限を有する IAM ユーザーを作成する

今度は同じ手順で `PowerUserAccess` 権限を付与したユーザーを作成すると、以下のように IAM コンソール画面でエラーが発生していることがわかる。

![](assets/PowerUserAccess.png)

これは `PowerUserAccess` 権限ではコンソール画面に出力するためのリソース操作に対する権限が足りていないからである。

実際に `PowerUserAccess` 権限の中身を見てみると、`NotAction` にあるように IAM に関係するほとんどの操作が制限されており、ロールを作成したり取得したりすることしかできないことがわかる。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "NotAction": ["iam:*", "organizations:*", "account:*"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole",
        "iam:DeleteServiceLinkedRole",
        "iam:ListRoles",
        "organizations:DescribeOrganization",
        "account:ListRegions"
      ],
      "Resource": "*"
    }
  ]
}
```

