# 課題3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [追加仕様](#%E8%BF%BD%E5%8A%A0%E4%BB%95%E6%A7%98)
- [追加仕様 (ペア)](#%E8%BF%BD%E5%8A%A0%E4%BB%95%E6%A7%98-%E3%83%9A%E3%82%A2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 追加仕様

- 注文した商品の受け取り方法を変更する
  - 「お持ち帰り」か「宅配」のどちらかを選択できる
  - 「お持ち帰り」の場合は税別で5000円以上のセット商品を5%OFFにする
  - [京寿司](http://kyousushi.co.jp/shop/deliverymenu.html)を参考にした

![](../assets/task_3/sushi.png)

## 追加仕様 (ペア)

- 店舗ごとにメニューを変更する
  - 注文可能なお好み寿司は、3つのエリア (西日本/九州・沖縄/東日本) で異なる

考え方としては、消費税率と商品を組み合わせるために消費是区分テーブルを導入したときと同じように、商品とエリアを紐づけるためのテーブルを導入する。

![](../assets/task_3/sushi-pair.png)
