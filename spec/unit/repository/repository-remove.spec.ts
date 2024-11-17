import { createClient } from '../helpers/mock-redis'

import { RedisConnection } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema'

const simpleSchema = new Schema('SimpleEntity', {}, { dataStructure: 'HASH' })

describe('Repository', () => {
  describe('#remove', () => {
    let redis: RedisConnection
    let repository: Repository

    beforeAll(async () => {
      redis = await createClient().connect()
    })

    beforeEach(() => {
      repository = new Repository(simpleSchema, redis)
    })

    it('removes no entities', async () => {
      await repository.remove()
      expect(redis.unlink).not.toHaveBeenCalled()
    })

    it('removes a single entity', async () => {
      await repository.remove('foo')
      expect(redis.unlink).toHaveBeenCalledWith(['SimpleEntity:foo'])
    })

    it('removes multiple entities', async () => {
      await repository.remove('foo', 'bar', 'baz')
      expect(redis.unlink).toHaveBeenCalledWith(['SimpleEntity:foo', 'SimpleEntity:bar', 'SimpleEntity:baz'])
    })

    it('removes multiple entities discretely', async () => {
      await repository.remove(['foo', 'bar', 'baz'])
      expect(redis.unlink).toHaveBeenCalledWith(['SimpleEntity:foo', 'SimpleEntity:bar', 'SimpleEntity:baz'])
    })
  })
})
