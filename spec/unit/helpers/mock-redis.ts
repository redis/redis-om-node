import { RedisConnection } from '$lib/client'
import { vi } from 'vitest'

export function mockRedis(): RedisConnection {
  const ft = {
    create: vi.fn(),
    search: vi.fn(),
    dropIndex: vi.fn()
  }

  const json = {
    get: vi.fn(),
    set: vi.fn()
  }

  const multi: any = {}
  multi.unlink = vi.fn().mockImplementation(() => multi)
  multi.hSet = vi.fn().mockImplementation(() => multi)
  multi.exec = vi.fn()

  const redis: any = {}
  redis.ft = ft
  redis.json = json
  redis.multi = vi.fn().mockImplementation(() => multi)
  redis.quit = vi.fn()
  redis.get = vi.fn()
  redis.set = vi.fn()
  redis.hGetAll = vi.fn()
  redis.expire = vi.fn()
  redis.expireAt = vi.fn()
  redis.sendCommand = vi.fn()
  redis.unlink = vi.fn()

  return redis as unknown as RedisConnection
}
