# 課題2 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
  - [XSS](#xss)
  - [Command Injection](#command-injection)
  - [SQL Injection](#sql-injection)
  - [CSRF](#csrf)

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
  - PHPの [`htmlspecialchars()`](https://www.php.net/manual/ja/function.htmlspecialchars.php) を使って特殊文字をエスケープしている
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

該当するソースコードは以下になる。

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
	// Check Anti-CSRF token
	checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

	// Get input
	$target = $_REQUEST[ 'ip' ];
	$target = stripslashes( $target );

	// Split the IP into 4 octects
	$octet = explode( ".", $target );

	// Check IF each octet is an integer
	if( ( is_numeric( $octet[0] ) ) && ( is_numeric( $octet[1] ) ) && ( is_numeric( $octet[2] ) ) && ( is_numeric( $octet[3] ) ) && ( sizeof( $octet ) == 4 ) ) {
		// If all 4 octets are int's put the IP back together.
		$target = $octet[0] . '.' . $octet[1] . '.' . $octet[2] . '.' . $octet[3];

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
	else {
		// Ops. Let the user name theres a mistake
		$html .= '<pre>ERROR: You have entered an invalid IP.</pre>';
	}
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

対策としては以下の2つを実施していることがわかる。

- CSRFトークンの埋め込み
  - リクエストを処理するごとにCSRFトークンを生成している
- `ping` コマンドに合わせたIPアドレス特有の入力値検証処理の実行
  - IPアドレスは `.` 区切りの数値で与えられる
  - ユーザ入力値を [`explode()`](https://www.php.net/manual/ja/function.explode.php) を使用して `.` で分割する
  - 分割された各値を [`is-numeric`](https://www.php.net/manual/ja/function.is-numeric.php) を使用して数値であることを検証する

</div>
</details>


### SQL Injection

<details>
<summary>回答例</summary>
<div>

該当するソースコードは以下になる。

```php
<?php

if( isset( $_GET[ 'Submit' ] ) ) {
	// Check Anti-CSRF token
	checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

	// Get input
	$id = $_GET[ 'id' ];

	// Was a number entered?
	if(is_numeric( $id )) {
		// Check the database
		$data = $db->prepare( 'SELECT first_name, last_name FROM users WHERE user_id = (:id) LIMIT 1;' );
		$data->bindParam( ':id', $id, PDO::PARAM_INT );
		$data->execute();
		$row = $data->fetch();

		// Make sure only 1 result is returned
		if( $data->rowCount() == 1 ) {
			// Get values
			$first = $row[ 'first_name' ];
			$last  = $row[ 'last_name' ];

			// Feedback for end user
			$html .= "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
		}
	}
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

対策としては以下の3つを実施していることがわかる。

- CSRFトークンの埋め込み
  - リクエストを処理するごとにCSRFトークンを生成している
- 文字列結合の代わりにPHPの `Prepared Statement` を使用してSQLを組み立てている
- ユーザ入力値の検証
  - 入力されたユーザIDが数値であることを検証している

</div>
</details>

### CSRF

<details>
<summary>回答例</summary>
<div>

該当するソースコードは以下になる。

```php
// Check Anti-CSRF token
checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );
```

これは今までの脆弱性対策でも使用していた通り、CSRFトークンをサーバで検証している。

以下のようにサーバが発行したユーザトークンと、CSRFトークンが一致しているかどうかを検証しており、一致していない場合は引数で与えられたURLにリダイレクトするようになっている。

```php
// Token functions --
function checkToken( $user_token, $session_token, $returnURL ) {  # Validate the given (CSRF) token
	if( $user_token !== $session_token || !isset( $session_token ) ) {
		dvwaMessagePush( 'CSRF token is incorrect' );
		dvwaRedirect( $returnURL );
	}
}
```

</div>
</details>
