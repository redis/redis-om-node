module.exports = {
  roots: [
    "<rootDir>/lib/",
    "<rootDir>/spec/"
  ],
  testMatch: [
    "**/*.spec.ts"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  setupFilesAfterEnv: [
    '<rootDir>/spec/spec-helper.ts'
  ],
  collectCoverage: false,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  detectOpenHandles: true
}
