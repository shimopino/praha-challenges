# 課題１

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題１](#課題１)
  - [Git flow](#git-flow)
    - [概要](#概要)
    - [開発プロセス](#開発プロセス)
  - [Github flow](#github-flow)
    - [概要](#概要-1)
    - [開発プロセス](#開発プロセス-1)
  - [GitLab flow](#gitlab-flow)
    - [概要](#概要-2)
    - [開発プロセス](#開発プロセス-2)
  - [Git Feature flow](#git-feature-flow)
    - [概要](#概要-3)
    - [開発プロセス](#開発プロセス-3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Git flow

### 概要

**Git flow** は以下のブランチで構成されている。

![](assets/git-flow.drawio.svg)

| ブランチ名 | 用途                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| master     | ・ユーザーにリリースしたソースコードを管理する<br>・タグでバージョンを管理                                                     |
| hotfix     | ・リリースされたバージョンで発生したバグを修正するブランチ                                                                     |
| release    | ・develop ブランチをベースに作成されるブランチ<br>・QA などを実施するブランチ<br>・QA 終了後に、maste/develop ブランチにマージ |
| develop    | ・開発作業を行うブランチ<br>・新しい機能は feature ブランチに切って開発                                                        |
| feature    | ・develop ブランチをベースに作成されるブランチ<br>・新しい機能を開発する                                                       |

### 開発プロセス

| ブランチ名                                   | 用途                                      |
| :------------------------------------------- | :---------------------------------------- |
| 開発用ブランチを作成する                     | ![](assets/git-flow-process-1.drawio.svg) |
| ブランチを切って新機能を実装する             | ![](assets/git-flow-process-2.drawio.svg) |
| 新機能の開発が完了すると開発用ブランチに戻す | ![](assets/git-flow-process-3.drawio.svg) |
| リリース準備を行う                           | ![](assets/git-flow-process-4.drawio.svg) |
| リリースを行う                               | ![](assets/git-flow-process-5.drawio.svg) |
| 緊急のバグ対応を行う                         | ![](assets/git-flow-process-6.drawio.svg) |

合間合間でCIでのテストなどを実施する。

## Github flow

### 概要



### 開発プロセス

## GitLab flow

### 概要


### 開発プロセス

## Git Feature flow

### 概要


### 開発プロセス

