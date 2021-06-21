# 任意課題

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [凝集度](#%E5%87%9D%E9%9B%86%E5%BA%A6)
  - [1. 機能的凝集](#1-%E6%A9%9F%E8%83%BD%E7%9A%84%E5%87%9D%E9%9B%86)
  - [2. 逐次的凝集](#2-%E9%80%90%E6%AC%A1%E7%9A%84%E5%87%9D%E9%9B%86)
  - [3. 通信的凝集](#3-%E9%80%9A%E4%BF%A1%E7%9A%84%E5%87%9D%E9%9B%86)
  - [4. 手順的凝集](#4-%E6%89%8B%E9%A0%86%E7%9A%84%E5%87%9D%E9%9B%86)
  - [5. 時間的凝集](#5-%E6%99%82%E9%96%93%E7%9A%84%E5%87%9D%E9%9B%86)
  - [6. 論理的凝集](#6-%E8%AB%96%E7%90%86%E7%9A%84%E5%87%9D%E9%9B%86)
  - [7. 偶発的凝集](#7-%E5%81%B6%E7%99%BA%E7%9A%84%E5%87%9D%E9%9B%86)
- [結合度](#%E7%B5%90%E5%90%88%E5%BA%A6)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 凝集度

凝集度は、コードがどれだけそのモジュール (クラスや関数) の責任分担に集中しているのかをあらわす尺度であり、SOLID原則のうち、単一責任の原則とも関係している。

凝集度が高いモジュールは、堅牢性・信頼性・再利用性・可読性などの点で好ましく、常に凝集度の高いモジュールを設計できるように、知識や経験を身に着けておくべきである。

凝集度は、高いほど良いとされている順序尺度であり、以下の順番にしたがって凝集度は高くなっている。

1. 機能的凝集
2. 逐次的凝集
3. 通信的凝集
4. 手順的凝集
5. 時間的凝集
6. 論理的凝集
7. 偶発的凝集

### 1. 機能的凝集

単一の機能のみを提供するモジュールである。

例えば以下は引数でプリミティブ型を受け取り、引数同士の掛け算を行っているだけの単純なモジュールである。

```typescript
/**
 * 引数で与えられた税抜き価格と税率から、税込み価格を計算する
 * 
 * @param {number} price - 税抜き価格
 * @param {number} taxrate - 税率
 */
function calculateTaxPrice(
  price: number,
  taxrate: number
): number {
  return price * taxrate;
}
```

### 2. 逐次的凝集


### 3. 通信的凝集


### 4. 手順的凝集


### 5. 時間的凝集


### 6. 論理的凝集


### 7. 偶発的凝集

## 結合度


内部結合
共通結合
外部結合
制御結合
スタンプ結合
データ結合
メッセージ結合

## 参考資料

- [ オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling](https://speakerdeck.com/sonatard/coheision-coupling)
- [良いコードとは何か - エンジニア新卒研修 スライド公開](https://speakerdeck.com/moriatsushi/liang-ikodotohahe-ka-enziniaxin-zu-yan-xiu-suraidogong-kai)
