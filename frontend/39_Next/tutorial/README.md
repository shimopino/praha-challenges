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

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
