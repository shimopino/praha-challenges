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

</details>


## 任意課題

参考資料

- [Awesome Compose](https://github.com/docker/awesome-compose)
- [docker+Node.js(Express)+nginxの最小構成プロジェクトを作成する](https://qiita.com/ryo-ohnishi/items/3653f7583c8591eef333)
- [nginxでプロキシサーバを立ててNode.jsのアプリケーションを動かす](https://qiita.com/juve_534/items/a61c8d08acda6d5f5a4e)
