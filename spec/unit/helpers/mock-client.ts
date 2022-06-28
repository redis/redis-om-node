import { vi } from 'vitest'

export const client = {
  use: vi.fn(),
  open: vi.fn(),
  close: vi.fn(),
  execute: vi.fn(),
  fetchRepository: vi.fn(),
  createIndex: vi.fn(),
  dropIndex: vi.fn(),
  search: vi.fn(),
  unlink: vi.fn(),
  expire: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  hgetall: vi.fn(),
  hsetall: vi.fn(),
  jsonget: vi.fn(),
  jsonset: vi.fn(),
}


vi.mock('../../../lib/client', () => ({
  default: vi.fn(() => client)
}))