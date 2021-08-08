module.exports = {
  // デフォルト設定では {"\\.[jt]sx?$": "babel-jest"}
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  // デフォルト設定では {testEnvironment: "node"}
  testEnvironment: 'node',
  // デフォルト設定では {roots: ["<rootDir>"]}
  // テストファイルを配置している場所を指定する
  roots: ['<rootDir>/src'],
  // デフォルト設定では {moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"]}
  moduleFileExtensions: ['js', 'ts'],
  // デフォルト設定では {moduleFileMapper: null}
  // import する際のファイル配置場所とファイル名のマッピングを行う
  moduleFileMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: './coverage',
};
