import { vi } from 'vitest'

export const ft: any = {}
ft.create = vi.fn()
ft.search = vi.fn()
ft.dropIndex = vi.fn()

export const json: any = {}
json.get = vi.fn()
json.set = vi.fn()

export const multi: any = {}
multi.unlink = vi.fn().mockImplementation(() => multi)
multi.hSet = vi.fn().mockImplementation(() => multi)
multi.exec = vi.fn()

export const redis: any = {}
redis.ft = ft
redis.json = json
redis.connect = vi.fn().mockResolvedValue(redis)
redis.quit = vi.fn()
redis.get = vi.fn()
redis.set = vi.fn()
redis.hGetAll = vi.fn()
redis.expire = vi.fn()
redis.expireAt = vi.fn()
redis.sendCommand = vi.fn()
redis.unlink = vi.fn()
redis.multi = vi.fn().mockImplementation(() => multi)

export const createClient = vi.fn(() => redis)

vi.mock('redis', () => ({ createClient }))
