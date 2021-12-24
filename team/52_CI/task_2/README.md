# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Github Acrions での Docker コンテナ](#github-acrions-%E3%81%A7%E3%81%AE-docker-%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A)
- [サンプルリポジトリ](#%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Github Acrions での Docker コンテナ

Github Actions でデータベースを使用する結合テストを実行する際に、Docker コンテナを利用することが可能である。

もしもランナーを起動しているサーバで直接起動すれば、`localhost:<port>` や `127.0.0.1:<port>` でサービスにアクセスすることが可能である。

例えば以下の様なワークフローファイルを設定すれば、Postgres のコンテナを起動することができる。

```yml
name: PostgreSQL service example
on: push

jobs:
  # Label of the container job
  container-job:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest
    # Docker Hub image that `container-job` executes in
    container: node:10.18-jessie

    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for postgres
        env:
          POSTGRES_PASSWORD: postgres
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      # Downloads a copy of the code in your repository before running CI tests
      - name: Check out repository code
        uses: actions/checkout@v2

      # Performs a clean installation of all dependencies in the `package.json` file
      # For more information, see https://docs.npmjs.com/cli/ci.html
      - name: Install dependencies
        run: npm ci

      - name: Connect to PostgreSQL
        # Runs a script that creates a PostgreSQL table, populates
        # the table with data, and then retrieves the data.
        run: node client.js
        # Environment variables used by the `client.js` script to create a new PostgreSQL table.
        env:
          # The hostname used to communicate with the PostgreSQL service container
          POSTGRES_HOST: postgres
          # The default PostgreSQL port
          POSTGRES_PORT: 5432
```

参考資料

- [About service containers](https://docs.github.com/en/actions/using-containerized-services/about-service-containers)
- [Creating PostgreSQL service containers](https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers)

## サンプルリポジトリ

特大課題を実施する際に使用していた Github Actions は以下になる。

https://github.com/shimopino/praha-challenges-ddd/blob/main/.github/workflows/ci.yml

以下がポイントである。

- `strategy` を使用して複数の Node のバージョンでテストを行なっている
- `~/.npm` のキャッシュを使用して処理を高速化している
- `docker-compose` を使用してテストで使用する DB インスタンスを起動している
