import { createClient } from 'redis'

import { RedisConnection, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { fetchIndexHash, fetchIndexInfo, removeKeys } from '../helpers/redis-helper'

const expected = [
  { identifier: 'root_aString', attribute: 'aString', type: 'TAG', SEPARATOR: '|' },
  { identifier: 'root_someText', attribute: 'someText', type: 'TEXT', WEIGHT: '1', SORTABLE: undefined },
  { identifier: 'root_aNumber', attribute: 'aNumber', type: 'NUMERIC', SORTABLE: undefined },
  { identifier: 'root_aBoolean', attribute: 'aBoolean', type: 'TAG', SEPARATOR: ',' },
  { identifier: 'root_aPoint', attribute: 'aPoint', type: 'GEO' },
  { identifier: 'root_aDate', attribute: 'aDate', type: 'NUMERIC', SORTABLE: undefined },
  { identifier: 'root_someStrings', attribute: 'someStrings', type: 'TAG', SEPARATOR: '|' },
]

describe("create and drop index on hash", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let indexInfo: any
  let indexHash: string | null

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    schema = createHashEntitySchema('create-drop-hash')
    repository = new Repository(schema, redis)
  })

  afterAll(async () => {
    await removeKeys(redis, 'create-drop-hash:index:hash', 'create-drop-hash-changed:index:hash')
    await repository.dropIndex()
    await redis.quit()
  })

  describe("when the index is created", () => {
    beforeEach(async () => {
      await removeKeys(redis, 'create-drop-hash:index:hash', 'create-drop-hash-changed:index:hash')
      await repository.createIndex()
      indexInfo = await fetchIndexInfo(redis, 'create-drop-hash:index')
      indexHash = await fetchIndexHash(redis, 'create-drop-hash:index:hash')
    })

    it("has the expected name", () => {
      expect(indexInfo.indexName).toBe('create-drop-hash:index')
    })

    it("has the expected key type", () => {
      expect(indexInfo.indexDefinition.key_type).toBe('HASH')
    })

    it("has the expected prefixes", () => {
      expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-hash:'])
    })

    it("has the expected hash", () => {
      expect(indexHash).toBe("Kw31lMY+/x+l+GB0RLuUpptoFCY=")
    })

    it("has the expected fields", () => {
      expect(indexInfo.attributes).toHaveLength(7)
      expect(indexInfo.attributes).toEqual(expected)
    })

    describe("and then the index is dropped", () => {
      beforeEach(async () => await repository.dropIndex())

      it("the index no longer exists", async () => {
        expect(async () => await fetchIndexInfo(redis, 'create-drop-hash:index'))
          .rejects.toThrow("Unknown Index name")
      })

      it("the index hash no longer exists", async () => {
        let hash = await fetchIndexHash(redis, 'create-drop-hash:index:hash')
        expect(hash).toBeNull()
      })
    })

    describe("and then the index is recreated but not changed", () => {
      beforeEach(async () => {
        await repository.createIndex()
        indexInfo = await fetchIndexInfo(redis, 'create-drop-hash:index')
        indexHash = await fetchIndexHash(redis, 'create-drop-hash:index:hash')
      })

      it("still has the expected attributes", () => {
        expect(indexInfo.indexName).toBe('create-drop-hash:index')
        expect(indexInfo.indexDefinition.key_type).toBe('HASH')
        expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-hash:'])
        expect(indexHash).toBe("Kw31lMY+/x+l+GB0RLuUpptoFCY=")
        expect(indexInfo.attributes).toHaveLength(7)
        expect(indexInfo.attributes).toEqual(expected)
      })
    })

    describe("and then the index is changed", () => {
      beforeEach(async () => {
        schema = createHashEntitySchema('create-drop-hash-changed')
        repository = new Repository(schema, redis)

        await repository.createIndex()
        indexInfo = await fetchIndexInfo(redis, 'create-drop-hash-changed:index')
        indexHash = await fetchIndexHash(redis, 'create-drop-hash-changed:index:hash')
      })

      it("has new attributes", () => {
        expect(indexInfo.indexName).toBe('create-drop-hash-changed:index')
        expect(indexInfo.indexDefinition.key_type).toBe('HASH')
        expect(indexInfo.indexDefinition.prefixes).toEqual(['create-drop-hash-changed:'])
        expect(indexHash).toBe("Sbpbl+ZRM8GhzNbfqpJXgOlwYfo=")
      })
    })
  })
})
