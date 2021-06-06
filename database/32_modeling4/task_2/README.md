# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

## 物理設計

以下に実際に penpen を使用した際の仕様をまとめる。

- 文法
  - `/penpen <送信先> <文面> <頻度>`
- 送信先
  - 複数の送信先を設定することが可能
  - `/penpen @user1 @user2 @user3 sample 'every 1 hour'`
- リマインダ
  - バッチ起動にて、設定されているリマインダ一覧を確認する
  - リマインダに設定されている各ユーザのタスクが未完了であれば、対象のユーザに通知する
  - 反対にユーザがタスクを完了済みであれば、対象のユーザには通知しない
  - 周期
    - `every 1 day`
    - `every n days`
    - `every date`
    - `the second day of every month`

以下の物理設計を考える。

```sql
CREATE TABLE IF NOT EXISTS User (
    id INT PRIMARY KEY,
    name VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Reminder (
    id INT PRIMARY KEY,
    message VARCHAR(30),
    created_by int,
    FOREIGN KEY created_by
        REFERENCES User(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS RemindUser (
    reminder_id INT,
    user_id INT,
    task_status VARCHAR(30),
    PRIMARY KEY (reminder_id, user_id),
    FOREIGN KEY reminder_id
        REFERENCES Reminder(id),
    FOREIGN KEY user_id
        REFERENCES User(id)
) ENGINE=InnoDB;
```