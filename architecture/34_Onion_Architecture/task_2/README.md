## 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Q1: オニオンアーキテクチャにおいて、トランザクション処理はどの層で設定するのがおすすめでしょうか](#q1-%E3%82%AA%E3%83%8B%E3%82%AA%E3%83%B3%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E3%81%AB%E3%81%8A%E3%81%84%E3%81%A6%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E5%87%A6%E7%90%86%E3%81%AF%E3%81%A9%E3%81%AE%E5%B1%A4%E3%81%A7%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8C%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [Q2: UseCase層からPresentation層にDTOを使ってデータを渡してJSONを返す場合、DTOとJSONの定義はどのレイヤーに配置すればいいでしょうか](#q2-usecase%E5%B1%A4%E3%81%8B%E3%82%89presentation%E5%B1%A4%E3%81%ABdto%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E6%B8%A1%E3%81%97%E3%81%A6json%E3%82%92%E8%BF%94%E3%81%99%E5%A0%B4%E5%90%88dto%E3%81%A8json%E3%81%AE%E5%AE%9A%E7%BE%A9%E3%81%AF%E3%81%A9%E3%81%AE%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%AB%E9%85%8D%E7%BD%AE%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [Q3: 書籍「ドメイン駆動設計_モデリング_実装ガイド」では、ユースケースクラスをどのような粒度で分割するのが良いとされているのでしょうか](#q3-%E6%9B%B8%E7%B1%8D%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88_%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0_%E5%AE%9F%E8%A3%85%E3%82%AC%E3%82%A4%E3%83%89%E3%81%A7%E3%81%AF%E3%83%A6%E3%83%BC%E3%82%B9%E3%82%B1%E3%83%BC%E3%82%B9%E3%82%AF%E3%83%A9%E3%82%B9%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E7%B2%92%E5%BA%A6%E3%81%A7%E5%88%86%E5%89%B2%E3%81%99%E3%82%8B%E3%81%AE%E3%81%8C%E8%89%AF%E3%81%84%E3%81%A8%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Q1: オニオンアーキテクチャにおいて、トランザクション処理はどの層で設定するのがおすすめでしょうか

<details>
<summary>回答例</summary>

Application層 (UseCase層)

</details>

## Q2: UseCase層からPresentation層にDTOを使ってデータを渡してJSONを返す場合、DTOとJSONの定義はどのレイヤーに配置すればいいでしょうか

<details>
<summary>回答例</summary>

- Presentation
  - JSONの定義を配置する
  - DTOの値をJSONに詰め替えてレスポンスを返す
- UseCase
  - DTOを定義

</details>

## Q3: 書籍「ドメイン駆動設計_モデリング_実装ガイド」では、ユースケースクラスをどのような粒度で分割するのが良いとされているのでしょうか

<details>
<summary>回答例</summary>

- 1クラスに1パブリックメソッド
- 共通処理がほしい場合は、プライベートメソッドではなく、その責務を負ったクラスに切り出すといい

</details>
