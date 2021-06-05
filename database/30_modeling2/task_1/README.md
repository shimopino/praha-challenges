# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [チャットサービスのモデリング](#%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## チャットサービスのモデリング

仕様の詳細は [airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recCDmAj926oLfOde?blocks=hide) を確認する。

- 下記の案はスレッドメッセージとメッセージを同じテーブルで扱い、紐づけを閉包テーブルで行うモデルである。
  - スレッドメッセージとメッセージには、1階層しかないので隣接テーブルでも十分対応できそう
- スレッドメッセージとメッセージの識別は、`Channel_Thread_Message` の `is_thread` で行う

![](../assets/chat-v1.png)

- 懸念点
  - ワークスペースとチャンネルの紐づけ
    - 上記のモデルでは、チャンネルは1つのワークスペースに紐づくという前提のもと設計している
    - そのため、複数の企業ワークスペースの共同チャンネルのような仕様を満たすことができない
  - ユーザーの退会
    - 上記のモデルでは、ユーザーがチャンネルやワークスペースから退会した際に、物理削除する想定である
    - この場合、休会などの他のステータスや、復活する仕様を満たすことができない

参考資料

- [イミュータブルデータモデル(入門編)](https://www.slideshare.net/kawasima/ss-40471672)
- [イミュータブルデータモデル](https://scrapbox.io/kawasima/%E3%82%A4%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%96%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%A2%E3%83%87%E3%83%AB)
- [チャットアプリの実例でDynamoDBのモデリングを考えてみる](https://zenn.dev/dove/scraps/576858405f1411)
