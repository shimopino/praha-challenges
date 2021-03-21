# 課題14「E2Eテストを書こう」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [Q: 交互にマスを選択して片方のプレイヤーが勝利した状態を再現してみましょう](#q-%E4%BA%A4%E4%BA%92%E3%81%AB%E3%83%9E%E3%82%B9%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%97%E3%81%A6%E7%89%87%E6%96%B9%E3%81%AE%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%8C%E5%8B%9D%E5%88%A9%E3%81%97%E3%81%9F%E7%8A%B6%E6%85%8B%E3%82%92%E5%86%8D%E7%8F%BE%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [Q: 引き分けの時は「Draw!」と表示してみましょう](#q-%E5%BC%95%E3%81%8D%E5%88%86%E3%81%91%E3%81%AE%E6%99%82%E3%81%AFdraw%E3%81%A8%E8%A1%A8%E7%A4%BA%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [Q: 交互にマスを選択して引き分けの時は「Draw!」と表示させてみましょう](#q-%E4%BA%A4%E4%BA%92%E3%81%AB%E3%83%9E%E3%82%B9%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%97%E3%81%A6%E5%BC%95%E3%81%8D%E5%88%86%E3%81%91%E3%81%AE%E6%99%82%E3%81%AFdraw%E3%81%A8%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

課題は [こちら](https://github.com/KeisukeShimokawa/react-tutorial-typescript) に実装しています。

### Q: 交互にマスを選択して片方のプレイヤーが勝利した状態を再現してみましょう

### Q: 引き分けの時は「Draw!」と表示してみましょう

### Q: 交互にマスを選択して引き分けの時は「Draw!」と表示させてみましょう

## 課題2

Kent.C DoddsさんやMartin Fowlerさんが単体テストや結合テストに関して、テストピラミッドという考え方を提供している。

![](https://martinfowler.com/articles/practical-test-pyramid/testPyramid.png)

> Figure.2 The Test Pyramid

こういた考えをまとめると以下のように分類できそうである。

|                    | 単体テスト | 結合テスト | E2E | 
| ------------------ | ---------- | ---------- | --- | 
| 実行速度           | O          | ▲         | X   | 
| 実サービスへの近さ | X          | ▲         | O   | 
| 修正コスト         | O          | ▲         | X   | 

## 課題3

今回の課題ではコンポーネントに対してカスタム属性を `data-e2e` という名称で設定している。

ではなぜこのようにカスタム属性を設定する必要があったのでしょうか。ボタンクラスを一律で取得するような処理ではダメだったのでしょうか。ß

<details>
<summary>回答例</summary>

- [Selecting Element](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)

</details>

## 参考資料

- [フロントのテスト戦略！の知見が集まるところ](https://zenn.dev/seya/scraps/6f930e359d6a7c)
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Learn the smart, efficient way to test any JavaScript application.](https://testingjavascript.com/)