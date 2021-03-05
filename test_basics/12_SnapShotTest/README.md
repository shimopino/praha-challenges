# 課題12「スナップショットテストを書こう」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [Q: スナップショットテストとは何でしょうか](#q-%E3%82%B9%E3%83%8A%E3%83%83%E3%83%97%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q: スナップショットテストで防止できる不具合とは何か](#q-%E3%82%B9%E3%83%8A%E3%83%83%E3%83%97%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88%E3%81%A7%E9%98%B2%E6%AD%A2%E3%81%A7%E3%81%8D%E3%82%8B%E4%B8%8D%E5%85%B7%E5%90%88%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [Q: スナップショットテストで防止できない不具合とは何か](#q-%E3%82%B9%E3%83%8A%E3%83%83%E3%83%97%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88%E3%81%A7%E9%98%B2%E6%AD%A2%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84%E4%B8%8D%E5%85%B7%E5%90%88%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [Q: なぜ Jest でスナップショットテストが導入されたのでしょうか](#q-%E3%81%AA%E3%81%9C-jest-%E3%81%A7%E3%82%B9%E3%83%8A%E3%83%83%E3%83%97%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88%E3%81%8C%E5%B0%8E%E5%85%A5%E3%81%95%E3%82%8C%E3%81%9F%E3%81%AE%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q: スナップショットテストを実施する上での注意点は何か](#q-%E3%82%B9%E3%83%8A%E3%83%83%E3%83%97%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%86%E3%82%B9%E3%83%88%E3%82%92%E5%AE%9F%E6%96%BD%E3%81%99%E3%82%8B%E4%B8%8A%E3%81%A7%E3%81%AE%E6%B3%A8%E6%84%8F%E7%82%B9%E3%81%AF%E4%BD%95%E3%81%8B)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
  - [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [&#035;3 クイズ](#3-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

なお課題で提示されていた問い以外にも回答している。

### Q: スナップショットテストとは何でしょうか

- UIが予期せず変更されていないか確かめることが可能なテストである
  - 正しい状態のUIをスナップショットとして保存する
  - ソースに変更を加えた際に新たなスナップショットを保存し、正しい状態と差異があるとテストが失敗する

`Jest` を使用して居る場合には、以下のように `React` コンポーネントをシリアライズしてテスト用のレンダラーを利用してスナップショットを作成する。

```js
import React from "react";
import renderer from "react-test-renderer";
import Link from "../Link.react";

it('renders correctly', () => {
  const tree = renderer
    .create(<Link page="http://www.facebook.com">Facebook</Link>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

これで以下のようなレンダリングされたHTMLがスナップショットとして保存される。

```js
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

これでコードに変更が加えられた際には、新たにスナップショットを作成し比較を行うことで変更が加えられたことを検知することが可能である。

例えば以下のような出力結果が得られるはずである。

![](https://jestjs.io/img/content/failedSnapshotTest.png)

もしも新たに得られたスナップショットを正しい状態として保存したい場合は以下のようにテストを実行すればいい。

```bash
jest --updateSnapshot
```

参考情報

- [[Jest] SnapShot Testing](https://jestjs.io/docs/ja/snapshot-testing)
- [フロントのテスト戦略！の知見が集まるところ](https://zenn.dev/seya/scraps/6f930e359d6a7c)
- [React テスト応用、テストに悩む人へ](https://zenn.dev/tkdn/books/react-testing-patterns)
- [フロントエンド（React Testing Library）で TDD（テスト駆動開発）をする](https://zenn.dev/higa/articles/34439dc279c55dd2ab95)
- [スナップショットテスト実戦投入 / Practical Snapshot Testing](https://speakerdeck.com/imaizume/practical-snapshot-testing)
- [[Kent C. Dodds] The Testing Garden of Kent C. Dodds](https://kentcdodds.com/testing/)
- [[Kent C. Dodds] Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing?source=userActivityShare-7aad912c550f-1516512013)

### Q: スナップショットテストで防止できる不具合とは何か

スナップショットテストを採用することで以下の課題を解決することができる。

- コンポーネントをレンダリングされた際に出力されるHTMLに、意図しない変更が加えられていないかどうか確認できる
- CLIツールがコマンドラインに出力するメッセージが正しいかどうか確認できる
- CSS-in-JS で正しくスタイルが設定されているか確認できる

### Q: スナップショットテストで防止できない不具合とは何か

- テストの実行タイミングに依存する機能
  - 現在時刻などを使用する機能では、テストタイミングで出力結果が異なってしまう
  - 時刻を取得するための　Test Double を導入すれば解決可能である
- 防止できない不具合というわけではないが、防止が難しくなるのはスナップショットが巨大になる機能
  - 数百行のスナップショットが生成される場合、その差異を黙示することは難しい
- 外部パッケージに依存している機能
  - 例えば最近流行りの機械学習のAPIを使用する機能を開発した場合、学習モデルの更新状況によっては同じクエリを送信しても結果が変動する可能性がある。
  - こういう場合は適した Mock Object を作る必要がある

### Q: なぜ Jest でスナップショットテストが導入されたのでしょうか

スナップショットテストでのE2Eテストで以下を解決するために導入された。

- テストの実行の簡易化
  - UI の確認のためにブラウザを立ち上げたり、モバイル端末向けにビルドする必要がない
- 試行錯誤の速度向上
  - 他のE2Eフレームワークと異なり、実行速度が速く試行錯誤の回転数を向上できる
- デバッグ
  - 生成されるスナップショットを確認すれば、生成結果のデバッグが簡単にできる

参考情報

- [[Jest] Why snapshot testing?](https://jestjs.io/blog/2016/07/27/jest-14.html#why-snapshot-testing)

### Q: スナップショットテストを実施する上での注意点は何か

- スナップショットファイルは、正しい期待値であることを確認してからリモートにプッシュしましょう

## 課題2

公式 [Snapshot testing with Storybook](https://storybook.js.org/docs/react/workflows/snapshot-testing) に倣ってスナップショットテストを追加する。

参考情報

- [@storybook/addon-storyshots](https://www.npmjs.com/package/@storybook/addon-storyshots)

## 課題3

### #1 クイズ

<details>
<summary>回答例</summary>
</details>

### #2 クイズ

<details>
<summary>回答例</summary>
</details>

### #3 クイズ

<details>
<summary>回答例</summary>
</details>