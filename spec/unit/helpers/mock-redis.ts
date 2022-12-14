import { vi } from 'vitest'

export const redis = {
  connect: vi.fn(),
  quit: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  hGetAll: vi.fn(),
  expire: vi.fn(),
  sendCommand: vi.fn(),
  executeIsolated: vi.fn(),
  unlink: vi.fn(),
}

export const createClient = vi.fn(() => redis)

vi.mock('redis', () => ({ createClient }))
