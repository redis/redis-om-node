import { Client, Repository, Schema } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { fetchIndexHash, fetchIndexInfo, removeAll } from '../helpers/redis-helper'

describe("create and drop index on hash", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let indexInfo: Array<string>
  let indexHash: string

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createHashEntitySchema('create-drop-hash')
    repository = client.fetchRepository(schema)
  })

  afterAll(async () => {
    await removeAll(client, 'create-drop-hash:')
    await repository.dropIndex()
    await client.close()
  })

  describe("when the index is created", () => {
    beforeEach(async () => {
      await repository.createIndex()
      indexInfo = await fetchIndexInfo(client, 'create-drop-hash:index')
      indexHash = await fetchIndexHash(client, 'create-drop-hash:index:hash')
    })

    it("has the expected name", () => {
      let indexName = indexInfo[1]
      expect(indexName).toBe('create-drop-hash:index')
    })

    it("has the expected key type", () => {
      let keyType = indexInfo[5][1]
      expect(keyType).toBe('HASH')
    })

    it("has the expected prefixes", () => {
      let prefixes = indexInfo[5][3]
      expect(prefixes).toEqual(['create-drop-hash:'])
    })

    it("has the expected hash", () => {
      expect(indexHash).toBe("T0ZYwbhTRHwtWlrwpoxcwKqxpAg=")
    })

    it("has the expected fields", () => {
      let fields = indexInfo[7]
      expect(fields).toHaveLength(7)
      expect(fields).toEqual([
        ['identifier', 'aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
        ['identifier', 'someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
        ['identifier', 'aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', 'aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ','],
        ['identifier', 'aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
        ['identifier', 'aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', 'someStrings', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|']
      ])
    })

    describe("and then the index is dropped", () => {
      beforeEach(async () => await repository.dropIndex())

      it("the index no longer exists", async () => {
        expect(async () => await fetchIndexInfo(client, 'create-drop-hash:index'))
          .rejects.toThrow("Unknown Index name")
      })

      it("the index hash no longer exists", async () => {
        let hash = await fetchIndexHash(client, 'create-drop-hash:index:hash')
        expect(hash).toBeNull()
      })
    })

    describe("and then the index is recreated but not changed", () => {
      beforeEach(async () => {
        await repository.createIndex()
        indexInfo = await fetchIndexInfo(client, 'create-drop-hash:index')
        indexHash = await fetchIndexHash(client, 'create-drop-hash:index:hash')
      })

      it("still has the expected attributes", () => {
        let indexName = indexInfo[1]
        let keyType = indexInfo[5][1]
        let prefixes = indexInfo[5][3]
        let fields = indexInfo[7]

        expect(indexName).toBe('create-drop-hash:index')
        expect(keyType).toBe('HASH')
        expect(prefixes).toEqual(['create-drop-hash:'])
        expect(indexHash).toBe("T0ZYwbhTRHwtWlrwpoxcwKqxpAg=")

        expect(fields).toHaveLength(7)
        expect(fields).toEqual([
          ['identifier', 'aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
          ['identifier', 'someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
          ['identifier', 'aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', 'aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ','],
          ['identifier', 'aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
          ['identifier', 'aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', 'someStrings', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|']
        ])
      })
    })

    describe("and then the index is changed", () => {
      beforeEach(async () => {
        schema = createHashEntitySchema('create-drop-hash-changed')
        repository = client.fetchRepository(schema)

        await repository.createIndex()
        indexInfo = await fetchIndexInfo(client, 'create-drop-hash-changed:index')
        indexHash = await fetchIndexHash(client, 'create-drop-hash-changed:index:hash')
      })

      it("has new attributes", () => {
        let indexName = indexInfo[1]
        let keyType = indexInfo[5][1]
        let prefixes = indexInfo[5][3]

        expect(indexName).toBe('create-drop-hash-changed:index')
        expect(keyType).toBe('HASH')
        expect(prefixes).toEqual(['create-drop-hash-changed:'])
        expect(indexHash).toBe("paAjF/mZrqgEI4CAQHwNm+hO8Ow=")
      })
    })
  })
})
