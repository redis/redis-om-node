import '../../helpers/custom-matchers'
import { createClient } from '../helpers/mock-redis'

import { RedisConnection } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema'

const simpleSchema = new Schema('SimpleEntity', {}, { dataStructure: 'HASH' })

describe('Repository', () => {
  let redis: RedisConnection
  let repository: Repository

  describe('#dropIndex', () => {
    beforeAll(async () => {
      redis = await createClient().connect()
    })

    beforeEach(() => {
      repository = new Repository(simpleSchema, redis)
    })

    describe('when the index exists', () => {
      beforeEach(async () => await repository.dropIndex())

      it('asks the redis to drop the index', async () =>
        expect(redis.ft.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName))

      it('asks the redis to remove the index hash', async () =>
        expect(redis.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName))
    })

    describe("when the index doesn't exist", () => {
      beforeEach(async () => {
        vi.mocked(redis.ft.dropIndex).mockRejectedValue(Error('Unknown index name'))
      })

      it('eats the exception', async () => await repository.dropIndex()) // it doesn't throw an exception
    })

    describe("when the index doesn't exist for newer versions of Redis", () => {
      beforeEach(async () => {
        vi.mocked(redis.ft.dropIndex).mockRejectedValue(Error('Unknown index name'))
      })

      it('eats the exception', async () => await repository.dropIndex()) // it doesn't throw an exception
    })

    describe('when dropping the index throws some other Redis exception', () => {
      beforeEach(async () => {
        vi.mocked(redis.ft.dropIndex).mockRejectedValue(Error('Some other error'))
      })

      it('propogates the exception', async () =>
        expect(async () => await repository.dropIndex()).rejects.toThrowErrorOfType(Error, 'Some other error'))
    })
  })
})
