# ペアクイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [クイズ 1](#%E3%82%AF%E3%82%A4%E3%82%BA-1)
- [クイズ 2](#%E3%82%AF%E3%82%A4%E3%82%BA-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## クイズ 1

IAM の Switch Role と IAM ユーザーの違いはなんでしょうか。

また、Switch Role を使用するメリット・デメリットはなんでしょうか。

## クイズ 2

実際に Switch Role を行ってみましょう。

<details>
<summary>回答</summary>
<div>

- 開発者用の IAM ロールを作成する
  ![](assets/developer-step-1.png)
- Developer 用の権限を指定する
  ![](assets/developer-step-2.png)
- Developer ロール名を指定する
  ![](assets/developer-step-3.png)
- Admin 用の権限を指定する
  ![](assets/admin-step-1.png)
- Admin ロール名を指定する
  ![](assets/admin-step-2.png)
- Developer ロールに切り替える
  ![](assets/switch-developer.png)
- 権限が足りていないことがわかる
  ![](assets/developer-permissions.png)
- Admin ロールに切り替える
  ![](assets/switch-admin.png)
- 権限が足りていることがわかる
  ![](assets/admin-admin-permissions.png)

</div>
</details>
