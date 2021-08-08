<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境構築手順](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E6%89%8B%E9%A0%86)
  - [プロジェクトのセットアップ](#%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
    - [使用するライブラリのインストール](#%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 環境構築手順

## プロジェクトのセットアップ

### 使用するライブラリのインストール

```bash
# nestのインストール
npm install -g @nestjs/cli

# DBモデリングのプロジェクトを作成
nest new dbmodeling1

# prismaのインストール
npm install --save-dev prisma

# PrismaClientのインストール
npm install @prisma/client

#  環境変数を切り替える dotenv-cli をインストール
# https://www.prisma.io/docs/concepts/more/environment-variables/using-multiple-env-files
npm install --save-dev dotenv-cli
```
