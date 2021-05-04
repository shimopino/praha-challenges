# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

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


