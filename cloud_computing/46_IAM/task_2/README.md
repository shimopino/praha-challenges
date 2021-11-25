# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [IAM ユーザーを作成する](#iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
  - [管理者権限を有する IAM ユーザーを作成する](#%E7%AE%A1%E7%90%86%E8%80%85%E6%A8%A9%E9%99%90%E3%82%92%E6%9C%89%E3%81%99%E3%82%8B-iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
  - [一般権限を有する IAM ユーザーを作成する](#%E4%B8%80%E8%88%AC%E6%A8%A9%E9%99%90%E3%82%92%E6%9C%89%E3%81%99%E3%82%8B-iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
  - [ルートユーザーと IAM ユーザー](#%E3%83%AB%E3%83%BC%E3%83%88%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A8-iam-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC)
- [IAM グループを作成する](#iam-%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
  - [アクセス権限の付与方法](#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E6%A8%A9%E9%99%90%E3%81%AE%E4%BB%98%E4%B8%8E%E6%96%B9%E6%B3%95)
  - [アクセス権限を付与する対象](#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E6%A8%A9%E9%99%90%E3%82%92%E4%BB%98%E4%B8%8E%E3%81%99%E3%82%8B%E5%AF%BE%E8%B1%A1)
- [IAM ロール](#iam-%E3%83%AD%E3%83%BC%E3%83%AB)
  - [EC2 インスタンスの用意](#ec2-%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AE%E7%94%A8%E6%84%8F)
  - [S3 バケットの作成](#s3-%E3%83%90%E3%82%B1%E3%83%83%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)
  - [IAM ポリシーの作成](#iam-%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC%E3%81%AE%E4%BD%9C%E6%88%90)
  - [IAM ロールの作成・アタッチ](#iam-%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90%E3%83%BB%E3%82%A2%E3%82%BF%E3%83%83%E3%83%81)

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

### ルートユーザーと IAM ユーザー

ルートユーザーは AWS リソースに対するフルアクセス権限を有しており、アクセス制御をすることもできないため、普段の開発ではアクセス権限を付与した IAM ユーザーを使用することが推奨されている。

- [AWS アカウント ルートユーザーのアクセスキーをロックする](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html#lock-away-credentials)

## IAM グループを作成する

では `AdministratorAccess` 権限を有する IAM グループを作成する。

実際に作成されたグループを確認してみると、ポリシーに `AdministratorAccess` 権限が付与されているグループが作成されていることがわかる。

![](assets/Administrator_group.png)

ここで IAM グループ内に、なんの権限も持たせていない IAM ユーザーを所属させて、対象のユーザーで IAM コンソールを見てみると、以下のようにグループに付与されている権限を通してエラーが発生していないことがわかる。

![](assets/Administrator_group_access.png)

### アクセス権限の付与方法

アクセス権限を付与する場合に、 IAM ユーザーに直接付与する方法と IAM グループに付与する方法が存在している。

以下の理由から IAM グループに対してアクセス権限を付与する方がいい。

- 権限の付与漏れや過剰付与などのミスが発生する確率が上昇する
- グループで管理することで複数のユーザーに対して同じ権限を割り当てることができる

### アクセス権限を付与する対象

個々の IAM ユーザーにアクセス権限を付与する場合には、 ジョブ機能と関連する IAM グループに対してアクセス権限を割り当てて、 IAM ユーザーを対象のグループ（管理者、開発者など）に所属させることで管理コストを減らすことが推奨されている。

- [IAM ユーザーへのアクセス許可を割り当てるためにユーザーグループを使用する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html#use-groups-for-permissions)

## IAM ロール

### EC2 インスタンスの用意

SSH で接続するために事前に作成したキーペアを、新たに作成した EC2 インスタンスにアタッチすることで、以下のように OpenSSH でターミナルにアクセスすることができるようになる。

![](assets/ec2_ssh_access.png)

### S3 バケットの作成

次に S3 バケットを以下の名称で作成する。

![](assets/s3_bucket.png)

サンプルとして画像をアップロードする。

![](assets/s3_object.png)

### IAM ポリシーの作成

ここまでの段階で SSH でアクセスした EC2 インスタンス上で `aws cli` コマンドを使用してみると、以下のようなエラーが発生することがわかる。

![](assets/aws_cli_error.png)

これは

そこで以下のように対象の S3 バケット内のオブジェクトを参照するためだけのアクセス制御を IAM ポリシーとして作成する。

![](assets/policy_list_bucket.png)

これでアクセス制御の準備は完了した。

### IAM ロールの作成・アタッチ

次に EC2 インスタンスに IAM ポリシーを付与するための IAM ロールを作成する。

![](assets/attach_policy.png)

![](assets/policy_result.png)

次に作成した IAM ロールを EC2 インスタンスに付与する。

![](assets/change_ec2_role.png)

![](assets/attach_policy_to_ec2.png)

こうすることで再度 EC2 インスタンスにアクセスしてコマンドを実行すると、 IAM ロールへの認証と IAM ポリシーに紐づくアクセス制御が実行されるため、以下のように今度は対象の S3 バケット内のオブジェクトを取得することができるようになる。

![](assets/aws_cli_success.png)

試しに IAM ロールの紐付けを外すと、以下のようにコマンドのエラーが発生していることがわかる。

![](assets/aws_cli_role_error.png)

