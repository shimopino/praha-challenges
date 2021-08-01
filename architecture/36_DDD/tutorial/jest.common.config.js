module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    // テストファイル内で使用する関数やクラスの名前空間と
    // ファイルのパスを紐づける
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@testUtil/(.*)$': '<rootDir>/testUtil/$1',
  },
  coverageDirectory: './coverate//',
};
