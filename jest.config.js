module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/__tests__/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};