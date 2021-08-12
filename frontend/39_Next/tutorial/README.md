<<<<<<< HEAD
# NextJS Tutorial
=======
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境設定](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)
  - [Initial Setup](#initial-setup)
  - [ESLint & Prettier](#eslint--prettier)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
>>>>>>> c4abbc1973906355d977400930a78986fec47f8f

## 環境設定

### Initial Setup

下記のコマンドを使用して `Next.js` のプロジェクトを立ち上げた。

```bash
npx create-next-app tutorial --use-npm --typescript
```

これで下記の初期フォルダが設定される。

```bash
.
├── README.md
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── _app.tsx
│   ├── api
│   │   └── hello.ts
│   └── index.tsx
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│   ├── Home.module.css
│   └── globals.css
└── tsconfig.json
```

### ESLint & Prettier

`ESLint` はデフォルトで設定されているため、追加で `Prettier` を有効化する。

まずは必要なライブラリをインストールする。

```bash
npm install --save-dev prettier eslint-config-prettier
```

次に設定ファイル (`.eslintrc.js`) を以下のように編集する。

```js
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
};
```

これでコードの静的解析によるスタイル統一はできるようになった。

## Next.js

### Server-Side Rendering の動作検証

まずは `pages` 以下に配置されている内容は、デフォルトで `SSR` されるのか検証するために、下記のような簡単なファイルを作成し、実際にブラウザに送信される HTML ファイルの中身を検証する

```ts
// pages/index.tsx
import { NextPage } from 'next';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Hello Next App</h1>
    </div>
  );
};

export default Home;
```

HTML ボディの一部だけ載せておくが、確かにブラウザで HTML ファイルを受け取っている時点で、設定した内容がレンダリングされていることがわかる。

```html
<body>
  <div id="__next">
    <!-- クラス名には CSS Module による乱数が設定されている -->
    <div class="Home_container__1EcsU"><h1>Hello Next App</h1></div>
  </div>
</body>
```
