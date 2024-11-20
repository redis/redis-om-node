import { mockRedis } from '../helpers/mock-redis'

import { RedisConnection } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema'

const simpleSchema = new Schema('SimpleEntity', {}, { dataStructure: 'HASH' })

describe('Repository', () => {
  describe('#expire', () => {
    let redis: RedisConnection
    let repository: Repository

    beforeEach(() => {
      redis = mockRedis()
      repository = new Repository(simpleSchema, redis)
    })

    it('expires a single entity', async () => {
      await repository.expire('foo', 60)
      expect(redis.expire).toHaveBeenCalledWith('SimpleEntity:foo', 60)
    })

    it('expires a multiple entities', async () => {
      await repository.expire(['foo', 'bar', 'baz'], 60)
      expect(redis.expire).toHaveBeenNthCalledWith(1, 'SimpleEntity:foo', 60)
      expect(redis.expire).toHaveBeenNthCalledWith(2, 'SimpleEntity:bar', 60)
      expect(redis.expire).toHaveBeenNthCalledWith(3, 'SimpleEntity:baz', 60)
    })
  })
})
