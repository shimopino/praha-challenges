# 課題 １

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [プルリクエストの大きさはどの程度が良いのか](#%E3%83%97%E3%83%AB%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%AE%E5%A4%A7%E3%81%8D%E3%81%95%E3%81%AF%E3%81%A9%E3%81%AE%E7%A8%8B%E5%BA%A6%E3%81%8C%E8%89%AF%E3%81%84%E3%81%AE%E3%81%8B)
- [コードのコメントにはどのような内容を記載するべきでしょうか](#%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%86%85%E5%AE%B9%E3%82%92%E8%A8%98%E8%BC%89%E3%81%99%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [コミットメッセージにはどのような内容を記載するべきでしょうか](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%86%85%E5%AE%B9%E3%82%92%E8%A8%98%E8%BC%89%E3%81%99%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## プルリクエストの大きさはどの程度が良いのか

プルリクエストのサイズを小さくしておくことは、レビュワーとレビュイーの双方にとって利点がある。

- レビュイー
  - 作業の無駄を少なくできる
  - 容易にマージすることができる
- レビュワー
  - より短い時間でレビューを実施できる
  - ミスを見落とす可能性が小さい

しかしながら、何が小さいのかという基準には特にルールはない。

重要なことは、小さなプルリクとは単純な差分の総量ではなく凝集度の高さである。変更対象がただ 1 つの理由によるものに制限しておけば、自然とちいさなプルリクを達成することができるはずである。

また、小さくするためにテストコードを分離するようなことはしてはいけない。テストコードには対象物がどのように振る舞うべきなのかを表す期待が含まれており、レビュワーが対象物を検証できるようにするにはプルリクにテストコードも含めておく必要がある。

小さなプルリクを実現するための 1 つのテクニックは、動作を変えないリファクタリングと、動作が変わる機能の変更と、異なるプルリクとして扱うことである。

参考資料

- [小さな CL](https://shuuji3.xyz/eng-practices/review/developer/small-cls.html)

https://twitter.com/t_wada/status/1281496033839550468?s=20

## コードのコメントにはどのような内容を記載するべきでしょうか

コードのコメントは、自身も含めた将来的にそのコードを読む開発者が理解しやすいものであるべきである。

その際に注意すべき点は、コードが何をしているのか (What) を表すコメントよりも、コードを読んだだけでは理解できないであろう理由 (Why) を記述した方が良いよいうことである。

例えば以下のようなコメントである。

```js
// 計算コストが高いため、最初のみ計算を実施する
const result = // ...
```

反対に以下のようなコメントは良いコメントとは言えない。

```js
// 価格から割引分を引き算する
const finalPrice = numItems * itemPrice \
    - min(5, numItems) * itemPrice * 0.1;
```

このようなコメントはリファクタリングを行う機械であり、以下のように改善することができる。

```js
const price = numItems * itemPrice;
const discount = min(5, numItems) * itemPrice * 0.1;
const finalPrice = price - discount;
```

参考資料

- [Code Health: To Comment or Not to Comment?](https://testing.googleblog.com/2017/07/code-health-to-comment-or-not-to-comment.html)
- [https://twitter.com/t_wada/status/904916106153828352?s=20](https://twitter.com/t_wada/status/904916106153828352?s=20)
- [リーダブルコード 第 5 章](https://www.amazon.co.jp/dp/4873115655/)

## コミットメッセージにはどのような内容を記載するべきでしょうか

コードの変更をコミットする際には、コードの差分を見れば「コードをどのように (What) 変更したのか」はすぐに理解することができる。

そのためコミットメッセージには、「コードをなぜ (Why) 変更したのか」を残しておくことで、将来の自信も含めて他の開発者がコミット履歴を見てもその作業を理解できるようにしておくことが重要である。

人間にとっても機械にとってもわかりやすいコミット履歴を作成するために、**Conventional Commits** という軽量の規約が提供されており、以下のような形式でコミットメッセージを記述することがルールとなっている。

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

ここでの `type` とはコミットの大まかな内容を示すプレフィックスであり、セマンティックバージョニングと対応する形式となっている。

```bash
X. X. X
│  │  └ fix type: バグのパッチ
│  └─── feat type: 新しい機能の追加
└────── BREAKING CHANGE type: APIの破壊的変更の導入
```

この規約に従うことで、自動化ツールの導入が可能となり、例えば以下のことが可能となる。

- 変更履歴の自動生成
- セマンティックバージョン単位での履歴の自動まとめ
- 変更内容の通知
- ビルドや公開処理をトリガー

実際に Angular では以下のようなコミットメッセージを記述している。

```bash
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

参考資料

- [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)
- [Angular Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)
- [いいコミットメッセージの共通点と書き方〜便利なテンプレートやチーム開発時のお作法まで詳しく解説〜 ](https://www.praha-inc.com/lab/posts/commit-message)
