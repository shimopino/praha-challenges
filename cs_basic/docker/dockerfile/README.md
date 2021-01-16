# Dockerfileの基礎

<!-- START doctoc -->
<!-- END doctoc -->


## NodeJSのBest Practice

### アプリケーション開発

NodeJSをDocker環境でビルドする際の注意点としては、`node_modules`などの依存関係はコピーせずに、キャッシュされるDockerレイヤーを活用することである。

またDockerデーモンにポート番号をマッピングさせるために、`EXPOSE`を使用して所定のポート番号を指定することである。

```docker
# 最新のLTSのバージョンを指定する
FROM node:14.15.4-slim

# アプリケーション用のディレクトリを設定する
WORKDIR /home/src/app

# アプリケーションの依存関係をインストールする
# package.json と package-lock.json から依存関係をインストールする
COPY package*.json ./

RUN npm install
# 本番用のコードの場合は以下を使用する
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
COPY . .

# ポート番号を解放する
EXPOSE 8080

# コンテナ起動時に実行するコマンドを設定する
CMD ["node", "app.js"]
```

なお上記のファイルだけを使用すると、ローカルの依存関係もインストールされてしまうため、以下のように`.dockerignore`を設定する必要がある。

```
node_modules
npm-debug.log
```

### Non-root User

Dockerは、デフォルトでは`root`権限でコンテナを立ち上げてしまうため、セキュリティ上の問題が発生する可能性がある。
公式の`node`イメージでは、ユーザーとして`node`が定義されており、このユーザーを使用することで`root`権限の問題を回避することができる。

このためには2つのやり方が存在している。

- コンテナ立ち上げ時のコマンドで指定する
  
  - 実行コマンドでユーザーを指定する
    
  ```bash
  $ -u "node"
  ```

- Dockerfileで`USER`を設定する

  ```docker
  FROM node:6.10.3

  # イメージをコンテナ化する際にユーザーを設定する
  USER node
  ```

注意点としては`node`ユーザーは、イメージのビルド時の依存関係も、ランタイム時の依存関係も有していないため、ユーザーを削除したり変更したりすることが可能である。

実際に削除は以下のように実行できる。

```docker
# For debian based images use:
RUN userdel -r node

# For alpine based images use:
RUN deluser --remove-home node
```

ユーザーIDやグループIDを変更することも可能である。

```docker
RUN groupmod -g 999 node && \
    usermod -u 999 -g 999 node
```

ただし`alpine`ベースのイメージの場合には、以前のユーザーを削除するためにはユーザーIDやグループIDを削除する必要がある。

```docker
RUN deluser --remove-home node && \
    addgroup -S node -g 999 && \
    adduser -S -G node -u 999 node
```

## 参考資料

- Docker公式資料
  - [Best practices for Writing Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
  - [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
  - [About storage driver](https://docs.docker.com/storage/storagedriver/)
- そのほか
  - [Dockerfile のベストプラクティス](https://docs.docker.jp/engine/articles/dockerfile_best-practice.html)
  - [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
  - [Node.js Web アプリケーションを Docker 化する](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)
  - [Docker best practices with Node.js](https://dev.to/nodepractices/docker-best-practices-with-node-js-4ln4)