# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [チャットサービスのモデリング](#%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
- [物理設計](#%E7%89%A9%E7%90%86%E8%A8%AD%E8%A8%88)
- [サンプルデータ](#%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF)
- [要件](#%E8%A6%81%E4%BB%B6)
  - [ユーザーはチャンネルにメッセージを投稿できる](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AF%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E3%81%AB%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E6%8A%95%E7%A8%BF%E3%81%A7%E3%81%8D%E3%82%8B)
  - [スレッドメッセージに対してメッセージを投稿できる](#%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%AB%E5%AF%BE%E3%81%97%E3%81%A6%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E6%8A%95%E7%A8%BF%E3%81%A7%E3%81%8D%E3%82%8B)
  - [ユーザーは所属しているチャンネル内のメッセージしか見れない](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AF%E6%89%80%E5%B1%9E%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E5%86%85%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%97%E3%81%8B%E8%A6%8B%E3%82%8C%E3%81%AA%E3%81%84)
  - [ユーザーはワークスペースやチャンネルに参加・脱退できる](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AF%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%82%84%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E3%81%AB%E5%8F%82%E5%8A%A0%E3%83%BB%E8%84%B1%E9%80%80%E3%81%A7%E3%81%8D%E3%82%8B)
  - [メッセージとスレッドメッセージを横断的に検索できる](#%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%A8%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E6%A8%AA%E6%96%AD%E7%9A%84%E3%81%AB%E6%A4%9C%E7%B4%A2%E3%81%A7%E3%81%8D%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## チャットサービスのモデリング

仕様の詳細は [airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recCDmAj926oLfOde?blocks=hide) を確認する。

![](../assets/chat.png)

参考資料

- [イミュータブルデータモデル(入門編)](https://www.slideshare.net/kawasima/ss-40471672)
- [イミュータブルデータモデル](https://scrapbox.io/kawasima/%E3%82%A4%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%96%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%A2%E3%83%87%E3%83%AB)
- [チャットアプリの実例でDynamoDBのモデリングを考えてみる](https://zenn.dev/dove/scraps/576858405f1411)
