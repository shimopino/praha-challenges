# 課題15「TDD（テスト駆動開発）でコードを書いてみる」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [TDDのメリットとデメリットは何か](#tdd%E3%81%AE%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88%E3%81%A8%E3%83%87%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88%E3%81%AF%E4%BD%95%E3%81%8B)
  - [三点測量とは何か](#%E4%B8%89%E7%82%B9%E6%B8%AC%E9%87%8F%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [レッド・クリーン・リファクタリングとは何か](#%E3%83%AC%E3%83%83%E3%83%89%E3%83%BB%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%83%BB%E3%83%AA%E3%83%95%E3%82%A1%E3%82%AF%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [仮実装](#%E4%BB%AE%E5%AE%9F%E8%A3%85)
- [課題2](#%E8%AA%B2%E9%A1%8C2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

### TDDのメリットとデメリットは何か

### 三点測量とは何か

### レッド・クリーン・リファクタリングとは何か

### 仮実装

## 課題2

以下の仕様を満たすスクリプトを、TDDで開発してみましょう。

作成するメソッド

- `multiply`
- `add`
- `subtract`
- `divide`

処理の注意点

- 引数は1個から30個まで（31個以上の引数を渡すとエラー）
- 引数が数字以外だとエラー
- 足し算の結果が1000を超える場合は「too big」を返す
- 引き算の結果がマイナスの場合は「negative number」を返す
- 掛け算の結果が1000を超える場合は「too big」を返す
- 割算の結果が小数点何桁まで許容するのかは各自で決める


