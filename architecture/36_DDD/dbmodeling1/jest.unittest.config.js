// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.common.config');

module.exports = {
  ...defaultConfig,
  // デフォルト設定では [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
  // テストファイルの配置場所を指定する
  testMatch: ['**/__tests__/**/*.spec.[jt]s'],
  // デフォルト設定では ["/node_modules/"]
  // 結合テスト用のファイルは除外する
  testPathIgnorePatterns: ['integration'],
  // デフォルト設定では undefined
  collectCoverageFrom: ['**/*.(t|j)s'],
};
