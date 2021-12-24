# 課題 3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [node_modules caches](#node_modules-caches)
  - [setup-node](#setup-node)
  - [actions/cache](#actionscache)

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
