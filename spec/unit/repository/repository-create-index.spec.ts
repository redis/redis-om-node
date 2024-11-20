import '../../helpers/custom-matchers'
import '../helpers/mock-indexer'

import { RediSearchSchema, SchemaFieldTypes } from 'redis'
import { mockRedis } from '../helpers/mock-redis'

import { RedisConnection } from '$lib/client'
import { buildRediSearchSchema } from '$lib/indexer'
import { Repository } from '$lib/repository'

import { simpleSchema, stopWordsOffSchema, customStopWordsSchema } from '../helpers/test-entity-and-schema'

const bogusSchema: RediSearchSchema = {
  foo: { type: SchemaFieldTypes.TAG },
  bar: { type: SchemaFieldTypes.TEXT }
}

describe('Repository', () => {
  let redis: RedisConnection
  let repository: Repository

  beforeEach(() => {
    redis = mockRedis()
  })

  describe('#createIndex', () => {
    describe('with a simple schema', () => {
      beforeEach(() => {
        repository = new Repository(simpleSchema, redis)
      })

      describe("and an index that doesn't exist", () => {
        beforeEach(async () => {
          vi.mocked(redis.get).mockResolvedValue(null)
          vi.mocked(buildRediSearchSchema).mockReturnValue(bogusSchema)
          await repository.createIndex()
        })

        it('asks the redis for the index hash', () =>
          expect(redis.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it('asks the index builder to build the index', () =>
          expect(buildRediSearchSchema).toHaveBeenCalledWith(simpleSchema))

        it('asks the redis to create the index with data from the schema', () => {
          const { indexName, dataStructure, schemaName: prefix } = simpleSchema
          expect(redis.ft.create).toHaveBeenCalledWith(indexName, bogusSchema, {
            ON: dataStructure,
            PREFIX: `${prefix}:`
          })
        })

        it('asks the redis to write the index hash', () =>
          expect(redis.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash))
      })

      describe('and an index that exists and is the same', () => {
        beforeEach(async () => {
          vi.mocked(redis.get).mockResolvedValue(simpleSchema.indexHash)
          await repository.createIndex()
        })

        it('asks the redis for the index hash', () =>
          expect(redis.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it("doesn't ask the redis to remove the current index", () => expect(redis.ft.dropIndex).not.toHaveBeenCalled())

        it("doesn't ask the redis to remove the index hash", async () => expect(redis.unlink).not.toHaveBeenCalled())

        it("doesn't ask the index builder to build the index", () =>
          expect(buildRediSearchSchema).not.toHaveBeenCalledWith())

        it('does not ask the redis to create the index with data from the schema', () =>
          expect(redis.ft.create).not.toHaveBeenCalled())

        it('does not asks the redis to write the index hash', () => expect(redis.set).not.toHaveBeenCalled())
      })

      describe('and an index that exists and is different', () => {
        beforeEach(async () => {
          vi.mocked(redis.get).mockResolvedValue('A_MISMATCHED_INDEX_HASH')
          vi.mocked(buildRediSearchSchema).mockReturnValue(bogusSchema)
          await repository.createIndex()
        })

        it('asks the redis for the index hash', () =>
          expect(redis.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it('asks the redis to remove the current index', () =>
          expect(redis.ft.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName))

        it('asks the redis to remove the index hash', async () =>
          expect(redis.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it('asks the index builder to build the index', () =>
          expect(buildRediSearchSchema).toHaveBeenCalledWith(simpleSchema))

        it('asks the redis to create a new index with data from the schema', () => {
          const { indexName, dataStructure, schemaName: prefix } = simpleSchema
          expect(redis.ft.create).toHaveBeenCalledWith(indexName, bogusSchema, {
            ON: dataStructure,
            PREFIX: `${prefix}:`
          })
        })

        it('asks the redis to write the index hash', () =>
          expect(redis.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash))
      })
    })

    describe('with stop words turned off', () => {
      beforeEach(async () => {
        repository = new Repository(stopWordsOffSchema, redis)
        await repository.createIndex()
      })

      it('asks the redis to create the index with data from the schema', () => {
        const { indexName, dataStructure, schemaName: prefix, stopWords } = stopWordsOffSchema
        expect(redis.ft.create).toHaveBeenCalledWith(indexName, bogusSchema, {
          ON: dataStructure,
          PREFIX: `${prefix}:`,
          STOPWORDS: stopWords
        })
      })
    })

    describe('with custom stop words', () => {
      beforeEach(async () => {
        repository = new Repository(customStopWordsSchema, redis)
        await repository.createIndex()
      })

      it('asks the redis to create the index with data from the schema', () => {
        const { indexName, dataStructure, schemaName: prefix, stopWords } = customStopWordsSchema
        expect(redis.ft.create).toHaveBeenCalledWith(indexName, bogusSchema, {
          ON: dataStructure,
          PREFIX: `${prefix}:`,
          STOPWORDS: stopWords
        })
      })
    })
  })
})
