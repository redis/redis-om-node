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
  collectCoverage: false,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  detectOpenHandles: true
}
