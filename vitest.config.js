import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    isolate: false,
    exclude: [
      './node_modules/**',
    ]
  },
})