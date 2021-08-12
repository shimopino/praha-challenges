# React Tutorial

## Environment

### Initial Setup

下記のコマンドを使用してプロジェクトを立ち上げる。

```bash
npx create-react-app tutorial --use-npm --template typescript
```

これで下記の構造で初期化が行われる。

```bash
tutorial
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
└── tsconfig.json
```

### ESLint & Prettier

`ESLint` の設定は [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) に記載されている手順に従う。

```bash
# ESLint に必要なライブラリをインストールする
npm install --save-dev eslint @typescript-eslint/{parser,eslint-plugin}

# Prettier に必要なライブラリをインストールする
npm install --save-dev prettier eslint-config-prettier

# テストひ必要なライブラリをインストールする
npm install --save-dev eslint-plugin-jest
```

設定を `.eslintrc.js` に記述する。

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
};
```

解析をしないファイルは `.eslintignore` に追加しておく。

```
# don't ever lint node_modules
node_modules
# don't lint build output (make sure it's set to your correct build folder name)
dist
# don't lint nyc coverage output
coverage
```

`package.json` に解析を起動するためのコマンドを追加する。

```js
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
}
```

### CSS

CSS Modules を使用してスタイリングを行っていく。

なお SASS も使用するが、これは公式ページに記載されている [`node-sass`](https://github.com/sass/node-sass) ではなく、[`dart-sass`](https://github.com/sass/dart-sass) を使用する。

`index.module.scss` のようなファイル名に変更すれば、コンポーネントから読み取ることができる。

また CSS に対してスタイル解析ツールである [`stylelint`](https://stylelint.io/user-guide/get-started) を使用する。

```bash
npm install --save-dev stylelint stylelint-config-standard
```

`stylelint.config.js` に下記を記載する。

```js
module.exports = {
  extends: 'stylelint-config-standard',
};
```

`package.json` に解析を起動するコマンドを追加する。

```bash
{
  "scripts": {
    "style": "npx stylelint \"**/*.module.scss\""
  }
}
```

