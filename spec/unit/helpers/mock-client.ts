import { vi } from 'vitest'

import { Client } from '$lib/client'

export const client = Object.create(Client.prototype)

client.use = vi.fn()
client.useNoClose = vi.fn()
client.open = vi.fn()
client.close = vi.fn()
client.execute = vi.fn()
client.fetchRepository = vi.fn()
client.createIndex = vi.fn()
client.dropIndex = vi.fn()
client.search = vi.fn()
client.unlink = vi.fn()
client.expire = vi.fn()
client.get = vi.fn()
client.set = vi.fn()
client.hgetall = vi.fn()
client.hsetall = vi.fn()
client.jsonget = vi.fn()
client.jsonset = vi.fn()

vi.mock('$lib/client', () => ({
  Client: vi.fn(() => client)
}))
