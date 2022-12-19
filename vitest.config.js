import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	test: {
		globals: true,
		clearMocks: true,
		isolate: true,
		threads: true,
		coverage: {
			provider: 'c8',
			exclude: ['spec/*'],
		},
		exclude: ['./node_modules/**'],
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './lib'),
		},
	},
})
