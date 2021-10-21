module.exports = {
  projects: [{
    displayName: "unit",
    roots: [ "<rootDir>/lib/", "<rootDir>/spec/unit/" ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage/unit",
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
    collectCoverage: true,
    coverageDirectory: "coverage/functional",
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
