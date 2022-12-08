import { Client, Entity, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema, fetchJson, loadJson } from '../helpers/data-helper'
import { keyExists, removeAll } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_JSON, AN_EMPTY_JSON, AN_ENTITY, A_JSON } from '../helpers/json-example-data'

describe("update JSON", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let entity: Entity
  let entityId: string

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createJsonEntitySchema('update-json')
    repository = client.fetchRepository(schema)
  })

  beforeEach(async () => {
    await removeAll(client, 'update-json:')
    await loadJson(client, 'update-json:1', A_JSON)
  })

  afterAll(async () => {
    await removeAll(client, 'update-json:')
    await client.close()
  })

  describe("when updating an Entity to Redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.root = ANOTHER_ENTITY.root
      entity.anotherString = ANOTHER_ENTITY.anotherString
      entity.someOtherText = ANOTHER_ENTITY.someOtherText
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean
      entity.anotherPoint = ANOTHER_ENTITY.anotherPoint
      entity.anotherDate = ANOTHER_ENTITY.anotherDate
      entity.someOtherStrings = ANOTHER_ENTITY.someOtherStrings
      entityId = await repository.save(entity)
    })

    it("returns the expected entity id", () => expect(entityId).toBe('1'))
    it('create the expected JSON in Redis', async () => expect(fetchJson(client, 'update-json:1')).resolves.toEqual(ANOTHER_JSON))
  })

  describe("when updating an empty entity to Redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('1')
      entity.root = undefined
      entity.anotherString = undefined
      entity.someOtherText = undefined
      entity.anotherNumber = undefined
      delete entity.anotherBoolean
      delete entity.anotherPoint
      delete entity.anotherDate
      delete entity.someOtherStrings
      entityId = await repository.save(entity)
    })

    it("returns the expected entity id", () => expect(entityId).toBe('1'))
    it("creates the expected JSON", async () => expect(fetchJson(client, 'update-json:1')).resolves.toEqual(AN_EMPTY_JSON))
    it("stores an empty key", async () => expect(keyExists(client, 'update-json:1')).resolves.toBe(true))
  })
})
