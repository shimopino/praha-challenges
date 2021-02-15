# 課題2 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

今回の課題で取り組んだ以下の脆弱性に関して、[Damn Volnerable Web Application](https://dvwa.co.uk/) のセキュリティレベルを `impossible` に設定した際に、どのような対策が施されているでしょうか

- XSS
- Command Injection
- SQL Injection
- CSRF

### XSS

<details>
<summary>回答例</summary>
<div>

該当するソースコードは以下になる。

```php
<?php

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
	// Check Anti-CSRF token
	checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

	// Get input
	$name = htmlspecialchars( $_GET[ 'name' ] );

	// Feedback for end user
	$html .= "<pre>Hello ${name}</pre>";
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

対策としては以下の2つを実施していることがわかる。

- ユーザ入力値のエスケープ処理
  - PHPの `htmlspecialchars()` を使って特殊文字をエスケープしている
- CSRFトークンの埋め込み
  - リクエストを処理するごとにCSRFトークンを生成している
  - 生成したトークンは `<input type="hidden">` に埋め込んでいる

    ```html
    <div class="vulnerable_code_area">
        <form name="XSS" action="#" method="GET">
            <p>
            What's your name?
            <input type="text" name="name">
            <input type="submit" value="Submit">
            </p>
            <!-- CSRFトークンの埋め込み -->
            <input type='hidden' name='user_token' value='def3b274f61557a0d24c4647d782295d' />
        </form>
        <pre>Hello &lt;script&gt;document.cookie&lt;/script&gt;</pre>
    </div>
    ```

</div>
</details>

### Command Injection

<details>
<summary>回答例</summary>
<div>


</div>
</details>


### SQL Injection

<details>
<summary>回答例</summary>
<div>


</div>
</details>

### CSRF

<details>
<summary>回答例</summary>
<div>


</div>
</details>
