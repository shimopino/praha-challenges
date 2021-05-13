# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 NULLが入り込む設計となる](#%E8%AA%B2%E9%A1%8C1-null%E3%81%8C%E5%85%A5%E3%82%8A%E8%BE%BC%E3%82%80%E8%A8%AD%E8%A8%88%E3%81%A8%E3%81%AA%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定

課題の詳細は [airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recs0SLG3aI2wTeWi?blocks=hide) を確認する。

以下のスキーマ設計でどのような問題が生じるのか検証する。

```sql
CREATE TABLE IF NOT EXISTS Contract (
    new_conster_id INT PRIMARY KEY,
    telephone BOOLEAN,  -- 電話を掛けたらTRUE
    metOnce BOOLEAN,    -- アポで面談したらTRUE
    metAt DATE,         -- アポで面談した日付
    chosed BOOLEAN,     -- 成約したらTRUE
    chosedAt DATE       -- 成約した日付
) ENGINE=InnoDB;
```

### 課題1 


