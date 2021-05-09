# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 ｌ](#%E8%AA%B2%E9%A1%8C1-%EF%BD%8C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定




以下の物理設計で検証を実施する。

```sql
CREATE TABLE IF NOT EXISTS NewCustomer (
    new_conster_id INT PRIMARY KEY,
    telephone BOOLEAN,  -- 電話を掛けたらTRUE
    metOnce BOOLEAN,    -- アポで面談したらTRUE
    metAt DATE,         -- アポで面談した日付
    chosed BOOLEAN,     -- 成約したらTRUE
    chosedAt DATE       -- 成約した日付
) ENGINE=InnoDB;
```

### 課題1 ｌ


