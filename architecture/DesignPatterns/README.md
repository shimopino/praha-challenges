<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [デザインパターン](#%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)
  - [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# デザインパターン

## 環境構築

```bash
# プロジェクトの初期化
npm init -y

# 必要なライブラリのインストール
npm install --save-dev typescript ts-node @types/node

# tsconfig.jsonの初期化
npx tsc --init

# テストに必要なライブラリのインストール
npm install --save-dev jest ts-jest @types/jest

# jest.config.jsの初期化
npx ts-jest config:init
```
