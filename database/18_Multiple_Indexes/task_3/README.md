# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;3 クイズ](#3-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

> `first_name` が `Anneke`、`last_name` が `Preusig` の従業員の従業員ID、`first_name`、`last_name` を検索してください。
> また処理を高速化するために複合インデックスを作成してみましょう

<details>
<summary>回答例</summary>

作成したクエリは以下になる。

```sql
SELECT emp_no, first_name, last_name
FROM employees
WHERE first_name = 'Anneke'
AND last_name = 'Preusig';
```

高速化のために以下のインデックスを作成する。

```sql
CREATE INDEX fname_lname_idx ON employees (first_name, last_name);
CREATE INDEX lname_fname_idx ON employees (last_name, first_name);
```

このうちクエリを実行すると、`fname_lname_idx` を使用していることがわかる。
（なお `lname_fname_idx` の場合でもクエリコストは全く同じであった。）

```bash
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ref
possible_keys: fname_lname_idx,lname_fname_idx
          key: fname_lname_idx
      key_len: 124
          ref: const,const
         rows: 1
     filtered: 100.00
        Extra: Using index
```

|インデックスなし|fname_lname_idx|lname_fname_idx|
|:--:|:--:|:--:|
|0.0497|0.0003|0.0004|

</details>

## #2 クイズ

> 1980年1月1日以降に雇用された従業員のうち、`last_nane` に大文字と小文字を区別せずに `an` から始める、従業員の従業員ID、`last_name`。雇用日を検索してください
> また処理を高速化するために複合インデックスを作成してみましょう

<details>
<summary>回答例</summary>

作成したクエリは以下になる。

```sql
SELECT emp_no, last_name, hire_date
FROM employees
WHERE last_name LIKE 'an%'
AND hire_date >= '1980-01-01';
```

特徴的な点は MySQL では大文字と小文字の区別をつけない点である。

インデックスを作成するうえで、以下のパターンを試す。

```sql
-- 1
-- インデックスを使用しない
-- 2
CREATE INDEX hdate_lname_idx ON employees (hire_date, last_name);
-- 3
CREATE INDEX lname_hdate_idx ON employees (last_name, hire_date);
```

||インデックスなし|hdate_lname_idx|lname_hdate_idx|
|:--:|:--:|:--:|:--:|
|アクセスタイプ|フルテーブルスキャン|インデックスの範囲検索|インデックスの範囲検索|
|fetch行数見積|298990|149495|2897|
|実行時間|0.0501|0.0476|0.0015|

インデックスの順番には注意が必要である。

</details>

## #3 クイズ

> 1990年01月01日から1991年01月01日までの1年間で雇用された男性従業員の数を算出してみましょう
> また処理を高速化するために複合インデックスを作成してみましょう

<details>
<summary>回答例</summary>
</details>
