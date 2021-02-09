# Command Injection

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Low Level](#low-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C)
  - [原因](#%E5%8E%9F%E5%9B%A0)
- [Medium Level](#medium-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C-1)
  - [原因](#%E5%8E%9F%E5%9B%A0-1)
- [High Level](#high-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C-2)
  - [原因](#%E5%8E%9F%E5%9B%A0-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Low Level

### 実験結果

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/exec/source/low.php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
        // Get input
        $target = $_REQUEST[ 'ip' ];

        // Determine OS and execute the ping command.
        if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
                // Windows
                $cmd = shell_exec( 'ping  ' . $target );
        }
        else {
                // *nix
                $cmd = shell_exec( 'ping  -c 4 ' . $target );
        }

        // Feedback for the end user
        $html .= "<pre>{$cmd}</pre>";
}

?>
```

## Medium Level

### 実験結果

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/exec/source/medium.php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
        // Get input
        $target = $_REQUEST[ 'ip' ];

        // Set blacklist
        $substitutions = array(
                '&&' => '',
                ';'  => '',
        );

        // Remove any of the charactars in the array (blacklist).
        $target = str_replace( array_keys( $substitutions ), $substitutions, $target );

        // Determine OS and execute the ping command.
        if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
                // Windows
                $cmd = shell_exec( 'ping  ' . $target );
        }
        else {
                // *nix
                $cmd = shell_exec( 'ping  -c 4 ' . $target );
        }

        // Feedback for the end user
        $html .= "<pre>{$cmd}</pre>";
}

?>
```

## High Level

### 実験結果

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/exec/source/high.php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
        // Get input
        $target = trim($_REQUEST[ 'ip' ]);

        // Set blacklist
        $substitutions = array(
                '&'  => '',
                ';'  => '',
                '| ' => '',
                '-'  => '',
                '$'  => '',
                '('  => '',
                ')'  => '',
                '`'  => '',
                '||' => '',
        );

        // Remove any of the charactars in the array (blacklist).
        $target = str_replace( array_keys( $substitutions ), $substitutions, $target );

        // Determine OS and execute the ping command.
        if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
                // Windows
                $cmd = shell_exec( 'ping  ' . $target );
        }
        else {
                // *nix
                $cmd = shell_exec( 'ping  -c 4 ' . $target );
        }

        // Feedback for the end user
        $html .= "<pre>{$cmd}</pre>";
}

?>
```

注意深く観察すれば、コマンドをパイプするためのエスケース記号が ` '| '` であり、なぜか半角スペースが含まれている。

なので半角スペースを含まないようにコマンドをパイプさせれば、Linuxコマンドを実行することができる。
