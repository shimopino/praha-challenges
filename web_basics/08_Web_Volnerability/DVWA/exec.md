# Command Injection

<!-- START doctoc -->
<!-- END doctoc -->

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
