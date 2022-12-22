import { vi } from 'vitest'

vi.mock('$lib/indexer', () => ({
  buildRediSearchSchema: vi.fn()
}))

