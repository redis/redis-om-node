import { defineConfig } from 'vitest/config'
import path from "path"

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
  resolve: {
    alias: {
      "$lib": path.resolve(__dirname, "./lib"),
    },
  },
})