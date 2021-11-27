# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [AWS VPC](#aws-vpc)
- [VPC の構築](#vpc-%E3%81%AE%E6%A7%8B%E7%AF%89)
- [リージョンとアベイラビリティゾーン](#%E3%83%AA%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%81%A8%E3%82%A2%E3%83%99%E3%82%A4%E3%83%A9%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3%E3%82%BE%E3%83%BC%E3%83%B3)
- [サブネット](#%E3%82%B5%E3%83%96%E3%83%8D%E3%83%83%E3%83%88)
  - [サブネットとは](#%E3%82%B5%E3%83%96%E3%83%8D%E3%83%83%E3%83%88%E3%81%A8%E3%81%AF)

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

これ以降のリソース作成は全て AWS CLI を使用する。

参考資料

- [VPC とサブネットの利用](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/working-with-vpcs.html)

## リージョンとアベイラビリティゾーン

AWS でネットワークを構築する際には、**リージョン** と **アベイラビリティゾーン** の違いを理解しておく必要がある。

AWS におけるリージョンとは、データセンターが集積されている世界中の物理的ロケーションを意味している。また、1 つの物理的ロケーションは複数の論理的データセンターで構築されており、これをアベイラビリティゾーンと呼んでいる。

それぞれのアベイラビリティゾーン自体は、1 つのリージョン内で切り離されており、冗長的な電力源やネットワークなどで構成されているため、アベイラビリティゾーンごとに VPC 内のサブネットを構築しておくことで、システムの耐障害性を向上させることができる。

例えば東京リージョンは以下のように 3 つのアベイラビリティゾーンで構成されている。

| Region         | Availibility Zone |
| -------------- | ----------------- |
| ap-northeast-1 | ap-northeast-1a   |
|                | ap-northeast-1c   |
|                | ap-northeast-1d   |

## サブネット

### サブネットとは

VPC 内で構築するサブネットは、インターネットに対して公開するパブリックサブネットと、インターネットと通信することのないプライベートサブネットに分けられる。

サブネットを構築するには、まずはどのように VPC に割り当てられている IP アドレスをグルーピングするのかを考慮する必要がある。

ただし、サブネットで利用できない IP アドレス（以下は `/24` の例）が存在することに注意する必要がある。

| host address | how to                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| .0           | ネットワークアドレス                                                           |
| .1           | VPC ルータ                                                                     |
| .2           | Amazon が提供する DNS サービス                                                 |
| .3           | AWS で予約されている                                                           |
| .255         | ブロードキャストアドレス<br>（VPC ではブロードキャストはサポートされていない） |

上記を考慮して、CIDR ブロックに対応するサブネット数とサブネットあたりの IP アドレスの数は以下のようになる。

| CIDR block                                 | Subnet Mask | Subnets | IP Addresses |
| ------------------------------------------ | ----------- | ------- | ------------ |
| `00001010.00000000`.`YY` `XXXXXX.XXXXXXXX` | /18         | 4       | 16379        |
| `00001010.00000000`.`YYYY` `XXXX.XXXXXXXX` | /20         | 16      | 4091         |
| `00001010.00000000`.`YYYYYY` `XX.XXXXXXXX` | /22         | 64      | 1019         |
| `00001010.00000000`.`YYYYYYYY`.`XXXXXXXX`  | /24         | 256     | 251          |

> ただし VPC あたりのサブネット作成上限数はデフォルトで 200 個までなので注意が必要である。

### サブネットの構築

今回は以下の構成図のように、冗長性を持たせるためのマルチ AZ 構成であり、インターネットに公開するサブネットと公開しないサブネットを構築していく。

![](assets/design_subnet.drawio.svg)

AWS CLI では以下のコマンドで作成する。

```bash
# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/create-subnet.html

# 使用できるアベイラビリティゾーンを全て確認する
aws ec2 describe-availability-zones \
    --region ap-northeast-1 \
    --profile <your profile>

# praha-subnet-public-1a
aws ec2 create-subnet \
    --vpc-id vpc-07694e790ce13cfbc \
    --cidr-block 10.0.0.0/20 \
    --availability-zone ap-northeast-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=praha-subnet-public-1a}]' \
    --profile <your profile>

# praha-subnet-public-1c
aws ec2 create-subnet \
    --vpc-id vpc-07694e790ce13cfbc \
    --cidr-block 10.0.16.0/20 \
    --availability-zone ap-northeast-1c \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=praha-subnet-public-1c}]' \
    --profile <your profile>

# praha-subnet-private-1a
aws ec2 create-subnet \
    --vpc-id vpc-07694e790ce13cfbc \
    --cidr-block 10.0.48.0/20 \
    --availability-zone ap-northeast-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=praha-subnet-private-1a}]' \
    --profile <your profile>

# praha-subnet-private-1c
aws ec2 create-subnet \
    --vpc-id vpc-07694e790ce13cfbc \
    --cidr-block 10.0.64.0/20 \
    --availability-zone ap-northeast-1c \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=praha-subnet-private-1c}]' \
    --profile <your profile>
```

これで以下のようなリソースを作成することができた。

![](assets/subnet_result.png)

