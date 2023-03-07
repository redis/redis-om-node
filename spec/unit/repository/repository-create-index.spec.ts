import '../helpers/mock-client'
import '../helpers/mock-indexer'

import { RediSearchSchema, SchemaFieldTypes } from 'redis'

import { Client } from '$lib/client'
import { buildRediSearchSchema } from '$lib/indexer'
import { Repository } from '$lib/repository'

import { simpleSchema, stopWordsOffSchema, customStopWordsSchema } from '../helpers/test-entity-and-schema'

const bogusSchema: RediSearchSchema = {
  foo: { type: SchemaFieldTypes.TAG },
  bar: { type: SchemaFieldTypes.TEXT }
}

describe("Repository", () => {

  let client: Client
  let repository: Repository

  beforeAll(() => { client = new Client() })

  describe("#createIndex", () => {
    describe("with a simple schema", () => {

      beforeEach(() => { repository = new Repository(simpleSchema, client) })

      describe("and an index that doesn't exist", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue(null)
          vi.mocked(buildRediSearchSchema).mockReturnValue(bogusSchema)
          await repository.createIndex()
        })

        it("asks the client for the index hash", () =>
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it("asks the index builder to build the index", () =>
          expect(buildRediSearchSchema).toHaveBeenCalledWith(simpleSchema))

        it("asks the client to create the index with data from the schema", () => {
          const { indexName, dataStructure, schemaName: prefix } = simpleSchema
          expect(client.createIndex).toHaveBeenCalledWith(indexName, bogusSchema, {
            ON: dataStructure,
            PREFIX: `${prefix}:`
          })
        })

        it("asks the client to write the index hash", () =>
          expect(client.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash))
      })

      describe("and an index that exists and is the same", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue(simpleSchema.indexHash)
          await repository.createIndex()
        })

        it("asks the client for the index hash", () =>
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it("doesn't ask the client to remove the current index", () =>
          expect(client.dropIndex).not.toHaveBeenCalled())

        it("doesn't ask the client to remove the index hash", async () =>
          expect(client.unlink).not.toHaveBeenCalled())

        it("doesn't ask the index builder to build the index", () =>
          expect(buildRediSearchSchema).not.toHaveBeenCalledWith())

        it("does not ask the client to create the index with data from the schema", () =>
          expect(client.createIndex).not.toHaveBeenCalled())

        it("does not asks the client to write the index hash", () =>
          expect(client.set).not.toHaveBeenCalled())
      })

      describe("and an index that exists and is different", () => {
        beforeEach(async () => {
          vi.mocked(client.get).mockResolvedValue('A_MISMATCHED_INDEX_HASH')
          vi.mocked(buildRediSearchSchema).mockReturnValue(bogusSchema)
          await repository.createIndex()
        })

        it("asks the client for the index hash", () =>
          expect(client.get).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it("asks the client to remove the current index", () =>
          expect(client.dropIndex).toHaveBeenCalledWith(simpleSchema.indexName))

        it("asks the client to remove the index hash", async () =>
          expect(client.unlink).toHaveBeenCalledWith(simpleSchema.indexHashName))

        it("asks the index builder to build the index", () =>
          expect(buildRediSearchSchema).toHaveBeenCalledWith(simpleSchema))

        it("asks the client to create a new index with data from the schema", () => {
          const { indexName, dataStructure, schemaName: prefix } = simpleSchema
          expect(client.createIndex).toHaveBeenCalledWith(indexName, bogusSchema, {
            ON: dataStructure,
            PREFIX: `${prefix}:`
          })
        })

        it("asks the client to write the index hash", () =>
          expect(client.set).toHaveBeenCalledWith(simpleSchema.indexHashName, simpleSchema.indexHash))
      })
    })

    describe("with stop words turned off", () => {

      beforeEach(async () => {
        repository = new Repository(stopWordsOffSchema, client)
        await repository.createIndex()
      })

      it("asks the client to create the index with data from the schema", () => {
        const { indexName, dataStructure, schemaName: prefix, stopWords } = stopWordsOffSchema
        expect(client.createIndex).toHaveBeenCalledWith(indexName, bogusSchema, {
          ON: dataStructure,
          PREFIX: `${prefix}:`,
          STOPWORDS: stopWords
        })
      })
    })

    describe("with custom stop words", () => {

      beforeEach(async () => {
        repository = new Repository(customStopWordsSchema, client)
        await repository.createIndex()
      })

      it("asks the client to create the index with data from the schema", () => {
        const { indexName, dataStructure, schemaName: prefix, stopWords } = customStopWordsSchema
        expect(client.createIndex).toHaveBeenCalledWith(indexName, bogusSchema, {
          ON: dataStructure,
          PREFIX: `${prefix}:`,
          STOPWORDS: stopWords
        })
      })
    })
  })
})
