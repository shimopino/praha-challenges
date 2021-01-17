# Docker-Composeの基礎

<!-- START doctoc -->
<!-- END doctoc -->

## Composeの始め方

Docker-Composeを使用する場合は、以下の手順で各ファイルを作成していけばいい。

1. 1つのアプリ環境を`Dockerfile`で定義する
2. 複数のアプリを1つのサービスとして提供するための環境を`docker-compose.yml`で定義する
3. `docker-compose up`でサービスを開始する 

実際の`docker-compose.yml`は以下のような構造になっている。

```yml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
      - logvolume01:/var/log
    links:
      - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```



### command

Composeファイル内には、デフォルトで実行されるコマンドを変更することが可能である。

```yml
services:
  web:
    build: .
    command: node app.js
```

また、`&&`を使用することで複数のコマンドを連結させて実行することも可能である。

``yml
services:
  web:
    build: .
    command: >
      bash -c "node app.js
      && ngrok http -host-header='0.0.0.0:8080' 8080"
```

- [command](https://docs.docker.com/compose/compose-file/compose-file-v3/#command)

## references

- [Overview of Docker Compose](https://docs.docker.com/compose/)
- [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)
