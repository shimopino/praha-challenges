# 課題 3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

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

参考資料

- [Caching dependencies to speed up workflows](https://docs.github.com/ja/actions/advanced-guides/caching-dependencies-to-speed-up-workflows)
