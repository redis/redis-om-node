import { Client, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema } from '../helpers/data-helper'
import { fetchIndexHash, fetchIndexInfo, removeAll } from '../helpers/redis-helper'

describe("create and drop index on JSON", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let indexInfo: Array<string>
  let indexHash: string

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createJsonEntitySchema('create-drop-json')
    repository = client.fetchRepository(schema)
  })

  afterAll(async () => {
    await repository.dropIndex()
    await client.close()
  })

  describe("when the index is created", () => {
    beforeEach(async () => {
      await repository.createIndex()
      indexInfo = await fetchIndexInfo(client, 'create-drop-json:index')
      indexHash = await fetchIndexHash(client, 'create-drop-json:index:hash')
    })

    it("has the expected name", () => {
      let indexName = indexInfo[1]
      expect(indexName).toBe('create-drop-json:index')
    })

    it("has the expected key type", () => {
      let keyType = indexInfo[5][1]
      expect(keyType).toBe('JSON')
    })

    it("has the expected prefixes", () => {
      let prefixes = indexInfo[5][3]
      expect(prefixes).toEqual(['create-drop-json:'])
    })

    it("has the expected hash", () => {
      expect(indexHash).toBe("o74BCR4MFyeWwukz8UvLjyIx/mQ=")
    })

    it("has the expected fields", () => {
      let fields = indexInfo[7]
      expect(fields).toHaveLength(7)
      expect(fields).toEqual([
        ['identifier', '$.root.aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
        ['identifier', '$.root.someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
        ['identifier', '$.root.aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.root.aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ''],
        ['identifier', '$.root.aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
        ['identifier', '$.root.aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
        ['identifier', '$.root.someStrings[*]', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|']
      ])
    })

    describe("when the index is dropped", () => {
      beforeEach(async () => await repository.dropIndex())

      it("the index no longer exists", () => {
        expect(async () => await fetchIndexInfo(client, 'create-drop-json:index'))
          .rejects.toThrow("Unknown Index name")
      })

      it("the index hash no longer exists", async () => {
        let hash = await fetchIndexHash(client, 'create-drop-json:index:hash')
        expect(hash).toBeNull()
      })
    })

    describe("and then the index is recreated but not changed", () => {
      beforeEach(async () => {
        await repository.createIndex()
        indexInfo = await fetchIndexInfo(client, 'create-drop-json:index')
        indexHash = await fetchIndexHash(client, 'create-drop-json:index:hash')
      })

      it("still has the expected attributes", () => {
        let indexName = indexInfo[1]
        let keyType = indexInfo[5][1]
        let prefixes = indexInfo[5][3]
        let fields = indexInfo[7]

        expect(indexName).toBe('create-drop-json:index')
        expect(keyType).toBe('JSON')
        expect(prefixes).toEqual(['create-drop-json:'])
        expect(indexHash).toBe("o74BCR4MFyeWwukz8UvLjyIx/mQ=")

        expect(fields).toHaveLength(7)
        expect(fields).toEqual([
          ['identifier', '$.root.aString', 'attribute', 'aString', 'type', 'TAG', 'SEPARATOR', '|'],
          ['identifier', '$.root.someText', 'attribute', 'someText', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
          ['identifier', '$.root.aNumber', 'attribute', 'aNumber', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.root.aBoolean', 'attribute', 'aBoolean', 'type', 'TAG', 'SEPARATOR', ''],
          ['identifier', '$.root.aPoint', 'attribute', 'aPoint', 'type', 'GEO'],
          ['identifier', '$.root.aDate', 'attribute', 'aDate', 'type', 'NUMERIC', 'SORTABLE'],
          ['identifier', '$.root.someStrings[*]', 'attribute', 'someStrings', 'type', 'TAG', 'SEPARATOR', '|']
        ])
      })
    })

    describe("and then the index is changed", () => {
      beforeEach(async () => {
        schema = createJsonEntitySchema('create-drop-json-changed')
        repository = client.fetchRepository(schema)

        await repository.createIndex()
        indexInfo = await fetchIndexInfo(client, 'create-drop-json-changed:index')
        indexHash = await fetchIndexHash(client, 'create-drop-json-changed:index:hash')
      })

      it("has new attributes", () => {
        let indexName = indexInfo[1]
        let keyType = indexInfo[5][1]
        let prefixes = indexInfo[5][3]

        expect(indexName).toBe('create-drop-json-changed:index')
        expect(keyType).toBe('JSON')
        expect(prefixes).toEqual(['create-drop-json-changed:'])
        expect(indexHash).toBe("a1Rv7/FRuFW/jQ6KJxp2jgpOH1I=")
      })
    })
  })
})
