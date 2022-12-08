import { Client, Repository, Schema } from '$lib/index'

import { createJsonEntitySchema, loadJson } from '../helpers/data-helper'
import { removeAll } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_JSON, AN_EMPTY_ENTITY, AN_ENTITY, A_JSON, A_THIRD_ENTITY, A_THIRD_JSON } from '../helpers/json-example-data'

describe("fetch JSON", () => {

  let client: Client
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    client = new Client()
    await client.open()
    await removeAll(client, 'fetch-json:')
    await loadJson(client, 'fetch-json:1', A_JSON)
    await loadJson(client, 'fetch-json:2', ANOTHER_JSON)
    await loadJson(client, 'fetch-json:3', A_THIRD_JSON)

    schema = createJsonEntitySchema('fetch-json')
    repository = client.fetchRepository(schema)
  })

  afterAll(async () => {
    await removeAll(client, 'fetch-json:')
    await client.close()
  })

  it("fetches a single entity from Redis", async () =>
    expect(repository.fetch('1')).resolves.toEqual({ keyName: 'fetch-json:1', ...AN_ENTITY }))

  it("fetches an empty entity from Redis", async () => {
    const entity = await repository.fetch('empty')
    expect(entity).toEqual({ keyName: 'fetch-json:empty', ...AN_EMPTY_ENTITY })
  })

  it("fetches a missing entity from Redis", async () => {
    const entity = await repository.fetch('missing')
    expect(entity).toEqual({ entityId: 'missing', keyName: 'fetch-json:missing' })
  })

  it("fetches all the entities from Redis with discrete arguments", async () => {
    let entities = await repository.fetch('1', '2', '3')
    expect(entities).toEqual(expect.arrayContaining([
      { keyName: 'fetch-json:1', ...AN_ENTITY },
      { keyName: 'fetch-json:2', ...ANOTHER_ENTITY },
      { keyName: 'fetch-json:3', ...A_THIRD_ENTITY }
    ]))
  })
})