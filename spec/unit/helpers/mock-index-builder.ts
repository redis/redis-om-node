import { vi } from 'vitest'

vi.mock('$lib/index-builder/index-builder', () => ({
  buildRediSearchIndex: vi.fn()
}))

