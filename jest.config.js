module.exports = {
  projects: [{
    displayName: "unit",
    roots: [ "<rootDir>/src/", "<rootDir>/test/unit/" ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        diagnostics: true
      },
    },
    setupFilesAfterEnv: [ "<rootDir>/test/helpers/custom-matchers.ts" ],
    testMatch: [ "**/*.spec.ts" ],
    transform: { "^.+\\.ts$": "ts-jest" },
    detectOpenHandles: true
  }, {
    displayName: "functional",
    roots: [ "<rootDir>/src/", "<rootDir>/test/functional/" ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        diagnostics: true
      },
    },
    setupFilesAfterEnv: [ "<rootDir>/test/helpers/custom-matchers.ts" ],
    testMatch: [ "**/*.spec.ts" ],
    transform: { "^.+\\.ts$": "ts-jest" },
    detectOpenHandles: true
  }]
};
