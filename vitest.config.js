import { defineConfig } from 'vitest/config'
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    isolate: false,
    coverage: {
      provider: 'istanbul',
      exclude: [
        'spec/*'
      ]
    },
    exclude: [
      './node_modules/**',
    ]
  },
  resolve: {
    alias: {
      "$lib": path.resolve(__dirname, "./lib"),
    },
  },
})
