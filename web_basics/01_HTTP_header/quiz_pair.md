# 課題2（kamimi01作成）

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題：HTTPヘッダーに関するクイズを3問、作成してください（作成）](#%E8%AA%B2%E9%A1%8Chttp%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%AF%E3%82%A4%E3%82%BA%E3%82%923%E5%95%8F%E4%BD%9C%E6%88%90%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E4%BD%9C%E6%88%90)
  - [クイズ1](#%E3%82%AF%E3%82%A4%E3%82%BA1)
  - [クイズ2](#%E3%82%AF%E3%82%A4%E3%82%BA2)
  - [クイズ3](#%E3%82%AF%E3%82%A4%E3%82%BA3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題：HTTPヘッダーに関するクイズを3問、作成してください（作成）

### クイズ1
多くのブラウザ(e.g.Chrome / Firefox)では、`Referrer-Policy`にはどのような値を設定することをデフォルトとしていますか？

<details><summary>想定回答</summary>

* `no-referrer-when-downgrade`がデフォルト値だが、最近の多くのブラウザでは`strict-origin-when-cross-origin`をデフォルトとする動きがある。

* 参考
  * 「[A new default Referrer-Policy for Chrome: strict-origin-when-cross-origin](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default?s=09)」(Google)
  * 「[Referrer-Policy](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy)」(Mozilla)
</details>


### クイズ2
クロスドメインアクセスを行う場合、ブラウザの判断でプリフライトリクエストが送信されることがあります。そのリクエストの送信条件は何でしょうか？

<details><summary>想定回答</summary>

* 以下の条件に該当しない場合（つまりシンプルリクエスト以外）は、プリフライトリクエストが送信される。
  * HTTPメソッドがGET, POST, HEADのいずれか
  * HTTPヘッダにAccept, Accept-Language, Content-Language, Content-Type以外のフィールドが含まれない
  * Content-Typeの値はapplication/x-www-form-urlencoded, multipart/form-data, text/plainのいずれか
* 参考
  * 「[CORS(Cross-Origin Resource Sharing)について整理してみた](https://dev.classmethod.jp/articles/about-cors/)」(Classmethod)

</details>

### クイズ3 
Webアプリケーションの脆弱性の1つとして、HTTPヘッダインジェクションがあります。その原因は「〇〇」がヘッダ内に挿入されることにあります。〇〇に入る単語は何でしょうか？

<details><summary>想定回答</summary>

* 改行コード
  * HTTPヘッダの行は、改行コードで区切られるため、意図しないレスポンスヘッダが追加される恐れがある。
  * 例えば、`Set-Cookie`を改行コードに続いてヘッダに含めることで、任意のCookieを固定化することが可能なため、なりすましといった問題が発生する。
* 参考：「[改行コードに要注意！ HTTP ヘッダインジェクションの概要と対策](https://yamory.io/blog/about-http-header-injection/#http-%E3%83%98%E3%83%83%E3%83%80%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%A8%E3%81%AF%E3%81%AA%E3%81%AB%E3%81%8B)」(yamory Blog)

</details>
