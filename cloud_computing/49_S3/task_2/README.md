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

## バックアップ

## レプリケーション

AWS S3 が提供しているレプリケーションを使用すると、S3 バケット間でオブジェクトを自動かつ非同期的にコピーすることが可能である。

オブジェクトは、単一または複数のレプリケーション先のバケットにコピーすることが可能であり、リージョンを跨いだレプリケーションもサポートしている。

注意点としては、デフォルトではレプリケーション設定を行った後で追加されたオブジェクトがレプリケーション対象となるため、既存のオブジェクトを他のバケットにコピーする場合はサポートセンターに問い合わせる必要がある点である。

参考資料

- [オブジェクトのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html)

### クロスリージョンレプリケーション

## バージョニング

### バージョニングの挙動確認
