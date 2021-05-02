# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

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
mysql> SELECT CONSTRAINT_NAME, CHECK_CLAUSE FROM information_schema.check_constrai
nts;
+-----------------+---------------------------------------------------------------------------------------------------+
| CONSTRAINT_NAME | CHECK_CLAUSE                                                                                      |
+-----------------+---------------------------------------------------------------------------------------------------+
| status_enum_chk | (`status` in (_latin1\'studying\',_latin1\'graduated\',_latin1\'suspended\',_latin1\'transfer\')) |
+-----------------+---------------------------------------------------------------------------------------------------+
```

### 課題2 制約の変更が難しい

例えば生徒のステータスに新しく「転校」( `trasferred` )を追加しようとすると、すでにカラムに設定されている制約を変更する必要がある。

```sql
-- まずは制約を削除する必要がある
ALTER TABLE Student DROP CONSTRAINT status_enum_chk;

-- 新たにカラムに制約を追加する
ALTER TABLE Student ADD CONSTRAINT status_enum_chk
    CHECK (status IN ('studying', 'graduated', 'suspended', 'trasferred'));
```

このようにテーブル定義を変更しなければ、以下のデータを挿入することはできない。

```sql
INSERT INTO Student (student_id, name, status)
VALUES (4, 'Keisuke', 'trasferred');
```

このようにテーブル定義自体を変更する必要があるため、稼働中のサービスに影響を与えてしまう可能性が存在する。

またこのようにしてテーブル定義を変更する場合、もしも既存の制約に存在している値を削除することが難しくなってしまい、以下のように制約から `suspended` を削除することができない。

例えば以下のデータが存在しているとする。

```sql
SELECT * FROM Student;
+------------+---------+------------+
| student_id | name    | status     |
+------------+---------+------------+
|          1 | John    | studying   |
|          2 | Mike    | graduated  |
|          3 | Lisa    | suspended  |
|          4 | Keisuke | trasferred |
+------------+---------+------------+
```

このときに以下の手順でテーブル定義を変更しようとするとエラーが発生する。

```sql
-- まずは制約を削除する必要がある
ALTER TABLE Student DROP CONSTRAINT status_enum_chk;

-- 新たにカラムに制約を追加する
ALTER TABLE Student ADD CONSTRAINT status_enum_chk
    CHECK (status IN ('studying', 'graduated', 'trasferred'));
ERROR 3819 (HY000): Check constraint 'status_enum_chk' is violated.
```
