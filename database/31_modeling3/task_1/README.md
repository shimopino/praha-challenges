# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [モデリング](#%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## モデリング

仕様の詳細は [airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recQgEc0Z8Ic0AzLQ?blocks=hide) を参照する。

![](../assets/docs.png)

- 感想
  - 懸念事項
    - 現在の設計では、文書が削除された際に `文書ステータス` を変更する
    - これは文書に対する変更を追跡することができない
  - 改善案
    - イミュータブルデータモデルを採用し、文書とドキュメントに対するCRUD操作をイベントエンティティとして切り出す