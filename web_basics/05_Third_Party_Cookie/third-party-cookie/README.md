<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [How to Reproduce](#how-to-reproduce)
  - [VSCode の Remote Container を使用する](#vscode-%E3%81%AE-remote-container-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)
  - [VSCode に依存しない方法](#vscode-%E3%81%AB%E4%BE%9D%E5%AD%98%E3%81%97%E3%81%AA%E3%81%84%E6%96%B9%E6%B3%95)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# How to Reproduce

## VSCode の Remote Container を使用する

- VSCode では対応する Workspace に `./devcontainer/devcontainer.json` でDocker コンテナの起動環境を設定できる
  - 具体的には以下を配置する

    ```json
    // For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
    // https://github.com/microsoft/vscode-dev-containers/tree/v0.154.2/containers/javascript-node
    {
        "name": "Node.js",
        "build": {
            "context": "..",
            "dockerfile": "../Dockerfile",
            // Update 'VARIANT' to pick a Node version: 10, 12, 14
            "args": { "VARIANT": "14" }
        },

        // Set *default* container specific settings.json values on container create.
        "settings": { 
            "terminal.integrated.shell.linux": "/bin/bash"
        },

        // Add the IDs of extensions you want installed when the container is created.
        "extensions": [
            "dbaeumer.vscode-eslint",
            "esbenp.prettier-vscode",
            "hediet.vscode-drawio",
            "humao.rest-client",
            "coenraads.bracket-pair-colorizer"
        ],

        // Use 'forwardPorts' to make a list of ports inside the container available locally.
        // "forwardPorts": [],

        "appPort": [
            9080,
            9090,
        ],

        // Use 'postCreateCommand' to run commands after the container is created.
        // "postCreateCommand": "yarn install",

        // Comment out connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
        "remoteUser": "node"
    }
    ```

  - VSCode から `Remote-Containers: Open Folder in Container...` を選択する
  - あとは Node と ngrok を起動する
    - `$ npm test`
    - `$ ngrok http -host-header="0.0.0.0:8090" 8090`

## VSCode に依存しない方法

- Docker CLIからコンテナの起動、Nodeの起動までを行う
  - Docker Imageの生成
    ```bash
    $ docker build -t third-party .
    ```
  - Docker Containerの起動
    ```bash
    $ docker container run \
        -itd \
        -p 8080:8080 \
        -p 8090:8090 \
        -v $(pwd):/home/app \
        --rm \
        --name third-party-sample \
        third-party
    ```
  - Bashプロセスの起動
    ```bash
    $ docker container exec -it third-party-sample bash
    ```
  - Nodeをバックグラウンドで起動
    ```bash
    $ npm run test-https
    ```
  - ngrokの起動
    ```bash
    $ ngrok http -host-header="0.0.0.0:8090" 8090
    ```
  - URLの修正
