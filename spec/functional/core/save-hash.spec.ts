import { Client, EntityId, Repository, Schema } from '$lib/index'

import { createHashEntitySchema, fetchHash } from '../helpers/data-helper'
import { keyExists, removeAll } from '../helpers/redis-helper'

import { AN_EMPTY_ENTITY, AN_EMPTY_HASH, AN_ENTITY, A_HASH } from '../helpers/hash-example-data'

describe("save hash", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let entityId: string

  beforeAll(async () => {
    client = new Client()
    await client.open()

    schema = createHashEntitySchema('save-hash')
    repository = client.fetchRepository(schema)
  })

  beforeEach(async () => await removeAll(client, 'save-hash:'))
  afterAll(async () => {
    await removeAll(client, 'save-hash:')
    await client.close()
  })

  describe("when saving an entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_ENTITY[EntityId]))
    it('saves the expected Hash in Redis', async () => expect(fetchHash(client, 'save-hash:1')).resolves.toEqual(A_HASH))
  })

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => { entityId = await repository.save(AN_EMPTY_ENTITY) })

    it('returns the expected entityId', () => expect(entityId).toBe(AN_EMPTY_ENTITY[EntityId]))
    it('saves an empty Hash in Redis', async () => expect(fetchHash(client, 'save-hash:empty')).resolves.toEqual(AN_EMPTY_HASH))

    it("stores no Hash at all", async () => expect(keyExists(client, 'save-hash:empty')).resolves.toBe(false))
  })
})
