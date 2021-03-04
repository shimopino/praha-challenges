# 環境構築手順

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [ESLint](#eslint)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ESLint

`create-react-app` を使用する場合、独自に ESLint が組み込まれている。

しかし、カスタマイズ性に乏しいため、改めて ESLint の環境を構築する。

- [[typescript-eslint] Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md#configuration)

```bash
yarn add -D @typescript-eslint/{parser,eslint-plugin}
```

Airbnb のスタイルチェックを採用する。

```bash
yarn add -D eslint-config-airbnb-typescript
```

次に上記のパッケージが依存しているプラグインをインストールする。

```bash
yarn add -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

Prettier をインストールする

```bash
yarn add -D prettier eslint-config-prettier
```
