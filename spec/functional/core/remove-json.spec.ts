import { Client, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema, loadJson } from '../helpers/data-helper'
import { keyExists, removeAll } from '../helpers/redis-helper'

import { ANOTHER_JSON, A_JSON, A_THIRD_JSON } from '../helpers/json-example-data'

describe("remove JSON", () => {

  let client: Client
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    client = await new Client().open()
    schema = createJsonEntitySchema('remove-json')
    repository = client.fetchRepository(schema)
  })

  beforeEach(async () => {
    await removeAll(client, 'remove-json:')
    await loadJson(client, 'remove-json:1', A_JSON)
    await loadJson(client, 'remove-json:2', ANOTHER_JSON)
    await loadJson(client, 'remove-json:3', A_THIRD_JSON)
  })

  afterAll(async () => {
    await removeAll(client, 'remove-json:')
    await client.close()
  })

  it("removes a single entity", async () => {
    expect(keyExists(client, 'remove-json:1')).resolves.toBe(true)
    await repository.remove('1')
    expect(keyExists(client, 'remove-json:1')).resolves.toBe(false)
  })

  it("removes multiple entities with discrete arguments", async () => {
    expect(keyExists(client, 'remove-json:1')).resolves.toBe(true)
    expect(keyExists(client, 'remove-json:2')).resolves.toBe(true)
    expect(keyExists(client, 'remove-json:3')).resolves.toBe(true)

    await repository.remove('1', '2', '3')

    expect(keyExists(client, 'remove-json:1')).resolves.toBe(false)
    expect(keyExists(client, 'remove-json:2')).resolves.toBe(false)
    expect(keyExists(client, 'remove-json:3')).resolves.toBe(false)
  })

  it("removes multiple entities with an array", async () => {
    expect(keyExists(client, 'remove-json:1')).resolves.toBe(true)
    expect(keyExists(client, 'remove-json:2')).resolves.toBe(true)
    expect(keyExists(client, 'remove-json:3')).resolves.toBe(true)

    await repository.remove([ '1', '2', '3' ])

    expect(keyExists(client, 'remove-json:1')).resolves.toBe(false)
    expect(keyExists(client, 'remove-json:2')).resolves.toBe(false)
    expect(keyExists(client, 'remove-json:3')).resolves.toBe(false)
  })

  it("removes a non-existing entity", async () => {
    expect(keyExists(client, 'remove-json:empty')).resolves.toBe(false)
    await repository.remove('empty')
    expect(keyExists(client, 'remove-json:empty')).resolves.toBe(false)
  })
})
