# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [ログレベル](#%E3%83%AD%E3%82%B0%E3%83%AC%E3%83%99%E3%83%AB)
- [ログ出力のタイミング](#%E3%83%AD%E3%82%B0%E5%87%BA%E5%8A%9B%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%9F%E3%83%B3%E3%82%B0)
- [ログメッセージ](#%E3%83%AD%E3%82%B0%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8)
- [アクセスログ](#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%AD%E3%82%B0)
- [アプリケーションログ](#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%AD%E3%82%B0)
- [エラーログ](#%E3%82%A8%E3%83%A9%E3%83%BC%E3%83%AD%E3%82%B0)
- [ユーザーログ](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%AD%E3%82%B0)
- [クエリログ](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%AD%E3%82%B0)
- [ログローテーション](#%E3%83%AD%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%86%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ログレベル

Node.js で多くダウンロードされている [winston]I(https://github.com/winstonjs/winston) を参考にログレベルを見ていく。

このライブラリでは、ログレベルを RFC5424 で規定されている重要度の順序に従う形式が採用されている。具体的には、以下の様に重要なものが高いものであればあるほど、対応する整数の値が低くなっていることがわかる。

```js
{
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}
```

それぞれのレベルの概要は以下になる。

## ログ出力のタイミング

## ログメッセージ

## アクセスログ

## アプリケーションログ

## エラーログ

## ユーザーログ

## クエリログ

## ログローテーション