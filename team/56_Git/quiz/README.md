# クイズ

<!-- START doctoc -->
<!-- END doctoc -->

## コンフリクトしているファイルを全て表示するにはどうすればいいでしょうか

<details>
<summary>解答</summary>
<div>

```bash
$ git diff --name-only --diff-filter=U
```

</div>
</details>

## 参考資料

- [git-tips](https://github.com/isotai/git-tips#rebase%E6%99%82%E3%81%AB%E4%B8%8A%E8%A8%98%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E9%A0%86%E3%82%92%E9%9A%A3%E3%81%AB%E4%B8%A6%E3%81%B9%E6%9B%BF%E3%81%88%E3%81%A6%E3%82%8F%E3%81%8B%E3%82%8A%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B)
- [Advanced Git Tutorials](https://www.atlassian.com/ja/git/tutorials/advanced-overview)
- [git - apply a commit on another branch to the working copy](https://stackoverflow.com/questions/36778375/git-apply-a-commit-on-another-branch-to-the-working-copy)
 