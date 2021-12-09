# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [コンフリクトしているファイルを全て表示するにはどうすればいいでしょうか](#%E3%82%B3%E3%83%B3%E3%83%95%E3%83%AA%E3%82%AF%E3%83%88%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E5%85%A8%E3%81%A6%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## コンフリクトしているファイルを全て表示するにはどうすればいいでしょうか

<details>
<summary>解答</summary>
<div>

```bash
$ git diff --name-only --diff-filter=U
```

</div>
</details>

## リモートブランチを削除するにはどうすればいいでしょうか

<details>
<summary>解答</summary>
<div>

```bash
$ git push origin --delete <remote_branch>

$ git push origin :<remote_branch>
```

</div>
</details>

## `cherry-pick` コマンドはどのようなときに使用されるでしょうか

<details>
<summary>解答</summary>
<div>

- チーム内で同じコードを開発している場合に使用する
  - バックエンドとフロントエンドに分かれて開発しているとき
  - 片方が開発した機能を、
  - 自身のブランチへのコミットとして持ってきたいときに使ったりする
- バグのホットフィックス
  - 新しい機能の開発中に既存のバグが見つかったとき
  - バグをパッチするコミットを作成する
  - `master` ブランチに直接 `cherry-pick` してバグを修正する

</div>
</details>

## 参考資料

- [git-tips](https://github.com/isotai/git-tips#rebase%E6%99%82%E3%81%AB%E4%B8%8A%E8%A8%98%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E9%A0%86%E3%82%92%E9%9A%A3%E3%81%AB%E4%B8%A6%E3%81%B9%E6%9B%BF%E3%81%88%E3%81%A6%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B)
- [Advanced Git Tutorials](https://www.atlassian.com/ja/git/tutorials/advanced-overview)
- [git - apply a commit on another branch to the working copy](https://stackoverflow.com/questions/36778375/git-apply-a-commit-on-another-branch-to-the-working-copy)
 