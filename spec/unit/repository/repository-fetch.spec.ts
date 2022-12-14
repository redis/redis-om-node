import '../helpers/mock-client'

import { Client } from '$lib/client'
import { Entity, EntityId, EntityKeyName } from '$lib/entity'
import { Repository } from '$lib/repository'
import { Schema, SchemaDefinition } from '$lib/schema'

import { A_NUMBER, A_NUMBER_STRING, A_STRING, ANOTHER_STRING, A_THIRD_STRING, ANOTHER_NUMBER_STRING, A_THIRD_NUMBER_STRING, ANOTHER_NUMBER, A_THIRD_NUMBER } from '../../helpers/example-data'

const aSimpleSchemaDef: SchemaDefinition = {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' }
}

const simpleHashSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'HASH' })
const simpleJsonSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'JSON' })

const AN_ENTITY = { [EntityId]: 'foo', [EntityKeyName]: 'SimpleEntity:foo', aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const ANOTHER_ENTITY = { [EntityId]: 'bar', [EntityKeyName]: 'SimpleEntity:bar', aString: ANOTHER_STRING, aNumber: ANOTHER_NUMBER, aBoolean: false }
const A_THIRD_ENTITY = { [EntityId]: 'baz', [EntityKeyName]: 'SimpleEntity:baz', aString: A_THIRD_STRING, aNumber: A_THIRD_NUMBER, aBoolean: true }
const AN_EMPTY_ENTITY = { [EntityId]: 'empty', [EntityKeyName]: 'SimpleEntity:empty' }

const SOME_ENTITY_HASH_DATA = { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '1' }
const SOME_OTHER_ENTITY_HASH_DATA = { aString: ANOTHER_STRING, aNumber: ANOTHER_NUMBER_STRING, aBoolean: '0' }
const SOME_MORE_ENTITY_HASH_DATA = { aString: A_THIRD_STRING, aNumber: A_THIRD_NUMBER_STRING, aBoolean: '1' }

const SOME_ENTITY_JSON_DATA = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const SOME_OTHER_ENTITY_JSON_DATA = { aString: ANOTHER_STRING, aNumber: ANOTHER_NUMBER, aBoolean: false }
const SOME_MORE_ENTITY_JSON_DATA = { aString: A_THIRD_STRING, aNumber: A_THIRD_NUMBER, aBoolean: true }

describe("Repository", () => {

  let client: Client
  let repository: Repository
  let entity: Entity, entities: Entity[]

  describe("#fetch", () => {

    beforeAll(() => { client = new Client() })

    describe("when fetching a single entity from a hash", () => {
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client)
        vi.mocked(client.hgetall).mockResolvedValue(SOME_ENTITY_HASH_DATA)
        entity = await repository.fetch('foo')
      })

      it("returns the expected entity", () => expect(entity).toEqual(AN_ENTITY))
    })

    describe("when fetching a empty entity from a hash", () => {
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client)
        vi.mocked(client.hgetall).mockResolvedValue({})
        entity = await repository.fetch('empty')
      })

      it("returns the expected entity", () => expect(entity).toEqual(AN_EMPTY_ENTITY))
    })

    describe("when fetching multiple entities from a hash", () => {
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client)
        vi.mocked(client.hgetall)
          .mockResolvedValueOnce(SOME_ENTITY_HASH_DATA)
          .mockResolvedValueOnce(SOME_OTHER_ENTITY_HASH_DATA)
          .mockResolvedValueOnce(SOME_MORE_ENTITY_HASH_DATA)
        entities = await repository.fetch(['foo', 'bar', 'baz'])
      })

      it("returns the expected number of entities", () => expect(entities).toHaveLength(3))
      it("returns the expected entities", () =>
        expect(entities).toEqual(expect.arrayContaining([ AN_ENTITY, ANOTHER_ENTITY, A_THIRD_ENTITY ])))
    })

    describe("when fetching multiple entities from a hash discretely", () => {
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client)
        vi.mocked(client.hgetall)
          .mockResolvedValueOnce(SOME_ENTITY_HASH_DATA)
          .mockResolvedValueOnce(SOME_OTHER_ENTITY_HASH_DATA)
          .mockResolvedValueOnce(SOME_MORE_ENTITY_HASH_DATA)
        entities = await repository.fetch('foo', 'bar', 'baz')
      })

      it("returns the expected number of entities", () => expect(entities).toHaveLength(3))
      it("returns the expected entities", () =>
        expect(entities).toEqual(expect.arrayContaining([ AN_ENTITY, ANOTHER_ENTITY, A_THIRD_ENTITY ])))
    })

    describe("when fetching a single entity from JSON", () => {
      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client)
        vi.mocked(client.jsonget).mockResolvedValue(SOME_ENTITY_JSON_DATA)
        entity = await repository.fetch('foo')
      })

      it("returns the expected entity", () => expect(entity).toEqual(AN_ENTITY))
    })

    describe("when fetching a empty entity from JSON", () => {
      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client)
        vi.mocked(client.jsonget).mockResolvedValue(null)
        entity = await repository.fetch('empty')
      })

      it("returns the expected entity", () => expect(entity).toEqual(AN_EMPTY_ENTITY))
    })

    describe("when fetching multiple entities from JSON", () => {
      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client)
        vi.mocked(client.jsonget)
          .mockResolvedValueOnce(SOME_ENTITY_JSON_DATA)
          .mockResolvedValueOnce(SOME_OTHER_ENTITY_JSON_DATA)
          .mockResolvedValueOnce(SOME_MORE_ENTITY_JSON_DATA)
        entities = await repository.fetch(['foo', 'bar', 'baz'])
      })

      it("returns the expected number of entities", () => expect(entities).toHaveLength(3))
      it("returns the expected entities", () =>
        expect(entities).toEqual(expect.arrayContaining([ AN_ENTITY, ANOTHER_ENTITY, A_THIRD_ENTITY ])))
    })

    describe("when fetching multiple entities from JSON discretely", () => {
      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client)
        vi.mocked(client.jsonget)
          .mockResolvedValueOnce(SOME_ENTITY_JSON_DATA)
          .mockResolvedValueOnce(SOME_OTHER_ENTITY_JSON_DATA)
          .mockResolvedValueOnce(SOME_MORE_ENTITY_JSON_DATA)
        entities = await repository.fetch('foo', 'bar', 'baz')
      })

      it("returns the expected number of entities", () => expect(entities).toHaveLength(3))
      it("returns the expected entities", () =>
        expect(entities).toEqual(expect.arrayContaining([ AN_ENTITY, ANOTHER_ENTITY, A_THIRD_ENTITY ])))
    })
  })
})
