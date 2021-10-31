# 再現プロジェクト

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境設定](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 環境設定

### Next.js

```bash
# Next.js アプリケーション (v12) の初期化
npx create-next-app@latest --typescript

# アプリけーションの起動
yarn dev

# CSS のクラス名管理
yarn add clsx

# Sass
# https://nextjs.org/docs/basic-features/built-in-css-support#sass-support
yarn add sass

# CSS クラス名の推論ライブラリ
yarn add -D typescript-plugin-css-modules

# Prettier 設定
yarn add --dev prettier eslint-config-prettier

# パッケージの読み込み順をアルファベット順に並び替える
yarn add --dev eslint-plugin-import

# 不要なパッケージを削除する
yarn add --dev eslint-plugin-unused-imports
```

### Storybook

```bash
# Storybook の導入
npx sb init

# Storybookの起動
yarn storybook

# sass の読み込み問題のため、バージョンを固定しておく
yarn add -D sass-loader@^10.0.0
```

参考資料

- [Next.js+CSSModules(Saas)+Storybook のセットアップ](https://zenn.dev/thim/articles/7c8ceba730dad35d27dc)

## スタイル周りのメモ

参考資料

- [ダークモードにも柔軟に対応できる CSS&Sass 変数のカラー設定方法](https://higemura.com/blog/programming/dark-mode-css-variables-01)

## デザインシステム

参考になるデザインシステムをまとめておく。

- [Polaris](https://polaris.shopify.com/)
- [React Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)
- [Primer React](https://primer.style/react/)
- [Primer CSS](https://primer.style/css/)
