import { vi } from 'vitest'

vi.mock('$lib/schema/schema-builder', () => ({
  buildRediSearchIndex: vi.fn()
}))

