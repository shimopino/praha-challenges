# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定

[読書メーター](https://bookmeter.com/) のように漫画や小説などのリソースが存在しており、どちらのリソースにもユーザーはコメントを追加できるサービスとする。

このときに以下のテーブル設計を考える。

```puml
entity Manga {
    * id: varchar [PK]
    ---
    name: varchar 
}

entity Novel {
    * id: varchar
    ---
    name: varchar
}

entity Comment {
    * id: varchar
    ---
    text: varchar
    belongs_to_id: varchar [FK]
}
```

![](../assets/problem.png)

ここでは `Comment` テーブルに対して `belongs_to_id` カラムを持たせ、値として `Manga.id` や `Novel.id` を持たせることでそれぞれのリソースを紐づけている。


