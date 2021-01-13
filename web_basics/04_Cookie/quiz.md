# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [クイズ &#035;1](#%E3%82%AF%E3%82%A4%E3%82%BA-1)
- [クイズ &#035;2](#%E3%82%AF%E3%82%A4%E3%82%BA-2)
- [クイズ &#035;3](#%E3%82%AF%E3%82%A4%E3%82%BA-3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## クイズ #1

実際にユーザセッションを使用して、セッションハイジャックを試してみましょう。

- [github.com](https://github.com/)にアクセスする
- Chromeの検証ツールの`Application`タブから `github.com` ドメインに対応するCookieを確認する
- ユーザセッションを取得
- 別のブラウザで `github.com` からログアウトする
- 検証ツールの`Application`タブに直接ユーザセッションに取得したセッションIDを格納する
- ページを再リロードする

## クイズ #2

Cookieに変わる機能として提案されている`Sec-HTTP-State`とは何でしょうか。

<details>
<summary>回答例</summary>

- Cookieの問題としては以下が挙げられる
  - Cookieへのアクセス
    - 現状では`document.cookie`を使用することで、デフォルトでCookieにアクセス可能
    - Cookieへの操作を防ぐためのA`HttpOnly`属性の導入率は8.31%（2018年8月時点）
  - Cookieの非セキュアなサイトへの送信
    - Cookieは`http://`などの非セキュアなサイトへデフォルトでCookieを送信する
    - 非セキュアなサイトにCookieを送信しないための`Secure`属性の導入率は7.85%（2018年8月時点）
- `Sec-HTTP-State`ヘッダ
  - 特徴はクライアント側から状態を管理するためのトークンを発行する点である
  - セキュアなオリジンにアクセスした際に、`256bit`のトークンを`Sec-HTTP-State`ヘッダに付与する
  - JavaScriptからこのトークンを操作することはできない
  - ブラウザは1つのオリジンに対して1つのトークンを発行できる
  - 非セキュアなサイトへのトークンは発行されない
  - `same-site`へのリクエストにのみ送信される
  - デフォルトではトークンの有効期限は1時間である
    - サーバ側やクライアント側からこの設定は変更可能
- デフォルトの挙動を変更することが可能
  - 例: 送信される境界を変更する
  
    ```js
    Sec-HTTP-State-Options: ..., delivery=cross-site, ...
    or
    Sec-HTTP-State-Options: ..., delivery=same-origin, ...
    ```
    
  - 例: 有効期限を変更する
  
    ```js
    Sec-HTTP-State-Options: ..., max-age=3600, ...
    
    Sec-HTTP-State-Options: ..., max-age=0, ...
    ```
    
    なおブラウザは状態変更を検知して、すぐさま反映することが可能
    
    ```js
    let resetChannel = new BroadcastChannel('http-state-reset'));
    resetChannel.onmessage = e => { /* Do exciting cleanup here. */ };
    ```

> 各属性値の導入率などはどうやって調べることができるのか?

参考資料

- [IFTF Draft](https://tools.ietf.org/html/draft-west-http-state-tokens-00)
- [Explainer: Tightening HTTP State Management](https://mikewest.github.io/http-state-tokens/)
- [https://github.com/mikewest/http-state-tokens](https://github.com/mikewest/http-state-tokens)
- [Cookieにかわる Sec-HTTP-State ヘッダの提案](https://asnokaze.hatenablog.com/entry/2018/08/15/023431)

</details>

## クイズ #3

Googleが提唱しているCookieの代替となる`Privacy Sandbox`とは何でしょうか。
