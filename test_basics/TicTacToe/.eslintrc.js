module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    browser: true,
    es6: true,
    // '"module" is not defined'を抑制する
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['.storybook/**', '**/*.stories.tsx', '**/*.test.ts'],
      },
    ],
  },
};
