# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [](#)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## テーブル継承

問題点としては以下の2点が考えられる。

- 顧客と営業イベントという異なる事実情報が1つのテーブルで表現されている
- 1つ1つの営業イベントがカラムで分離されていること

そこで解決策として以下の2つを考える

- 顧客と営業イベントを異なるテーブルで管理する
- 営業イベントの1つ1つをレコード (行) として保存する
- 各営業イベント自体はテーブルを分離して表現する。

具体的には以下の論理設計を行った。

![](../assets/answer.png)




