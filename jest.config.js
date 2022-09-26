/* eslint-env node */
module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'jsdom',
   transform: {
      '^.+\\.ts?$': 'ts-jest',
   },
   transformIgnorePatterns: ['<rootDir>/node_modules/'],
   testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
   moduleNameMapper: {
      '@components(.*)': '<rootDir>/src/components$1'
   },
   moduleDirectories: ['node_modules', 'src'],
   setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
