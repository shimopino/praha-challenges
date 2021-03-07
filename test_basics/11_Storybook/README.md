# 課題 11「Storybook を作ろう」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題 1](#%E8%AA%B2%E9%A1%8C-1)
- [課題 2](#%E8%AA%B2%E9%A1%8C-2)
- [課題 3](#%E8%AA%B2%E9%A1%8C-3)
- [課題 4 クイズ](#%E8%AA%B2%E9%A1%8C-4-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [&#035;3 クイズ](#3-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題 1

実装しているロジック自体は、React で提供されている[公式のチュートリアル](https://ja.reactjs.org/tutorial/tutorial.html)に従っているが、TypeScript での実装を採用している。

また今回は `create-react-app`を使用することなく、スクラッチから環境構築を実践しており、その詳細は [ENVIRONMENT.md](./ENVIRONMENT.md) に記載している。

また公式のチュートリアルでは Storybook でのコンポーネントライブラリを構築することが難しい（Game コンポーネントのカスタムが難しい）ため、参考情報に載せている記事をベースにリファクタリングを行っている。

リファクタリングの過程は [RIFACTORING.md](./RIFACTORING.md) に記載している。

参考情報

- [React Hooks とカスタムフックが実現する世界 - ロジックの分離と再利用性の向上](https://qiita.com/sonatard/items/617f324228f75b9c802f)

## 課題 2

○× ゲームの起動

```bash
yarn run dev
```

storybook の起動

```bash
yarn storybook
```

## 課題 3

- メリット
  1. アプリケーション全体が完成していない状態でも、コンポーネント単位でデザイナーと認識をすり合わせることができる
  2. 開発中に行った変更がどのようにコンポーネントの UI に影響するのか確認することができる
  3. 一覧化することで他のプロジェクトで再利用したいコンポーネントを簡単に選ぶことができる
- デメリット
  1. Storybook の設定や Story の追加など、別途開発工数が要求される
  2. 複雑なことをしたい場合は都度アドオンが必要になってしまい学習コストが高い
  3. （デメリットではないが）小規模開発や個人開発ではわざわざコンポーネントを管理する必要はない

> 疑問: Storybook を起動するサーバをどのように運用しているのか

参考情報

- [Storybook がなぜ必要か？(Vue.js 編)](https://qiita.com/masaakikunsan/items/dad8d84807918f3a43cb)
- [UI 開発の流れが変わる！React Storybook でデザイナーも開発者も幸せになれる](https://www.webprofessional.jp/react-storybook-develop-beautiful-user-interfaces-with-ease/)

## 課題 4 クイズ

### #1 クイズ

React の公式チュートリアルで提供されている実装コードは、なぜ Storybook で管理することが難しいのでしょうか

<details>
<summary>回答例</summary>

- Reactの公式チュートリアルでは、全てのコンポーネントが `index.ts` で定義されてしまっており、再利用性の低い設計になってしまっている
- また Board コンポーネントや Game コンポーネントは、親コンポーネントから Props を受け取ったりはしておらず、それぞれのコンポーネントで状態管理をしてしまっている。
  - 状態管理している場合、Storybookではコンポーネントの状態を編集することが難しい

</details>

### #2 クイズ

Storybook では `Args` を使用してコンポーネントに引数を渡すことができる。

では以下の 2 パターンの `Args` の定義方法の違いは何でしょうか

- パターン 1

  ```js
  // Button.stories.tsx
  import React from 'react';
  import { Story } from '@storybook/react';

  const Template: Story<ButtonProps> = (args) => <Button {...args} />;

  export const Primary = Template.bind({});
  Primary.args = {
    primary: true,
    label: 'Primary',
  };
  ```

- パターン 2

  ```js
  // Button.stories.tsx
  import React from 'react';
  import { Story, Meta } from '@storybook/react';
  import Button from './Button';

  export default {
    title: 'Button',
    component: Button,
    args: {
      primary: true,
      label: 'Primary',
    },
  } as Meta;
  ```

<details>
<summary>回答例</summary>
</details>

### #3 クイズ

Storybook で UI がレスポンシブ対応になっているかどうか確認するにはどうすればいいでしょうか

<details>
<summary>ヒント</summary>

[[Storybook] Viewport](https://storybook.js.org/docs/react/essentials/viewport)

</details>

<details>
<summary>回答例</summary>
</details>
