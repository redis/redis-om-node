import { Client, EntityId, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema, fetchJson } from '../helpers/data-helper'
import { keyExists, removeAll } from '../helpers/redis-helper'

import { AN_EMPTY_ENTITY, AN_EMPTY_JSON, AN_ENTITY, A_JSON } from '../helpers/json-example-data'

describe("save JSON", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let entityId: string

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createJsonEntitySchema('save-json')
    repository = client.fetchRepository(schema)
  })

  beforeEach(async () => await removeAll(client, 'save-json:'))
  afterAll(async () => {
    await removeAll(client, 'save-json:')
    await client.close()
  })

  describe("when saving an entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_ENTITY[EntityId]))
    it('saves the expected JSON in Redis', async () => expect(fetchJson(client, 'save-json:1')).resolves.toEqual(A_JSON))
  })

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_EMPTY_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_EMPTY_ENTITY[EntityId]))
    it('saves an empty JSON in Redis', async () => expect(fetchJson(client, 'save-json:empty')).resolves.toEqual(AN_EMPTY_JSON))
    it("stores an empty key", async () => expect(keyExists(client, 'save-json:empty')).resolves.toBe(true))
  })
})
