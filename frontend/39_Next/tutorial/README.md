<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [環境設定](#%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)
  - [Initial Setup](#initial-setup)
  - [ESLint & Prettier](#eslint--prettier)
- [Next.js](#nextjs)
  - [Server-Side Rendering の動作検証](#server-side-rendering-%E3%81%AE%E5%8B%95%E4%BD%9C%E6%A4%9C%E8%A8%BC)
  - [File-based Routing](#file-based-routing)
  - [Dynamic-Routing Path](#dynamic-routing-path)
  - [Link to Page](#link-to-page)
  - [Custom Error Page](#custom-error-page)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

### File-based Routing

`Next.js` では、`pages` フォルダ以下にコンポーネントを配置することで、ファイル名をベースにレンダリングを行うことができる。

例えば以下のようなファイル構造になっている場合、それぞれファイル名に従う URL にアクセスすれば、ページが表示されることがわかる。

```bash
/pages
├── index.tsx       # http://localhost:3000/
├── about.tsx       # http://localhost:3000/about
└── /users
    ├── index.tsx   # http://localhost:3000/users
    └── [id].tsx    # http://localhost:3000/users/1
```

> `/pages/about.tsx` は `/pages/about/index.tsx` と同等である

また、`[id]` のようなファイル名にすることで、URL が動的に変化する場合のページを作成することができる。

### Dynamic-Routing Path

動的ルーティングを行った場合、`useRouter()` を使用することで、ルーティングを行った際の情報を取得することができる。

ここから `query` を選択すれば、URL からファイル名に従う動的に変化する ID を取得することができる。

```ts
// /pages/users/[userId].tsx

import { NextPage } from 'next';
import { useRouter } from 'next/router';

const UserPage: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const userId = router.query.userId;

  // http://localhost:3000/users/10 の場合、
  // { userId: 10 } というオブジェクトが `query` に格納されている
  console.log(query);

  // http://localhost:3000/users/10 の場合、変数には 10 が格納されている
  console.log(userId);

  return (
    <div>
      <h1>The User Page: {userId}</h1>
    </div>
  );
};

export default UserPage;
```

複数の動的ルーティングが含まれている場合でも、同じ方法でページの ID を取得することができる。

例えば以下のようなファイル構造を考える。

```bash
/pages
└── collections
    ├── index.tsx
    └── [collectionId]
        ├── index.tsx
        └── [bookId].tsx
```

このとき、`[bookId].tsx` では下記のような方法で URL の情報を取得する。

```ts
const BookPage: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  const collectionId = query.collectionId;
  const bookId = query.bookId;

  return (
    <div>
      <h1>
        The Book of {bookId} in the Collection: {collectionId}
      </h1>
    </div>
  );
};
```

### Link to Page

直接 URL を入力してアクセスする以外にも、HTML での `<a>` タグに相当する機能を `Next.js` は有している。

例えば以下のように使用することで、指定した URL に対するリンクを作成することができる。

```ts
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Hello Next App</h1>
      <ul>
        <li>
          <Link href="/users">Users Page</Link>
        </li>
        <li>
          <Link href="/collections">Collections Page</Link>
        </li>
      </ul>
    </div>
  );
};
```

通常の `<a>` タグと異なる点は、ルーティングを行う際に HTTP リクエストを伴わない点である。

### Custom Error Page

`/pages` 直下に `404.tsx` を配置することで、自作の 404 エラーページを作成することができる。

```ts
// /pages/404.tsx
const NotFoundPage: NextPage = () => {
  return (
    <div>
      <h1>Page not Found!</h1>
    </div>
  );
};
```
