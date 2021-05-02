# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 制約の確認ができない](#%E8%AA%B2%E9%A1%8C1-%E5%88%B6%E7%B4%84%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定

学校の生徒に関する状態として「在学中」「卒業」「停学中」の3パターンが存在しており、以下のような制約によって表現している。

```sql
CREATE TABLE IF NOT EXISTS Student (
    student_id INT PRIMARY KEY,
    name VARCHAR(255),
    status VARCHAR(255),
    CONSTRAINT status_enum_chk 
        CHECK(status IN ('studying', 'graduated', 'suspended'))
) ENGINE=InnoDB;
```

データには以下を使用する。

```sql
INSERT INTO Student (student_id, name, status)
VALUES
    (1, 'John', 'studying'),
    (2, 'Mike', 'graduated'),
    (3, 'Lisa', 'suspended');
```

### 課題1 制約の確認ができない

例えばアプリケーションの画面上で各生徒の `status` 状況を表示したり、値を変更する際には指定可能な値の一覧を選択肢として表示する場合を考える。

このとき、選択肢をテーブルから抽出するためには、`CHECK` 制約からテーブル作成時に指定した内容を抽出し、得られた文字列をパースする必要が発生する。

具体的には以下のクエリを実行して得られる文字列から選択肢を抽出する必要が発生する。

```bash
mysql> SELECT * FROM information_schema.check_constraints;
+-------------------------------------------------------------------------------+
| CHECK_CLAUSE                                                                  |
+-------------------------------------------------------------------------------+
| (`status` in (_latin1\'studying\',_latin1\'graduated\',_latin1\'suspended\')) |
+-------------------------------------------------------------------------------+
```

