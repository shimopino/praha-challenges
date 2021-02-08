# Refrected XSS

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Low level](#low-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C)
  - [原因](#%E5%8E%9F%E5%9B%A0)
- [Medium Level](#medium-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C-1)
  - [原因](#%E5%8E%9F%E5%9B%A0-1)
- [High level](#high-level)
  - [実験結果](#%E5%AE%9F%E9%A8%93%E7%B5%90%E6%9E%9C-2)
  - [原因](#%E5%8E%9F%E5%9B%A0-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Low level

### 実験結果

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/xss_r/source/low.php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
        // Feedback for end user
        $html .= '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
}

?>
```

上記のコードでは、入力された値を `$_GET[ 'name' ]` でそのままHTML要素に格納している。

そのため `<script>` タグを使った悪意のあるコードを実行することが可能になってしまっている。

## Medium Level

### 実験結果

### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/xss_r/source/medium.php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
        // Get input
        $name = str_replace( '<script>', '', $_GET[ 'name' ] );

        // Feedback for end user
        $html .= "<pre>Hello ${name}</pre>";
}

?>
```

上記のコードでは、入力された値に対して `<script>` に該当する文字を空文字に変換している。

ただし、あくまでも `<script>` にそのまま該当する文字を変換しているだけなので、大文字を使った `<SCRIPT>` や小文字と大文字が入り混じった `<SCRipt>` はそのまま実行されてしまう。

## High level

### 実験結果


### 原因

該当するソースコードは以下になる。

```php
// /var/www/html/vulnerabilities/xss_r/source/high.php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
        // Get input
        $name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $_GET[ 'name' ] );

        // Feedback for end user
        $html .= "<pre>Hello ${name}</pre>";
}

?>
```

上記のコードでは、大文字も小文字も含めた `<script>` を全て空文字に変換している。

しかし、`<img>` タグ内で `onerror` 属性を指定した際のスクリプトの実行や `<body>` タグ内で `onload` 属性を指定した際のスクリプト実行には何も対処できていない。
