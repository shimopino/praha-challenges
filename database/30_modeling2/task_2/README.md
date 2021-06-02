# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

## 物理設計

以下の物理設計を載せておく。

```sql
CREATE TABLE IF NOT EXISTS User (
    id INT PRIMARY KEY,
    name VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Channel (
    id INT PRIMARY KEY,
    name VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Workspace (
    id INT PRIMARY KEY,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Message (
    id INT PRIMARY KEY,
    user_id INT,
    channel_id INT,
    created_at TIMESTAMP,
    contents VARCHAR(255),
    FOREIGN KEY (user_id)
        REFERENCES User(id),
    FOREIGN KEY (channel_id)
        REFERENCES Channel(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS BelongingToChannel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    channel_id INT,
    FOREIGN KEY (user_id)
        REFERENCES User(id),
    FOREIGN KEY (channel_id)
        REFERENCES Channel(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS BelongingToWorkspace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    workspace_id INT,
    FOREIGN KEY (user_id)
        REFERENCES User(id),
    FOREIGN KEY (workspace_id)
        REFERENCES Workspace(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ChannelInWorkspace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT,
    channel_id INT,
    FOREIGN KEY (workspace_id)
        REFERENCES Workspace(id),
    FOREIGN KEY (channel_id)
        REFERENCES Channel(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS MessageTree (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent INT,
    child INT,
    FOREIGN KEY (parent)
        REFERENCES Message(id),
    FOREIGN KEY (child)
        REFERENCES Message(id)
) ENGINE=InnoDB;
```

## サンプルデータ

ユーザーやチャンネル、ワークスペースは事前にサンプルデータとして用意しておく。

```sql
INSERT INTO User (id, name)
VALUES (1, 'member1'), (2, 'member2'), (3, 'member3'), (4, 'member4'), (5, 'member5');

INSERT INTO Workspace (id, description)
VALUES (1, 'sample workspace for modeling');

INSERT INTO Channel (id, name)
VALUES (1, '_general'), (2, 'pair-1c'), (3, 'team-1');

-- 全チャンネルはワークスペース内に存在する
INSERT INTO ChannelInWorkspace (workspace_id, channel_id)
VALUES (1, 1), (1, 2), (1, 3);

-- ユーザーは全員ワークスペースに所属している
INSERT INTO BelongingToWorkspace (user_id, workspace_id)
VALUES (1, 1), (2, 1), (3, 1), (4, 1), (5, 1);

-- ユーザーとチャンネルとの紐づけ
INSERT INTO BelongingToChannel (user_id, Channel_id)
VALUES
    -- _generalには全員が所属している 
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
    -- pair-1cには、メンバー1と2が所属している
    (1, 2), (2, 2),
    -- team-1には、メンバー1,2,3,4までが所属している
    (1, 3), (2, 3), (3, 3), (4, 3);
```

## 要件

### ユーザーはチャンネルにメッセージを投稿できる

Slackでチャンネルにメッセージを投稿することを考えると、ユーザーがメッセージを入力した段階で、メッセージを投稿するAPIに対して `channel_id` と `user_id`、`contents` が入力とすることが考えられる。

そこでチャンネルID、ユーザーID、メッセージの内容を入力に持つようなデータを投稿すクエリを考える。

```sql
-- 単純にMessage
INSERT
```

### スレッドメッセージに対してメッセージを投稿できる

```sql
INSERT INTO ()
VALUES ();
```

### ユーザーは所属しているチャンネル内のメッセージしか見れない

```sql

```

### ユーザーはワークスペースやチャンネルに参加・脱退できる

```sql
INSERT INTO Channel_Member (user_id, channel_id)
VALUES (1, 1);

INSERT INTO Workspace_Member (user_id, workspace_id)
VALUES (1, 1);
```

### メッセージとスレッドメッセージを横断的に検索できる

```sql

```
