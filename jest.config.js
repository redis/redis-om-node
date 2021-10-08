module.exports = {
  projects: [{
    displayName: "unit",
    roots: [ "<rootDir>/lib/", "<rootDir>/spec/" ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
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
    roots: [ "<rootDir>/lib/", "<rootDir>/functional/" ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
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
