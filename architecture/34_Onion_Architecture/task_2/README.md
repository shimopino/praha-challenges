## 課題2

<!-- START doctoc -->
<!-- END doctoc -->

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
