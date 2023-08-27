import { defineConfig } from 'vitest/config'
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    isolate: false,
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "spec/*",
        "src/typings/*"
      ]
    }
  },
  resolve: {
    alias: {
      "$lib": path.resolve(__dirname, "./lib"),
    },
  },
})
