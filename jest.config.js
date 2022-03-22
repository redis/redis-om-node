module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  projects: [{
    displayName: "unit",
    roots: [ "<rootDir>/lib/", "<rootDir>/spec/unit/" ],
    clearMocks: true,
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        diagnostics: true
      },
    },
    testMatch: [ "**/*.spec.ts" ],
    transform: { "^.+\\.ts$": "ts-jest" },
    detectOpenHandles: true
  }, {
    displayName: "functional",
    roots: [ "<rootDir>/lib/", "<rootDir>/spec/functional/" ],
    clearMocks: true,
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        diagnostics: true
      },
    },
    testMatch: [ "**/*.spec.ts" ],
    transform: { "^.+\\.ts$": "ts-jest" },
    detectOpenHandles: true
  }]
};
