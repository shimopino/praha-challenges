# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [コンフリクトしているファイルを全て表示するにはどうすればいいでしょうか](#%E3%82%B3%E3%83%B3%E3%83%95%E3%83%AA%E3%82%AF%E3%83%88%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E5%85%A8%E3%81%A6%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [リモートブランチを削除するにはどうすればいいでしょうか](#%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%88%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [`cherry-pick` コマンドはどのようなときに使用されるでしょうか](#cherry-pick-%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E3%81%A8%E3%81%8D%E3%81%AB%E4%BD%BF%E7%94%A8%E3%81%95%E3%82%8C%E3%82%8B%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
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

## `cherry-pick` コマンドを実際に使用してみましょう

まずは以下の状態を作成する。

```bash
 - a - e        original
    \
     b - c - d  feature     
```

<details>
<summary>コマンド</summary>
<div>

```bash
# コミット <a> を用意する
❯❯❯ git checkout -b original feature/task56-issue-141
echo "original a" > index.html
git add index.html
git commit -m "docs: コミット <a> を追加 #141"

# コミット <b> を用意する
❯❯❯ git checkout -b cherrypick original
echo "feature b" >> index.html
git add index.html
git commit -m "docs: コミット <b> を追加 #141"

# コミット <c> を用意する
echo "feature c" >> index.html
git add index.html
git commit -m "docs: コミット <c> を追加 #141"

# コミット <d> を用意する
echo "feature d" >> index.html
git add index.html
git commit -m "docs: コミット <d> を追加 #141"
```

</div>
</details>

ここから以下の状態にしてみましょう。

```bash
 - a - e - c    original
    \
     b - c - d  feature
```

<details>
<summary>解答</summary>
<div>

```bash
# original ブランチに移動する
❯❯❯ git checkout original

# cherrypick ブランチのログを確認する
❯❯❯ git log cherrypick --oneline -4

9406003 (cherrypick) docs: コミット <d> を追加 #141
dd6341d docs: コミット <c> を追加 #141
007b34d docs: コミット <b> を追加 #141
cd85ae9 (HEAD -> original) docs: コミット <a> を追加 #141

# cherry-pick を実行する
❯❯❯ git cherry-pick dd6341d

Auto-merging team/56_Git/quiz/index.html
CONFLICT (content): Merge conflict in team/56_Git/quiz/index.html
error: could not apply dd6341d... docs: コミット <c> を追加 #141
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'

# 競合が発生しているため解消を行う
# 競合を解消した後で、特定のコミットを追加する
❯❯❯ git log --oneline -4

e81fb02 (HEAD -> original) docs: コミット <c> の取り込み
cd85ae9 docs: コミット <a> を追加 #141

# コミットの差分を表示すると、他のブランチでのコミット内容がついかされていることがわかる
❯❯❯ git diff cd85ae9 e81fb02

diff --git a/team/56_Git/quiz/index.html b/team/56_Git/quiz/index.html
index 37c76c2..bc4712f 100644
--- a/team/56_Git/quiz/index.html
+++ b/team/56_Git/quiz/index.html
@@ -1 +1,3 @@
 original a
+feature b
+feature c
```

</div>
</details>

## 参考資料

- [git-tips](https://github.com/isotai/git-tips#rebase%E6%99%82%E3%81%AB%E4%B8%8A%E8%A8%98%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E9%A0%86%E3%82%92%E9%9A%A3%E3%81%AB%E4%B8%A6%E3%81%B9%E6%9B%BF%E3%81%88%E3%81%A6%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B)
- [Advanced Git Tutorials](https://www.atlassian.com/ja/git/tutorials/advanced-overview)
- [git - apply a commit on another branch to the working copy](https://stackoverflow.com/questions/36778375/git-apply-a-commit-on-another-branch-to-the-working-copy)
 