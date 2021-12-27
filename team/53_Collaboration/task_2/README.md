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

複数の ISSUE テンプレートで共通しているものは以下になる。

- バグ報告

  ```yml
  # https://github.com/vitejs/vite/blob/main/.github/ISSUE_TEMPLATE/bug_report.yml
  name: "\U0001F41E Bug report"
  description: Report an issue with Vite
  labels: [pending triage]
  body:
    - type: markdown
      attributes:
        value: |
          Thanks for taking the time to fill out this bug report!
    - type: textarea
      id: bug-description
      attributes:
        label: Describe the bug
        description: A clear and concise description of what the bug is. If you intend to submit a PR for this issue, tell us in the description. Thanks!
        placeholder: Bug description
      validations:
        required: true
    - type: input
      id: reproduction
      attributes:
        label: Reproduction
        description: Please provide a link via [vite.new](https://vite.new/) or a link to a repo that can reproduce the problem you ran into. A [minimal reproduction](https://stackoverflow.com/help/minimal-reproducible-example) is required. If a report is vague (e.g. just a generic error message) and has no reproduction, it will receive a "need reproduction" label. If no reproduction is provided after 3 days, it will be auto-closed.
        placeholder: Reproduction
      validations:
        required: true
    - type: textarea
      id: system-info
      attributes:
        label: System Info
        description: Output of `npx envinfo --system --npmPackages '{vite,@vitejs/*}' --binaries --browsers`
        render: shell
        placeholder: System, Binaries, Browsers
      validations:
        required: true
    - type: dropdown
      id: package-manager
      attributes:
        label: Used Package Manager
        description: Select the used package manager
        options:
          - npm
          - yarn
          - pnpm
      validations:
        required: true
    - type: textarea
      id: logs
      attributes:
        label: Logs
        description: |
          Optional if provided reproduction. Please try not to insert an image but copy paste the log text.

          1. Run `vite` or `vite build` with the `--debug` flag.
          2. Provide the error log here.
        render: shell
    - type: checkboxes
      id: checkboxes
      attributes:
        label: Validations
        description: Before submitting the issue, please make sure you do the following
        options:
          - label: Follow our [Code of Conduct](https://github.com/vitejs/vite/blob/main/CODE_OF_CONDUCT.md)
            required: true
          - label: Read the [Contributing Guidelines](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md).
            required: true
          - label: Read the [docs](https://vitejs.dev/guide).
            required: true
          - label: Check that there isn't [already an issue](https://github.com/vitejs/vite/issues) that reports the same bug to avoid creating a duplicate.
            required: true
          - label: Make sure this is a Vite issue and not a framework-specific issue. For example, if it's a Vue SFC related bug, it should likely be reported to https://github.com/vuejs/vue-next instead.
            required: true
          - label: Check that this is a concrete bug. For Q&A open a [GitHub Discussion](https://github.com/vitejs/vite/discussions) or join our [Discord Chat Server](https://chat.vitejs.dev/).
            required: true
          - label: The provided reproduction is a [minimal reproducible example](https://stackoverflow.com/help/minimal-reproducible-example) of the bug.
            required: true
  ```

- 新機能提案

  ```yml
  # https://raw.githubusercontent.com/vitejs/vite/main/.github/ISSUE_TEMPLATE/feature_request.yml
  name: "\U0001F680 New feature proposal"
  description: Propose a new feature to be added to Vite
  labels: ["enhancement: pending triage"]
  body:
    - type: markdown
      attributes:
        value: |
          Thanks for your interest in the project and taking the time to fill out this feature report!
    - type: textarea
      id: feature-description
      attributes:
        label: Clear and concise description of the problem
        description: "As a developer using Vite I want [goal / wish] so that [benefit]. If you intend to submit a PR for this issue, tell us in the description. Thanks!"
      validations:
        required: true
    - type: textarea
      id: suggested-solution
      attributes:
        label: Suggested solution
        description: "In module [xy] we could provide following implementation..."
      validations:
        required: true
    - type: textarea
      id: alternative
      attributes:
        label: Alternative
        description: Clear and concise description of any alternative solutions or features you've considered.
    - type: textarea
      id: additional-context
      attributes:
        label: Additional context
        description: Any other context or screenshots about the feature request here.
    - type: checkboxes
      id: checkboxes
      attributes:
        label: Validations
        description: Before submitting the issue, please make sure you do the following
        options:
          - label: Follow our [Code of Conduct](https://github.com/vitejs/vite/blob/main/CODE_OF_CONDUCT.md)
            required: true
          - label: Read the [Contributing Guidelines](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md).
            required: true
          - label: Read the [docs](https://vitejs.dev/guide).
            required: true
          - label: Check that there isn't already an issue that request the same feature to avoid creating a duplicate.
            required: true
  ```

- その他

  - 以下のように公式のチャットスペースなどへの案内がある場合も

    ```yml
    blank_issues_enabled: false
    contact_links:
      - name: Discord Chat
        url: https://chat.vitejs.dev
        about: Ask questions and discuss with other Vite users in real time.
      - name: Questions & Discussions
        url: https://github.com/vitejs/vite/discussions
        about: Use GitHub discussions for message-board style questions and discussions.
    ```

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
