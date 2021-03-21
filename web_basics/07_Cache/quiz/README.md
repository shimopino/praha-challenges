# 課題4 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
- [任意課題](#%E4%BB%BB%E6%84%8F%E8%AA%B2%E9%A1%8C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

キャッシュサーバが、キャッシュからページを提供するかどうかを決定する際に、モバイルユーザーとデスクトップユーザーに対して異なるコンテンツを提供するために役立つ HTTP ヘッダは何でしょうか。

<details>
<summary>回答例</summary>

- `User-Agent` ヘッダ
  - リクエスト元となる個人を表すコンピュータのプログラムのこと
  - Chrome や Firefox、iOS などを表している

しかし、実際の `User-Agent` の値を見てみると、かなり余分な情報が入っていたり、異なる情報がまぎれてしまっていたりしている。

そこで Chrome は `User-Agent` ヘッダを廃止して、代替として `User-Agent Client Hints` を使用するようになるらしい。

> This document proposes a mechanism which might allow user agents to be a bit more aggressive about removing entropy from the User-Agent string generally by giving servers that really need some specific details about the client the ability to opt-into receiving them.

より正確な `User-Agent` に関する情報を、サーバ側からの要請に従って提供する、いわばオプトインな方式に変更する形式である。

- [UA-Client Hints](https://wicg.github.io/ua-client-hints/)

</details>

## #2 クイズ

以下の状況を考える。

1. クライアントが以下のリソースを要求する

    ```bash
    page.html, script.js, style.css
    ```

2. キャッシュにはレスポンスが保存されていなかったので、サーバにリクエストを送信する
3. サーバは以下のヘッダを付与してレスポンスを送信する

    ```bash
    Cache-Control: must-revalidate, max-age=600
    ```

4. 6分後にクライアントが再度以下のリソースを要求する

    ```bash
    page.html, script.js, style.css
    ```

5. キャッシュサイズの制限やそのほかの理由が原因で、キャッシュから `style.css` だけ破棄されてしまっている
6. キャッシュはサーバに対して `style.css` のリクエストを送信する
7. サーバはリクエストされた対象リソースに、新しく以下のヘッダを付与してレスポンスを送信する

    ```bash
    Cache-Control: must-revalidate, max-age=600
    ```

この過程を経て表示されるページには、どのような問題が発生する可能性があるでしょうか。

<details>
<summary>回答例</summary>

> 6. キャッシュはサーバに対して `style.css` のリクエストを送信する
> 7. サーバはリクエストされた対象リソースに、新しく以下のヘッダを付与してレスポンスを送信する
    ```bash
    Cache-Control: must-revalidate, max-age=600
    ```

- 6分後のリクエストで、`syle.css` にのみ新しく `max-age=600` というキャッシュの期限を与えたことで、`page.html`、`script.js` と `style.css` でキャッシュの有効期限にズレが発生してしまっている。
- そのため、例えばこの6分後のリクエストから更に6分ほど経った時点（つまり一番最初のリクエストから12分経過）で、再度リクエストを行った場合、`page.html` と `script.js` は、キャッシュの有効期限が既に切れているため、オリジンサーバへ最新情報を取得しにいくが、`style.css` は、キャッシュの有効期限が切れていないため、キャッシュに保存しているデータを取得することになる。
- もし、新しく取得された`page.html` と `script.js` が、キャッシュ済みの `style.css` に対応していない変更を行っていた場合、ブラウザで開発者の想定外の挙動が発生する可能性がある。
- また、`style.css` をオリジンサーバから取得した段階で、キャッシュに存在している `page.html` と `script.js` のバージョンとずれてしまうため、CSSを反映させた段階で崩れてしまう可能性がある

</details>


## 任意課題

参考資料

- [Awesome Compose](https://github.com/docker/awesome-compose)
- [docker+Node.js(Express)+nginxの最小構成プロジェクトを作成する](https://qiita.com/ryo-ohnishi/items/3653f7583c8591eef333)
- [nginxでプロキシサーバを立ててNode.jsのアプリケーションを動かす](https://qiita.com/juve_534/items/a61c8d08acda6d5f5a4e)
