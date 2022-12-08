import { Client, Repository, Schema } from '$lib/index'

import { createHashEntitySchema, loadHash } from '../helpers/data-helper'
import { keyExists, removeAll } from '../helpers/redis-helper'

import { ANOTHER_HASH, A_HASH, A_THIRD_HASH } from '../helpers/hash-example-data'

describe("remove hash", () => {

  let client: Client
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    client = await new Client().open()
    schema = createHashEntitySchema('remove-hash')
    repository = client.fetchRepository(schema)
  })

  beforeEach(async () => {
    await removeAll(client, 'remove-hash:')
    await loadHash(client, 'remove-hash:1', A_HASH)
    await loadHash(client, 'remove-hash:2', ANOTHER_HASH)
    await loadHash(client, 'remove-hash:3', A_THIRD_HASH)
  })

  afterAll(async () => {
    await removeAll(client, 'remove-hash:')
    await client.close()
  })

  it("removes a single entity", async () => {
    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(true)
    await repository.remove('1')
    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(false)
  })

  it("removes multiple entities with discrete arguments", async () => {
    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(true)
    expect(keyExists(client, 'remove-hash:2')).resolves.toBe(true)
    expect(keyExists(client, 'remove-hash:3')).resolves.toBe(true)

    await repository.remove('1', '2', '3')

    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(false)
    expect(keyExists(client, 'remove-hash:2')).resolves.toBe(false)
    expect(keyExists(client, 'remove-hash:full')).resolves.toBe(false)
  })

  it("removes multiple entities with an array", async () => {
    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(true)
    expect(keyExists(client, 'remove-hash:2')).resolves.toBe(true)
    expect(keyExists(client, 'remove-hash:3')).resolves.toBe(true)
    await repository.remove([ '1', '2', '3' ])

    expect(keyExists(client, 'remove-hash:1')).resolves.toBe(false)
    expect(keyExists(client, 'remove-hash:2')).resolves.toBe(false)
    expect(keyExists(client, 'remove-hash:3')).resolves.toBe(false)
  })

  it("removes a non-existing entity", async () => {
    expect(keyExists(client, 'remove-hash:empty')).resolves.toBe(false)
    await repository.remove('empty')
    expect(keyExists(client, 'remove-hash:empty')).resolves.toBe(false)
  })
})
