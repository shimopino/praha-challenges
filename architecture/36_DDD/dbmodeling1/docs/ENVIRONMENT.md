# 環境構築手順

## プロジェクトのセットアップ

### 使用するライブラリのインストール

```bash
# nestのインストール
npm install -g @nestjs/cli

# DBモデリングのプロジェクトを作成
nest new dbmodeling1

# prismaのインストール
npm install --save-dev prisma

# PrismaClientのインストール
npm install @prisma/client

#  環境変数を切り替える dotenv-cli をインストール
# https://www.prisma.io/docs/concepts/more/environment-variables/using-multiple-env-files
npm install --save-dev dotenv-cli
```
