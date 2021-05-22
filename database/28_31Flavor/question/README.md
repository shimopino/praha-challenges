# 疑問点

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Q1 生徒のステータスに関して](#q1-%E7%94%9F%E5%BE%92%E3%81%AE%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Q1 生徒のステータスに関して

生徒のステータスを考えた場合、「在学中」と「卒業」は排他的な関係にあるので、生徒テーブルにカラムを設ける場合でもいいのではないか。

![](../assets/question-1.png)

この際に生徒のステータスとして「停学中」は交差テーブルを導入することで、1人の生徒に対して「在学中」と「停学中」を共存させたほうがいいのではないかと思いました。

そうしていない場合、例えば教員がWeb画面で在学中の生徒の一覧を表示する際に、「停学中」の生徒は表示されないのではないかと思いました。

![](../assets/question-2.png)
