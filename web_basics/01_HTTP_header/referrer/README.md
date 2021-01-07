# Referrer

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [調査内容](#%E8%AA%BF%E6%9F%BB%E5%86%85%E5%AE%B9)
- [How to Reproduce ?](#how-to-reproduce-)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 調査内容

Webブラウザでは、HTTPリクエストを送信する際にHTTPヘッダの`Referer:`ヘッダに遷移元のページのURLを設定する。

このとき`Referer:`の挙動を何も設定していない場合、遷移元のページに関する情報が、遷移先のページでも`window.opener`というオブジェクトに保持されてしまい、機密情報などを不正に読み取られてしまう可能性が存在する。

`Referer:`ヘッダに関する情報は以下にまとめている。

- [Refererの追加質問](https://github.com/KeisukeShimokawa/praha-challenges/blob/main/web_basics/01_HTTP_header/README.md#referer%E3%81%AE%E8%BF%BD%E5%8A%A0%E8%B3%AA%E5%95%8F)

今回は実際にページ間遷移を行うHTMLファイルを作成し、`<meta>`タグや`<a>`タグに`Referer:`の制御情報を付与した際の挙動を確認する。。

## How to Reproduce ?

今回の実験では、簡易的にWebサーバ上でHTMLをServingするために、VSCodeの「[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)」という拡張機能を使用している。

検証したいHTMLファイルを右クリックして、「Open With Live Server」を選択すれば動作検証が可能である。

以下の手順で`Referer:`の挙動を確認する。

1. `index.html`にアクセスする
2. ページ内のリンクから`index2.html`にアクセスする

    ```html
    <a href="index2.html" target="_blank">link index2</a>
    ```

3. 別タブに`index2.html`が表示される
4. 遷移元の`index.html`のタブが、`google.com`に遷移していることを確認する

    ```html
    <!-- 遷移先のindex2.htmlから遷移元ページを操作している -->
    <script>
      console.log(window.opener.location);
      window.opener.location = "https://google.com"
    </script>
    ```

5. ChromeブラウザのConsoleに遷移元ページの情報を出力されていることを確認する
6. 再びリンクから`index.html`に遷移する
7. 今度は遷移した後で遷移元ページの情報が書き換えられていないことを確認する

    ```html
    <!-- noopenerによってwindow.openerに情報が渡らない -->
    <a href="index.html" target="_blank" rel="noopener">Link index with noopener</a>
    ```

これで`Referer:`の挙動を確認することができた。
