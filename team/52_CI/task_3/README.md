# 課題 3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [node_modules caches](#node_modules-caches)
  - [setup-node](#setup-node)
  - [actions/cache](#actionscache)
- [キャッシュへのアクセス制限](#%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%81%B8%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E5%88%B6%E9%99%90)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## node_modules caches

Github 上でホスティングされているランナー上のジョブは、新しい仮想環境で実行されるため、依存しているライブラリをダウンロードする必要があり、ネットワーク使用量の増加や実行時間の会陰長につながってしまう可能性がある。

node を使用している場合は、こうした依存関係をキャッシュする方法は以下の 2 つが存在する。

- `setup-node` を使用する
- `actions/cache` を使用する

### setup-node

node の環境を準備するための `setup-node` アクションでは、ビルドインでキャッシュ機能を提供されている（内部的には `actions/cache` を使用している）。

デフォルト設定では、リポジトリのルートディレクトリ上に存在している `package-lock.json` のハッシュ値をキャッシュのキーとして使用している。また、複数の依存関係が存在している場合には `cache-dependency-path` を使用することができる。

```yml
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: "14"
      cache: "npm"
  - run: npm install
  - run: npm test
```

複数のプロジェクトを管理しているモノリポ構成の場合は、以下の様にキャッシュを指定することができる。

```yml
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: "14"
      cache: "npm"
      # キャッシュのキーとなるハッシュ値の元ファイルを指定する
      cache-dependency-path: |
        backend/package-lock.json
        frontend/package-lock.json
  - run: npm install
  - run: npm test
```

参考資料

- [Caching packages dependencies](https://github.com/actions/setup-node#caching-packages-dependencies)

### actions/cache

`cache` アクションでは、指定されたキーでキャッシュを作成し、次回以降は同じキーに該当する場合にはキャッシュを使用して、新しいキーが指定された場合には新しくキャッシュを作成することができる。

処理の流れとしては以下になる。

1. `key` にマッチするキャッシュがある場合は、`path` のディレクトリにキャッシュを復元する
2. `key` にマッチしない場合は、ジョブが成功した後に新しいキャッシュが作成される
3. `key` にマッチしない場合は、`restore-keys` という代替のキーに該当するキャッシュがないか検索する
4. キャッシュがヒットする場合は、`path` のディレクトリにキャッシュを復元する

実際の設定ファイルは以下のようになる。

```yml
steps:
  - uses: actions/checkout@v2
  - uses: actions/cache@v2
    env:
      cache-name: cache-node-modules
    with:
      path: ~/.npm
      key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-build-${{ env.cache-name }}-
        ${{ runner.os }}-build-
        ${{ runner.os }}-
```

参考資料

- [Caching dependencies to speed up workflows](https://docs.github.com/ja/actions/advanced-guides/caching-dependencies-to-speed-up-workflows)

## キャッシュへのアクセス制限

`actions/cache@v2` のバージョンを使用する場合、`GITHUB_REF` を有している任意のイベントをトリガーに発生したワークフローで、キャッシュにアクセスすることができる。

ブランチ間では、親ブランチで作成されたキャッシュは子ブランチでも使用することができ、同じ親を持つブランチでは論理的な境界をもつアクセス制限を設けることができる。

```bash
# mainブランチとfeature-aブランチのキャッシュを利用可能
main
  └── feature-a
          └── feature-b

# feature-* ブランチはお互いのキャッシュを参照できない
main
  ├── feature-a
  └── feature-b
```

## repository_dispatch

`repository_dispatch` というトリガーを使用すると、webhook でワークフローをトリガーすることができる様になる。

```yml
name: repository dispatch sample

on:
  repository_dispatch:
    types: [issued]

jobs:
  dispatch_echo:
    steps:
      - uses: actions/checkout@v2
      - run: echo "hook repository dispatch event"
```

あとは対象のリポジトリに対して API コールを実行すればいい。

```bash
# https://docs.github.com/ja/rest/reference/repos#create-a-repository-dispatch-event
curl https://api.github.com/com/repos/shimopino/github-actions-playground/dispatches \
  -X POSR \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  --data '{"event_type": "issued" }'
```

参考資料

- [repository_dispatch](https://docs.github.com/ja/actions/learn-github-actions/events-that-trigger-workflows#repository_dispatch)

