# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [バックアップ](#%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97)
- [レプリケーション](#%E3%83%AC%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)
  - [クロスリージョンレプリケーション](#%E3%82%AF%E3%83%AD%E3%82%B9%E3%83%AA%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%83%AC%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)
- [バージョニング](#%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%8B%E3%83%B3%E3%82%B0)
  - [バージョニングの挙動確認](#%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%8B%E3%83%B3%E3%82%B0%E3%81%AE%E6%8C%99%E5%8B%95%E7%A2%BA%E8%AA%8D)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## レプリケーション

AWS S3 が提供しているレプリケーションを使用すると、S3 バケット間でオブジェクトを自動かつ非同期的にコピーすることが可能である。

オブジェクトは、単一または複数のレプリケーション先のバケットにコピーすることが可能であり、リージョンを跨いだレプリケーションもサポートしている。

注意点としては、デフォルトではレプリケーション設定を行った後で追加されたオブジェクトがレプリケーション対象となるため、既存のオブジェクトを他のバケットにコピーする場合はサポートセンターに問い合わせる必要がある点である。

参考資料

- [オブジェクトのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html)

### クロスリージョンレプリケーション

では実際に異なるリージョン間のオブジェクトのレプリケーションの挙動を確認するために、バケットを作成していく。

- オリジナルのバケットは、`ap-northeast-1 (東京)` に配置する

  - バージョニングは有効に設定している

    ![](assets/create-origin-bucket.png)

- レプリケーションのバケットは `ap-northeast-3 (大阪)` に配置する

  - バージョンには有効に設定している

    ![](assets/create-replica-bucket.png)

ではオリジンバケットにオブジェクトを追加する。

![](assets/add-object-to-origin.png)

レプリケーション設定を実施していない状態では、レプリケーションバケットにオブジェクトがコピーされることはない。

![](assets/not-copy-to-replica.png)

では以下の様にオリジンバケットに対して、レプリケーションルールを作成していく。

![](assets/create-replication-rule.png)

この時下記の設定を採用している。

| 項目                     | 値                                 |
| :----------------------- | :--------------------------------- |
| レプリケーションルール名 | ReplicaRule                        |
| ルールスコープ           | バケット内の全てのオブジェクト     |
| 送信先                   | このアカウントのバケットを選択する |
|                          | replica-bucket-oosaka              |
| IAM ロール               | 新しいロールの作成                 |

これで以下のレプリケーションルールが作成された。

この状態でオリジンバケットに対して `mycat.jpg` ファイルをアップロードする。

![](assets/add-object2-to-origin.png)

この後でレプリケーションバケットを確認すると、レプリケーション前のオブジェクトはコピーされておらず、新たにオリジンバケットに追加したオブジェクトがコピーされていることがわかる。

![](assets/copy-object2-to-replica.png)

今の状態でオリジンバケットからオブジェクトを全て削除してみる。

![](assets/delete-object2-from-origin.png)

この場合、レプリケーションバケットまで反映されていないことがわかる。

![](assets/not-delete-object2.png)

削除も同期したい場合には、以下の様に削除マーカーのレプリケーションも実施する必要がある。

![](assets/add-delete-rule.png)

これで削除も同期可能となる。

参考資料

- [Amazon S3 のレプリケーション機能を使用してみました。](https://dev.classmethod.jp/articles/lim-s3-replication/)

## バージョニング

### バージョニングの挙動確認
