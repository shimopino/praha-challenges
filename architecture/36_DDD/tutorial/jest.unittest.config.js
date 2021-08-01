// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.common.config');

module.exports = {
  ...defaultConfig,
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/*.test.[jt]s'],
  testPathIgnorePatterns: ['integration'],
  collectCoverageFrom: ['**/*.(t|j)s'],
};
