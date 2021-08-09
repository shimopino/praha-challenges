# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [モデル図](#%E3%83%A2%E3%83%87%E3%83%AB%E5%9B%B3)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ドメインモデル図

まずはドメインモデル図を下記の観点で考える。

- [x] 各オブジェクト自体に状態を持たせる
  - 永続化させる場合は、イベント型テーブルを導入する
  - 例えば、ユーザーと課題の関係は交差テーブルで表現するなど
- [ ] 参加者の移動をどうするのか
  - ユーザーの在籍ステータスが変更されると、合わせてチームやペアの参加者も変更する
  - この責務をどこに持たせるのか

![](../assets/domainModel.png)

## 参考資料

- [PlantUMLでドメイン駆動設計のモデリングを実装する（Nizi Project編）](https://tech.holmescloud.com/entry/2020/10/16/150605#%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%A2%E3%83%87%E3%83%AB%E5%9B%B3)

