import '../../helpers/custom-matchers'

import { createClient } from 'redis'

import { Entity, EntityKeyName, Repository, RedisConnection, Schema, SearchError } from '$lib/index'

import { createHashEntitySchema } from '../helpers/data-helper'
import { removeKeys, saveHash, sleep } from '../helpers/redis-helper'

import { ANOTHER_ENTITY, ANOTHER_HASH, AN_ENTITY, AN_ESCAPED_ENTITY, AN_ESCAPED_HASH, A_HASH, A_THIRD_ENTITY, A_THIRD_HASH } from '../helpers/hash-example-data'
import { A_DATE, A_POINT } from '../../helpers/example-data'

describe("search for hashes", () => {

  let redis: RedisConnection
  let repository: Repository
  let schema: Schema
  let entities: Entity[]

  beforeAll(async () => {
    redis = createClient()
    await redis.connect()

    await removeKeys(redis, 'search-hash:1', 'search-hash:2', 'search-hash:3', 'search-hash:escaped')
    await saveHash(redis, 'search-hash:1', A_HASH)
    await saveHash(redis, 'search-hash:2', ANOTHER_HASH)
    await saveHash(redis, 'search-hash:3', A_THIRD_HASH)
    await saveHash(redis, 'search-hash:escaped', AN_ESCAPED_HASH)

    schema = createHashEntitySchema('search-hash')
    repository = new Repository(schema, redis)

    await repository.createIndex()
    await sleep(50) // Yuck! Gotta wait for RediSearch to index everything.
  })

  afterAll(async () => {
    await removeKeys(redis, 'search-hash:1', 'search-hash:2', 'search-hash:3', 'search-hash:escaped')
    await repository.dropIndex()
    await redis.quit()
  })

  it("performs a wildcard search", async () => {
    entities = await repository.search().returnAll()

    expect(entities).toHaveLength(4)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY },
    ]))
  })

  it("performs a sorted search", async () => {
    entities = await repository.search().sortAscending('aNumber').returnAll()

    expect(entities).toHaveLength(4)
    expect(entities).toEqual([
      { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY }
    ])
  })

  it("performs a paginated search", async () => {
    entities = await repository.search().returnAll({ pageSize: 2 })

    expect(entities).toHaveLength(4)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY }
    ]))
  })

  it("performs a raw search", async () => {
    entities = await repository.searchRaw('@aString:{foo} @aNumber:[42 42]').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY }
    ]))
  })

  it("searches a string", async () => {
    entities = await repository.search().where('aString').eq('foo').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY }
    ]))
  })

  it("searches a text", async () => {
    entities = await repository.search().where('someText').matches('brown quick').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY }
    ]))
  })

  it("searches a text with wildcards", async () => {
    entities = await repository.search().where('someText').matches('br*').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY } ])
  })

  it("searches a text with an exact match", async () => {
    entities = await repository.search().where('someText').exactly.matches('quick brown').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY } ])
  })

  it("searches a text with stop words", async () => {
    entities = await repository.search().where('someText').matches('brown quick the').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY } ])
  })

  it("throw an error when searching a text with an exact match and stop words", async () => {
    expect.assertions(2)
    try {
      await repository.search().where('someText').exactly.matches('the quick brown').returnAll()
    } catch (error) {
      const err = error as Error
      expect(err).toBeInstanceOf(SearchError)
      expect(err.message).toEqual(`The query to RediSearch had a syntax error: "Syntax error at offset 12 near the".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h.`)
    }
  })

  it("searches a number", async () => {
    entities = await repository.search().where('aNumber').lte(23).returnAll()

    expect(entities).toHaveLength(2)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("searches a boolean", async () => {
    entities = await repository.search().where('aBoolean').true().returnAll()

    expect(entities).toHaveLength(2)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY }
    ]))
  })

  it("searches a point", async () => {
    entities = await repository.search()
      .where('aPoint').inCircle(circle => circle.origin(A_POINT).radius(10).meters)
      .returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY } ])
  })

  it("searches a date", async () => {
    entities = await repository.search().where('aDate').after(A_DATE).returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY } ])
  })

  it("searches a array", async () => {
    entities = await repository.search().where('someStrings').contains('charlie').returnAll()

    expect(entities).toHaveLength(3)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-hash:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-hash:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("searches all the field types", async () => {
    entities = await repository.search()
      .where('aString').eq('foo')
      .and('someText').matches('dog')
      .and('aNumber').gte(42)
      .and('aBoolean').true()
      .and('aPoint').inCircle(circle => circle.origin(A_POINT).radius(10).meters)
      .and('someStrings').contains('alfa')
      .returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:1', ...AN_ENTITY } ])
  })

  it("searches a string with escaped punctuation", async () => {
    entities = await repository.search().where('aString').equals('foo ,.<>{}[]"\':;!@#$%^()-+=~& bar').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY } ])
  })

  it("searches a text with escaped punctuation", async () => {
    entities = await repository.search().where('someText').matches('zany').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY } ])
  })

  it("searches an array with escaped punctuation", async () => {
    entities = await repository.search().where('someStrings').contains('alfa ,.<>{}[]"\':;!@#$%^&()-+=~ bravo').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-hash:escaped', ...AN_ESCAPED_ENTITY } ])
  })
})
