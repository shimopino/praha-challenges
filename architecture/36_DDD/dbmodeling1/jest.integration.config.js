// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.common.config');

module.exports = {
  ...defaultConfig,
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.e2e-spec.[jt]s'],
};
