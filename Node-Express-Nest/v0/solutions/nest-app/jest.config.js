module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**']
};
