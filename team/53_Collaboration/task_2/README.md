# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Github でテンプレート機能をつかってみよう](#github-%E3%81%A7%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E6%A9%9F%E8%83%BD%E3%82%92%E3%81%A4%E3%81%8B%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86)
  - [既存のフレームワークでのテンプレート](#%E6%97%A2%E5%AD%98%E3%81%AE%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%A7%E3%81%AE%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88)
  - [ISSUE_TEMPLATE](#issue_template)
  - [PULL_REQUEST_TEMPLATE](#pull_request_template)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Github でテンプレート機能をつかってみよう

### 既存のフレームワークでのテンプレート

プラハチャレンジの課題を進めていくにあたって、既に ISSUE やプルリクエストのテンプレートを作成しているため、サンプルとして載せておく。

- [ISSUE テンプレート](https://github.com/shimopino/praha-challenges/tree/main/.github/ISSUE_TEMPLATE)
- [プルリクエストテンプレート](https://github.com/shimopino/praha-challenges/blob/main/.github/PULL_REQUEST_TEMPLATE.md)

質の高い ISSUE やプルリクエストのためのテンプレートを作成するため、有名なフレームワークのテンプレートを確認する。

| Language | CONTRIBUTING.md                                                                   | ISSUE_TEMPLATE                                                                          | PULL_REQUEST_TEMPLATE                                                                                       |
| :------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| Angular  | [CONTRIBUTING.md](https://github.com/angular/angular/blob/master/CONTRIBUTING.md) | [ISSUE_TEMPLATE](https://github.com/angular/angular/tree/master/.github/ISSUE_TEMPLATE) | [PULL_REQUEST_TEMPLATE.md](https://github.com/angular/angular/blob/master/.github/PULL_REQUEST_TEMPLATE.md) |
| React    | [CONTRIBUTING.md](https://github.com/facebook/react/blob/main/CONTRIBUTING.md)    | [ISSUE_TEMPLATE](https://github.com/facebook/react/tree/main/.github/ISSUE_TEMPLATE)    | [PULL_REQUEST_TEMPLATE.md](https://github.com/facebook/react/blob/main/.github/PULL_REQUEST_TEMPLATE.md)    |
| Vue      | [CONTRIBUTING.md](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md)  | [ISSUE_TEMPLATE](https://github.com/vuejs/vue/tree/dev/.github/ISSUE_TEMPLATE)          | [PULL_REQUEST_TEMPLATE.md](https://github.com/vuejs/vue/blob/dev/.github/PULL_REQUEST_TEMPLATE.md)          |
| Svelte   | [CONTRIBUTING.md](https://github.com/sveltejs/svelte/blob/master/CONTRIBUTING.md) | [ISSUE_TEMPLATE](https://github.com/sveltejs/svelte/tree/master/.github/ISSUE_TEMPLATE) | [PULL_REQUEST_TEMPLATE.md](https://github.com/sveltejs/svelte/blob/master/.github/PULL_REQUEST_TEMPLATE.md) |
| Vite     | [CONTRIBUTING.md](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)       | [ISSUE_TEMPLATE](https://github.com/vitejs/vite/tree/main/.github/ISSUE_TEMPLATE)       | [PULL_REQUEST_TEMPLATE.md](https://github.com/vitejs/vite/blob/main/.github/PULL_REQUEST_TEMPLATE.md)       |

### ISSUE_TEMPLATE

### PULL_REQUEST_TEMPLATE

複数のプルリクエストのテンプレートで共通しているものを抜き出す。

- 規約に従っているのか？
  - `CONTRIBUTING.md` に記述されているルールに従っているのか？
  - テストが追加されているのか？（バグ修正あるいは新機能開発）
  - ドキュメントは最新化されているのか？（バグ修正あるいは新機能開発）
- プルリクの種別は何か？
  - バグ修正？
  - 新機能開発？
  - リファクタリング？
  - ドキュメントの更新？
- どのような振る舞いなのか？
- 破壊的変更が導入されるのか？

これらから以下のテンプレートを作成する。

<details>
<summary>テンプレート</summary>
<div>

```md
<!-- Thank you for contributing! -->

### Description

<!-- Please insert your description here and provide especially info about the "what" this PR is solving -->

### Additional context

<!-- e.g. is there anything you'd like reviewers to focus on? -->

---

### What is the purpose of this pull request? <!-- (put an "X" next to an item) -->

- [ ] Bug fix
- [ ] New Feature
- [ ] Documentation update
- [ ] Other

### Before submitting the PR, please make sure you do the following

- [ ] [Contributing Guidelines](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) に従っているのか
- [ ] 関連するドキュメントが最新化されているのか
- [ ] 関連するテストコードが追加され、パスしているのか
```

</div>
</details>
