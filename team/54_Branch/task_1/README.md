# 課題１

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Git flow](#git-flow)
  - [概要](#%E6%A6%82%E8%A6%81)
  - [開発プロセス](#%E9%96%8B%E7%99%BA%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9)
- [Github flow](#github-flow)
  - [概要](#%E6%A6%82%E8%A6%81-1)
  - [開発プロセス](#%E9%96%8B%E7%99%BA%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9-1)
- [GitLab flow](#gitlab-flow)
  - [概要](#%E6%A6%82%E8%A6%81-2)
  - [開発プロセス](#%E9%96%8B%E7%99%BA%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9-2)
- [Git Feature flow](#git-feature-flow)
  - [概要](#%E6%A6%82%E8%A6%81-3)
  - [開発プロセス](#%E9%96%8B%E7%99%BA%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9-3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Git flow

### 概要

[**Git flow**](https://nvie.com/posts/a-successful-git-branching-model/) は以下のブランチで構成されている。

![](assets/git-flow.drawio.svg)

| ブランチ名 | 用途                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| master     | ・ユーザーにリリースしたソースコードを管理する<br>・タグでバージョンを管理                                                     |
| hotfix     | ・リリースされたバージョンで発生したバグを修正するブランチ                                                                     |
| release    | ・develop ブランチをベースに作成されるブランチ<br>・QA などを実施するブランチ<br>・QA 終了後に、maste/develop ブランチにマージ |
| develop    | ・開発作業を行うブランチ<br>・新しい機能は feature ブランチに切って開発                                                        |
| feature    | ・develop ブランチをベースに作成されるブランチ<br>・新しい機能を開発する                                                       |

### 開発プロセス

| プロセス                                     | ブランチの流れ                            |
| :------------------------------------------- | :---------------------------------------- |
| 開発用ブランチを作成する                     | ![](assets/git-flow-process-1.drawio.svg) |
| ブランチを切って新機能を実装する             | ![](assets/git-flow-process-2.drawio.svg) |
| 新機能の開発が完了すると開発用ブランチに戻す | ![](assets/git-flow-process-3.drawio.svg) |
| リリース準備を行う                           | ![](assets/git-flow-process-4.drawio.svg) |
| リリースを行う                               | ![](assets/git-flow-process-5.drawio.svg) |
| 緊急のバグ対応を行う                         | ![](assets/git-flow-process-6.drawio.svg) |

合間合間で CI でのテストなどを実施する。

## Github flow

### 概要

[**GitHub flow**](http://scottchacon.com/2011/08/31/github-flow.html) は Git-flow のワークフローが複雑すぎるため、よりシンプルなワークフローとして提案された。

具体的には以下のブランチで構成されている。

![](assets/github-flow.drawio.svg)

### 開発プロセス

まずは以前のブランチ戦略の問題点を考えていく。

Git-flow の問題点とは、hotfixブランチとreleaseブランチが余計な複雑性を持ち込んでしまうことである。継続的デリバリが主流の場合、デフォルトのブランチがデプロイされるため、多くのブランチが存在していることはそれだけデプロイする機能を管理することが難しくなってしまうことを意味している。

Github Flow では、プロダクション環境へのデプロイ頻度が非常に短い（１日に何回も行う）ことを前提としたワークフローである。

| プロセス                                                                                                                            | プロセスの流れ                               |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 1. master ブランチは常にデプロイ可能<br><br>・ブランチをロールバックすることはまれ<br>・revert コミットや修正コミットを追加するだけ | ![](assets/github-flow-process-1.drawio.svg) |
| 2. master から開発用ブランチを作成する<br><br>・ブランチ名を機能に合わせて命名する<br>・開発しているトピックを一覧できる            | ![](assets/github-flow-process-2.drawio.svg) |
| 3. 開発用ブランチに定期的に push する<br><br>・デプロイ観点は master のみ<br>・master ブランチ以外は単に作業中であるのみ            | ![](assets/github-flow-process-3.drawio.svg) |
| 4. プルリクエストを作成する<br><br>・コードレビューを実施する<br>・修正対応はコミットするのみ                                       | ![](assets/github-flow-process-3.drawio.svg) |
| 5. マージする<br><br>・レビュー後にのみマージする<br>・直接 master ブランチで作業はしない                                           | ![](assets/github-flow-process-5.drawio.svg) |
| 6. デプロイする<br><br>・master ブランチにマージ後にデプロイする<br>・小さなコミットでもデプロイしていく                            | ![](assets/github-flow-process-5.drawio.svg) |

## GitLab flow

[**GitLab flow**](https://postd.cc/gitlab-flow/) は以下のブランチで構成されている。

### 概要

### 開発プロセス

まずは以前のブランチ戦略の問題点を考えていく。

GitHub-flow の問題点とは、ブランチを必要最小限にすることでデプロイ待ちのコード量を可能な限り少なくしている反面、デプロイ時間を制御できない様なソフトウェアでは適用することができない。これは例えば iOS アプリでデプロイするためには審査が必要であったり、デプロイの時間枠が設定されている場合などである。

GitLab-flow では、以下の様に 本番環境へデプロイするための production ブランチなどが存在している。

## Git Feature flow

### 概要

[**GitFeature flow**](https://developers.gnavi.co.jp/entry/GitFeatureFlow/**koyama**) は以下のブランチで構成されている。

### 開発プロセス
