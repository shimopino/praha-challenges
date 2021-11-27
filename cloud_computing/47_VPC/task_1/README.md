# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題 1](#課題-1)
  - [AWS VPC](#aws-vpc)
  - [VPC の構築](#vpc-の構築)
  - [リージョンとアベイラビリティゾーン](#リージョンとアベイラビリティゾーン)
  - [サブネット](#サブネット)
    - [サブネットとは](#サブネットとは)
    - [サブネットの構築](#サブネットの構築)
  - [インターネットゲートウェイ](#インターネットゲートウェイ)
  - [ルートテーブル](#ルートテーブル)
    - [プライベートサブネット用](#プライベートサブネット用)
  - [SSH アクセス可能な EC2 インスタンス](#ssh-アクセス可能な-ec2-インスタンス)
    - [キーペアの作成](#キーペアの作成)
    - [セキュリティグループの作成](#セキュリティグループの作成)
    - [EC2 インスタンスの作成](#ec2-インスタンスの作成)
    - [SSH によるアクセス](#ssh-によるアクセス)
  - [プライベートサブネット内での EC2 インスタンスの作成](#プライベートサブネット内での-ec2-インスタンスの作成)
    - [キーペアの作成](#キーペアの作成-1)
    - [セキュリティグループの作成](#セキュリティグループの作成-1)
    - [EC2 インスタンスの作成](#ec2-インスタンスの作成-1)
    - [多段接続による EC2 インスタンスへのアクセス](#多段接続による-ec2-インスタンスへのアクセス)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## AWS VPC

AWS VPC (Virtual Private Cloud) を使用すると AWS 上に仮想ネットワークを構築することができ、仮想ネットワーク内で EC2 インスタンスや RDS を配置したり、トラフィックを制御して各サービスと通信したりできる。

VPC では以下のような様々なコンポーネントを組み合わせることで仮想ネットワークを構築して
いく。

![](assets/vpc_component.drawio.svg)

参考資料

- [Amazon VPC とは？](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/what-is-amazon-vpc.html)

## VPC の構築

AWS VPC を構築する際には、使用する IP アドレスを CIDR ブロック形式で指定する必要がある。

今回は 16 ビットマスクの IP アドレスの範囲を指定している。

- CIDR ブロック：`10.0.0.0/16`
  - 割り当てられる IP アドレスの範囲：`10.0.0.0 ~ 10.0.255.255`
  - 割り当てられる IP アドレスの数：`65536`

構成図としては以下のようになっている。

![](assets/design_vpc.drawio.svg)

これで以下の画面のように設定項目を追加することで VPC を作成した。

![](assets/vpc_result.png)

AWS CLI 上では下記のコマンドで作成することができる。

```bash
# https://docs.aws.amazon.com/cli/latest/reference/ec2/create-vpc.html

# praha-vpc
aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=praha-vpc}]' \
    --profile <yout profile>
```

参考資料

- [VPC とサブネットの利用](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/working-with-vpcs.html)

