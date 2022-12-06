import '../helpers/mock-client'

import { Client } from '$lib/client'
import { Entity } from '$lib/entity'
import { Repository } from '$lib/repository'
import { Schema, SchemaDefinition } from '$lib/schema'

import { A_STRING, A_NUMBER, A_NUMBER_STRING } from '../../helpers/example-data'

const aSimpleSchemaDef: SchemaDefinition = {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' }
}

const simpleHashSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'HASH' })
const simpleJsonSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'JSON' })

const EMPTY_ENTITY_DATA = {}
const EMPTY_ENTITY_DATA_WITH_ID = { entityId: 'foo', keyName: 'key:bar' }
const ENTITY_DATA = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const ENTITY_DATA_WITH_ID = { entityId: 'bar', keyName: 'key:bar', aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }

const ENTITY_HASH_DATA = { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '1' }
const ENTITY_JSON_DATA = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const ULID_REGEX = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/
const KEYNAME_REGEX = /^SimpleEntity:[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/


describe("Repository", () => {
  describe("#createAndSave", () => {

    let client: Client
    let entity: Entity

    beforeAll(() => { client = new Client() })

    describe("to a Hash", () => {
      let repository: Repository

      beforeAll(() => { repository = new Repository(simpleHashSchema, client) })

      describe.each([
        [ "with entity data", ENTITY_DATA, false ],
        [ "with entity data that mistakenly has and entityId and keyName defined", ENTITY_DATA_WITH_ID, false ],
        [ "with empty entity data", EMPTY_ENTITY_DATA, true ],
        [ "with empty entity data that mistakenly has and entityId and keyName defined", EMPTY_ENTITY_DATA_WITH_ID, true ]
      ])('%s', (_, entityData, isEmpty) => {

        beforeEach(async () => { entity = await repository.createAndSave(entityData) })

        if (!isEmpty) it("saves the entity data to a generated key", () =>
          expect(client.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(KEYNAME_REGEX),
            expect.objectContaining(ENTITY_HASH_DATA)))

        if (isEmpty) it("unlinks the generated key", () =>
          expect(client.unlink).toHaveBeenCalledWith(expect.stringMatching(KEYNAME_REGEX)))


        it("returns an entity with the expected number of properties", () =>
          expect(Object.keys(entity)).toHaveLength(isEmpty ? 2 : 5))

        it("returns an entity with a generated id and key", () => {
          expect(entity.entityId).toMatch(ULID_REGEX)
          expect(entity.keyName).toMatch(KEYNAME_REGEX)
        })

        if (!isEmpty) it("returns an entity with the expected properties", () => {
          expect(entity.aString).toBe(A_STRING)
          expect(entity.aNumber).toBe(A_NUMBER)
          expect(entity.aBoolean).toBe(true)
        })
      })

      describe.each([
        [ "with entity data *and* an entity id", ENTITY_DATA, false ],
        [ "with entity data that mistakenly has and entityId and keyName defined *and* an entity id", ENTITY_DATA_WITH_ID, false ],
        [ "with empty entity data *and* an entity id", EMPTY_ENTITY_DATA, true ],
        [ "with empty entity data that mistakenly has and entityId and keyName defined *and* an entity id", EMPTY_ENTITY_DATA_WITH_ID, true ]
      ])('%s', (_, entityData, isEmpty) => {

        beforeEach(async () => { entity = await repository.createAndSave('foo', entityData) })

        if (!isEmpty) it("saves the entity data to the provide key", () =>
          expect(client.hsetall).toHaveBeenCalledWith(
            'SimpleEntity:foo',
            expect.objectContaining(ENTITY_HASH_DATA)))

        if (isEmpty) it("unlinks the provided key", () =>
          expect(client.unlink).toHaveBeenCalledWith('SimpleEntity:foo'))

        it("returns an entity with the expected number of properties", () =>
          expect(Object.keys(entity)).toHaveLength(isEmpty ? 2 : 5))

        it("returns an entity with the provided id and key", () => {
          expect(entity.entityId).toBe('foo')
          expect(entity.keyName).toBe('SimpleEntity:foo')
        })

        if (!isEmpty) it("returns an entity with the expected properties", () => {
          expect(entity.aString).toBe(A_STRING)
          expect(entity.aNumber).toBe(A_NUMBER)
          expect(entity.aBoolean).toBe(true)
        })
      })
    })

    describe("to JSON", () => {
      let repository: Repository

      beforeAll(() => { repository = new Repository(simpleJsonSchema, client) })

      describe.each([
        [ "with entity data", ENTITY_DATA, false ],
        [ "with entity data that mistakenly has and entityId and keyName defined", ENTITY_DATA_WITH_ID, false ],
        [ "with empty entity data", EMPTY_ENTITY_DATA, true ],
        [ "with empty entity data that mistakenly has and entityId and keyName defined", EMPTY_ENTITY_DATA_WITH_ID, true ]
      ])('%s', (_, entityData, isEmpty) => {

        beforeEach(async () => { entity = await repository.createAndSave(entityData) })

        if (!isEmpty) it("saves the entity data to a generated key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(KEYNAME_REGEX),
            expect.objectContaining(ENTITY_JSON_DATA)))

        if (isEmpty) it("saves the empty data to a generated key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(KEYNAME_REGEX),
            expect.objectContaining({})))

        it("returns an entity with the expected number of properties", () =>
          expect(Object.keys(entity)).toHaveLength(isEmpty ? 2 : 5))

        it("returns an entity with a generated id and key", () => {
          expect(entity.entityId).toMatch(ULID_REGEX)
          expect(entity.keyName).toMatch(KEYNAME_REGEX)
        })

        if (!isEmpty) it("returns an entity with the expected properties", () => {
          expect(entity.aString).toBe(A_STRING)
          expect(entity.aNumber).toBe(A_NUMBER)
          expect(entity.aBoolean).toBe(true)
        })
      })

      describe.each([
        [ "with entity data *and* an entity id", ENTITY_DATA, false ],
        [ "with entity data that mistakenly has and entityId and keyName defined *and* an entity id", ENTITY_DATA_WITH_ID, false ],
        [ "with empty entity data *and* an entity id", EMPTY_ENTITY_DATA, true ],
        [ "with empty entity data that mistakenly has and entityId and keyName defined *and* an entity id", EMPTY_ENTITY_DATA_WITH_ID, true ]
      ])('%s', (_, entityData, isEmpty) => {

        beforeEach(async () => { entity = await repository.createAndSave('foo', entityData) })

        if (!isEmpty) it("saves the entity data to the provide key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            'SimpleEntity:foo',
            expect.objectContaining(ENTITY_JSON_DATA)))

        if (isEmpty) it("saves the empty data to the provided key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching('SimpleEntity:foo'),
            expect.objectContaining({})))

        it("returns an entity with the expected number of properties", () =>
          expect(Object.keys(entity)).toHaveLength(isEmpty ? 2 : 5))

        it("returns an entity with the provided id and key", () => {
          expect(entity.entityId).toBe('foo')
          expect(entity.keyName).toBe('SimpleEntity:foo')
        })

        if (!isEmpty) it("returns an entity with the expected properties", () => {
          expect(entity.aString).toBe(A_STRING)
          expect(entity.aNumber).toBe(A_NUMBER)
          expect(entity.aBoolean).toBe(true)
        })
      })
    })
  })
})
