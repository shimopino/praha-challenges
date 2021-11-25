# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

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

