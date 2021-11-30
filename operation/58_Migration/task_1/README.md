# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Expand and Contract Pattern](#expand-and-contract-pattern)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Expand and Contract Pattern

開発を進めていく中で、データ自体を新しいフォーマットに変換したり、異なるテーブルにカラムを移したりなどの変更を加える場面が存在する。

**Expand and Contract Pattern** というマルチステップのプロセスを採用すれば、開発者はシステムの稼働時間に影響を与えることなく、古いデータ構造から新しいデータ構造へとデータを移行することができる様になる。

これは新しい変更をバックグラウンドで導入し、実際に使用するためのデータを準備した後で、新しい構造にシームレスに切り替えることができる様に設計された、一連の個別ステップを適用することが実現することができる。

### Step 1: 新しいスキーマをデプロイする

まずは新しい要件を満たす、新しいスキーマを設計する。これは例えば以下の様なものである。

- 現在のカラムをそのままにして、必要となる特性を追加した新しいカラムをテーブルに追加する
- 新しいデータ構造を表す、新しいテーブルを作成する

![](assets/step1.drawio.svg)

## 参考資料

- [Using the expand and contract pattern for schema changes](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)
- [Migration troubleshooting in production](https://www.prisma.io/docs/guides/database/production-troubleshooting)
