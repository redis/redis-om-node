import { vi } from 'vitest'

export const ft = {
  create: vi.fn(),
  search: vi.fn(),
  dropIndex: vi.fn()
}

export const json = {
  get: vi.fn(),
  set: vi.fn()
}

export const redis = {
  ft,
  json,
  connect: vi.fn(),
  quit: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  hGetAll: vi.fn(),
  expire: vi.fn(),
  sendCommand: vi.fn(),
  unlink: vi.fn(),
  multi: vi.fn().mockImplementation(() => multi)
}

export const multi = {
  unlink: vi.fn().mockImplementation(() => multi),
  hSet: vi.fn().mockImplementation(() => multi),
  exec: vi.fn().mockImplementation(() => redis)
}

export const createClient = vi.fn(() => redis)

vi.mock('redis', () => ({ createClient }))
