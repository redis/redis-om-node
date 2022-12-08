import { Client, Repository, Schema } from '$lib/index'

import { createHashEntitySchema, loadHash } from '../helpers/data-helper'
import { removeAll } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_HASH, AN_EMPTY_ENTITY, AN_ENTITY, A_HASH, A_THIRD_ENTITY, A_THIRD_HASH } from '../helpers/hash-example-data'

describe("fetch hash", () => {

  let client: Client
  let repository: Repository
  let schema: Schema

  beforeAll(async () => {
    client = new Client()
    await client.open()
    await removeAll(client, 'fetch-hash:')
    await loadHash(client, 'fetch-hash:1', A_HASH)
    await loadHash(client, 'fetch-hash:2', ANOTHER_HASH)
    await loadHash(client, 'fetch-hash:3', A_THIRD_HASH)

    schema = createHashEntitySchema('fetch-hash')
    repository = client.fetchRepository(schema)
  })

  afterAll(async () => {
    await removeAll(client, 'fetch-hash:')
    await client.close()
  })

  it("fetches a single entity from Redis", async () =>
    expect(repository.fetch('1')).resolves.toEqual({ keyName: 'fetch-hash:1', ...AN_ENTITY }))

  it("fetches an empty entity from Redis", async () =>
    expect(repository.fetch('empty')).resolves.toEqual({ keyName: 'fetch-hash:empty', ...AN_EMPTY_ENTITY }))

  it("fetches multiple entities from Redis with discrete arguments", async () => {
    let entities = await repository.fetch('1', '2', '3')
    expect(entities).toEqual(expect.arrayContaining([
      { keyName: 'fetch-hash:1', ...AN_ENTITY },
      { keyName: 'fetch-hash:2', ...ANOTHER_ENTITY },
      { keyName: 'fetch-hash:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("fetches multiple entities from Redis with an array", async () => {
    let entities = await repository.fetch(['1', '2', '3'])
    expect(entities).toEqual(expect.arrayContaining([
      { keyName: 'fetch-hash:1', ...AN_ENTITY },
      { keyName: 'fetch-hash:2', ...ANOTHER_ENTITY },
      { keyName: 'fetch-hash:3', ...A_THIRD_ENTITY }
    ]))
  })
})
