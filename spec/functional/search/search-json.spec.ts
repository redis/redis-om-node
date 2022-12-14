import { Client, Entity, Schema, Repository, EntityKeyName } from '$lib/index'

import { createJsonEntitySchema, loadJson } from '../helpers/data-helper'
import { removeAll } from '../helpers/redis-helper'

import { A_POINT, A_DATE } from '../../helpers/example-data'
import { ANOTHER_ENTITY, ANOTHER_JSON, AN_ENTITY, AN_ESCAPED_ENTITY, AN_ESCAPED_JSON, A_JSON, A_THIRD_ENTITY, A_THIRD_JSON } from '../helpers/json-example-data'

describe("search for JSON documents", () => {

  let client: Client
  let repository: Repository
  let schema: Schema
  let entities: Entity[]

  beforeAll(async () => {
    client = new Client()
    await client.open()
    await removeAll(client, 'search-json:')
    await loadJson(client, 'search-json:1', A_JSON)
    await loadJson(client, 'search-json:2', ANOTHER_JSON)
    await loadJson(client, 'search-json:3', A_THIRD_JSON)
    await loadJson(client, 'search-json:escaped', AN_ESCAPED_JSON)

    schema = createJsonEntitySchema('search-json')
    repository = client.fetchRepository(schema)

    await repository.createIndex()
  })

  afterAll(async () => {
    await removeAll(client, 'search-json:')
    await repository.dropIndex()
    await client.close()
  })

  it("performs a wildcard search", async () => {
    entities = await repository.search().returnAll()

    expect(entities).toHaveLength(4)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY }
    ]))
  })

  it("performs a sorted search", async () => {
    entities = await repository.search().sortAscending('aNumber').returnAll()

    expect(entities).toHaveLength(4)
    expect(entities).toEqual([
      { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY }
    ])
  })

  it("performs a paginated search", async () => {
    entities = await repository.search().returnAll({ pageSize: 2 })

    expect(entities).toHaveLength(4)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY },
      { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY }
    ]))
  })

  it("performs a raw search", async () => {
    entities = await repository.searchRaw('@aString:{foo} @aNumber:[42 42]').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a string", async () => {
    entities = await repository.search().where('aString').eq('foo').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a string with full text", async () => {
    entities = await repository.search().where('someText').matches('brown quick').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a string with full text and an exact match", async () => {
    entities = await repository.search().where('someText').exactly.matches('quick brown').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a string with full text and stop words", async () => {
    entities = await repository.search().where('someText').matches('brown quick the').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("throws an error when searching a string with full text, an exact match, and stop words", async () => {
    expect(async () => {
      entities = await repository.search().where('someText').exactly.matches('the quick brown').returnAll()
    }).rejects.toThrow(`The query to RediSearch had a syntax error: "Syntax error at offset 12 near the".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h`)
  })

  it("searches a number", async () => {
    entities = await repository.search().where('aNumber').lte(23).returnAll()

    expect(entities).toHaveLength(2)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("searches a boolean", async () => {
    entities = await repository.search().where('aBoolean').true().returnAll()

    expect(entities).toHaveLength(2)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY }
    ]))
  })

  it("searches a point", async () => {
    entities = await repository.search()
      .where('aPoint').inCircle(circle => circle.origin(A_POINT).radius(10).meters)
      .returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a date", async () => {
    entities = await repository.search().where('aDate').after(A_DATE).returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY } ])
  })

  it("searches a array", async () => {
    entities = await repository.search().where('someStrings').contains('charlie').returnAll()

    expect(entities).toHaveLength(3)
    expect(entities).toEqual(expect.arrayContaining([
      { [EntityKeyName]: 'search-json:1', ...AN_ENTITY },
      { [EntityKeyName]: 'search-json:2', ...ANOTHER_ENTITY },
      { [EntityKeyName]: 'search-json:3', ...A_THIRD_ENTITY }
    ]))
  })

  it("searches all the field types", async () => {
    entities = await repository.search()
      .where('aString').eq('foo')
      .and('someText').matches('dog')
      .and('aNumber').gte(42)
      .and('aBoolean').true()
      .and('aPoint').inCircle(circle => circle.origin(12.34, 56.78).radius(10).meters)
      .and('someStrings').contains('alfa')
      .returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:1', ...AN_ENTITY } ])
  })

  it("searches a string with escaped punctuation", async () => {
    entities = await repository.search().where('aString').equals('foo ,.<>{}[]"\':;!@#$%^*()-+=~& bar').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY } ])
  })

  it("searches a string with full text with escaped punctuation", async () => {
    entities = await repository.search().where('someText').matches('zany').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY } ])
  })

  it("searches a array with escaped punctuation", async () => {
    entities = await repository.search().where('someStrings').contains('alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo').returnAll()

    expect(entities).toHaveLength(1)
    expect(entities).toEqual([ { [EntityKeyName]: 'search-json:escaped', ...AN_ESCAPED_ENTITY } ])
  })
})
