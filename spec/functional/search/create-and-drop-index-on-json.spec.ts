import { createClient } from 'redis'

import { RedisConnection, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { fetchIndexHash, fetchIndexInfo, removeKeys } from '../helpers/redis-helper'

const expected = [
  { identifier: '$.root.aString', attribute: 'aString', type: 'TAG', SEPARATOR: '|' },
  { identifier: '$.root.someText', attribute: 'someText', type: 'TEXT', WEIGHT: '1', SORTABLE: 'UNF' },
  { identifier: '$.root.aNumber', attribute: 'aNumber', type: 'NUMERIC', SORTABLE: 'UNF' },
  { identifier: '$.root.aBoolean', attribute: 'aBoolean', type: 'TAG', SEPARATOR: '' },
  { identifier: '$.root.aPoint', attribute: 'aPoint', type: 'GEO' },
  { identifier: '$.root.aDate', attribute: 'aDate', type: 'NUMERIC', SORTABLE: 'UNF' },
  { identifier: '$.root.someStrings[*]', attribute: 'someStrings', type: 'TAG', SEPARATOR: '|' }
]

describe("create and drop index on JSON", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let indexInfo: any
  let indexHash: string | null

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createJsonEntitySchema('create-drop-json')
    repository = new Repository(schema, redis)
  })

  afterAll(async () => {
    await removeKeys(redis, 'create-drop-json:index:hash', 'create-drop-json-changed:index:hash')
    await repository.dropIndex()
    await redis.quit()
  })

  describe("when the index is created", () => {
    beforeEach(async () => {
      await removeKeys(redis, 'create-drop-json:index:hash', 'create-drop-json-changed:index:hash')
      await repository.createIndex()
      indexInfo = await fetchIndexInfo(redis, 'create-drop-json:index')
      indexHash = await fetchIndexHash(redis, 'create-drop-json:index:hash')
    })

    it("has the expected name", () => {
      expect(indexInfo.indexName).toBe('create-drop-json:index')
    })

    it("has the expected key type", () => {
      expect(indexInfo.indexDefinition.key_type).toBe('JSON')
    })

    it("has the expected prefixes", () => {
      expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-json:'])
    })

    it("has the expected hash", () => {
      expect(indexHash).toBe("o74BCR4MFyeWwukz8UvLjyIx/mQ=")
    })

    it("has the expected fields", () => {
      expect(indexInfo.attributes).toHaveLength(7)
      expect(indexInfo.attributes).toEqual(expected)
    })

    describe("when the index is dropped", () => {
      beforeEach(async () => await repository.dropIndex())

      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(redis, 'create-drop-json:index'))
          .rejects.toThrow("Unknown Index name")
      })

      it("the index hash no longer exists", async () => {
        let hash = await fetchIndexHash(redis, 'create-drop-json:index:hash')
        expect(hash).toBeNull()
      })
    })

    describe("and then the index is recreated but not changed", () => {
      beforeEach(async () => {
        await repository.createIndex()
        indexInfo = await fetchIndexInfo(redis, 'create-drop-json:index')
        indexHash = await fetchIndexHash(redis, 'create-drop-json:index:hash')
      })

      it("still has the expected attributes", () => {
        expect(indexInfo.indexName).toBe('create-drop-json:index')
        expect(indexInfo.indexDefinition.key_type).toBe('JSON')
        expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-json:'])
        expect(indexHash).toBe("o74BCR4MFyeWwukz8UvLjyIx/mQ=")
        expect(indexInfo.attributes).toHaveLength(7)
        expect(indexInfo.attributes).toEqual(expected)
      })
    })

    describe("and then the index is changed", () => {
      beforeEach(async () => {
        schema = createJsonEntitySchema('create-drop-json-changed')
        repository = new Repository(schema, redis)

        await repository.createIndex()
        indexInfo = await fetchIndexInfo(redis, 'create-drop-json-changed:index')
        indexHash = await fetchIndexHash(redis, 'create-drop-json-changed:index:hash')
      })

      it("has new attributes", () => {
        expect(indexInfo.indexName).toBe('create-drop-json-changed:index')
        expect(indexInfo.indexDefinition.key_type).toBe('JSON')
        expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-json-changed:'])
        expect(indexHash).toBe("a1Rv7/FRuFW/jQ6KJxp2jgpOH1I=")
      })
    })
  })
})
