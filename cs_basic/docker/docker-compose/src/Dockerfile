# 最新のLTSのバージョンを指定する
FROM node:14.15.4-slim
# ポート番号を環境変数に設定する
ENV PORT=8080
ENV HOME=/home/src/app

# 必要なパッケージをインストールする
RUN apt-get update && apt install -y \
    wget \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ngrokをインストールする
RUN wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip \
    && unzip ngrok-stable-linux-amd64.zip \
    && mv ngrok /usr/local/bin \
    && rm -rf ngrok-stable-linux-amd64.zip

RUN mkdir -p ${HOME}/.npm-global && npm config set prefix '${HOME}/.npm-global' && \
    export PATH=${HOME}/.npm-global/bin:$PATH

RUN chown node ${HOME}

# ユーザー設定を追加する
USER node

# アプリケーション用のディレクトリを設定する
WORKDIR ${HOME}

# アプリケーションの依存関係をインストールする
# package.json と package-lock.json から依存関係をインストールする
COPY package*.json ./

# RUN mkdir ${HOME}/.npm-global && npm config set prefix '${HOME}/.npm-global' && \
#     export PATH=${HOME}/.npm-global/bin:$PATH && \
#     cd ${HOME} && npm install
RUN npm install
# 本番用のコードの場合は以下を使用する
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
COPY . .

# ポート番号を解放する
EXPOSE ${PORT}

# コンテナ起動時に実行するコマンドを設定する
CMD ["node", "app.js"]