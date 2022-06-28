import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    isolate: false,
    coverage: {
      exclude: [
        'spec/*'
      ]
    },
    exclude: [
      './node_modules/**',
    ]
  },
})