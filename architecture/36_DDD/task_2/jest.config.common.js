module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],
  // alias で import してもOKにするためモジュール参照設定を追加
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@testUtil/(.*)$': '<rootDir>/testUtil/$1',
  },
  coverageDirectory: './coverage/',
};
