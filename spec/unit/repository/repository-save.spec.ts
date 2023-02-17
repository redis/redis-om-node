import '../helpers/mock-client'

import { Client } from '$lib/client'
import { Repository } from '$lib/repository'
import { Schema, SchemaDefinition } from '$lib/schema'

import { A_STRING, A_NUMBER, A_NUMBER_STRING } from '../../helpers/example-data'
import { Entity, EntityId, EntityKeyName } from '$lib/entity'

const aSimpleSchemaDef: SchemaDefinition = {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' }
}

const simpleHashSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'HASH' })
const simpleJsonSchema = new Schema("SimpleEntity", aSimpleSchemaDef, { dataStructure: 'JSON' })

const EMPTY_ENTITY = {}
const EMPTY_ENTITY_WITH_ID = { [EntityId]: 'foo', [EntityKeyName]: 'key:foo' }
const ENTITY = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const ENTITY_WITH_ID = { [EntityId]: 'foo', [EntityKeyName]: 'key:foo', aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }

const ENTITY_HASH_DATA = { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '1' }
const ENTITY_JSON_DATA = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: true }
const ULID_REGEX = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/
const KEYNAME_REGEX = /^SimpleEntity:[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/


describe("Repository", () => {
  describe("#save", () => {

    let client: Client
    let returnedEntity: Entity

    beforeAll(() => { client = new Client() })

    describe("to a Hash", () => {
      let repository: Repository

      beforeAll(() => { repository = new Repository(simpleHashSchema, client) })

      describe.each([
        [ "when saving an entity without an entityId", ENTITY, ULID_REGEX, KEYNAME_REGEX, false ],
        [ "when saving an entity with an entityId", ENTITY_WITH_ID, 'foo', 'SimpleEntity:foo', false ],
        [ "when saving an empty entity without an entityId", EMPTY_ENTITY, ULID_REGEX, KEYNAME_REGEX, true ],
        [ "when saving an empty entity with an entityId", EMPTY_ENTITY_WITH_ID, 'foo', 'SimpleEntity:foo', true ]
      ])('%s', (_, entity, entityIdRegex, keyNameRegex, isEmpty) => {

        beforeEach(async () => { returnedEntity = await repository.save(entity) })

        it("returns the expected entity", () => expect(returnedEntity).toEqual({
          ...entity,
          [EntityId]: expect.stringMatching(entityIdRegex),
          [EntityKeyName]: expect.stringMatching(keyNameRegex)
        }))

        if (!isEmpty) it("saves the entity data to the key", () =>
          expect(client.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining(ENTITY_HASH_DATA)))

        if (isEmpty) it("unlinks the expected key", () =>
          expect(client.unlink).toHaveBeenCalledWith(expect.stringMatching(keyNameRegex)))
      })

      describe.each([
        [ "when saving an entity without an entityId but with a provided id", 'foo', ENTITY, 'foo', 'SimpleEntity:foo', false ],
        [ "when saving an entity with an entityId *and* a provided id", 'bar', ENTITY_WITH_ID, 'bar', 'SimpleEntity:bar', false ],
        [ "when saving an empty entity without an entityId but with a provided id", 'foo', EMPTY_ENTITY, 'foo', 'SimpleEntity:foo', true ],
        [ "when saving an empty entity with an entityId *and* a provided id", 'bar', EMPTY_ENTITY_WITH_ID, 'bar', 'SimpleEntity:bar', true ],
      ])('%s', (_, id, entity, entityIdRegex, keyNameRegex, isEmpty) => {

        beforeEach(async () => { returnedEntity = await repository.save(id, entity) })

        it("returns the expected entity", () => expect(returnedEntity).toEqual({
          ...entity,
          [EntityId]: expect.stringMatching(entityIdRegex),
          [EntityKeyName]: expect.stringMatching(keyNameRegex)
        }))

        if (!isEmpty) it("saves the entity data to the key", () =>
          expect(client.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining(ENTITY_HASH_DATA)))

        if (isEmpty) it("unlinks the expected key", () =>
          expect(client.unlink).toHaveBeenCalledWith(expect.stringMatching(keyNameRegex)))
      })
    })

    describe("to JSON", () => {

      let repository: Repository

      beforeAll(() => { repository = new Repository(simpleJsonSchema, client) })

      describe.each([
        [ "when saving an entity without an entityId", ENTITY, ULID_REGEX, KEYNAME_REGEX, false ],
        [ "when saving an entity with an entityId", ENTITY_WITH_ID, 'foo', 'SimpleEntity:foo', false ],
        [ "when saving an empty entity without an entityId", EMPTY_ENTITY, ULID_REGEX, KEYNAME_REGEX, true ],
        [ "when saving an empty entity with an entityId", EMPTY_ENTITY_WITH_ID, 'foo', 'SimpleEntity:foo', true ]
      ])('%s', (_, entity, entityIdRegex, keyNameRegex, isEmpty) => {

        beforeEach(async () => { returnedEntity = await repository.save(entity) })

        describe("the returned entity", () => {
          it("has a generated entity id", () => expect(returnedEntity[EntityId]).toMatch(entityIdRegex))
          it("has a keyname based on the entity id", () => expect(returnedEntity[EntityKeyName]).toMatch(keyNameRegex))

          if (isEmpty) {
            it("has populated properties", () => {
              expect(returnedEntity.aString).toBeUndefined()
              expect(returnedEntity.aNumber).toBeUndefined()
              expect(returnedEntity.aBoolean).toBeUndefined()
            })
          } else {
            it("has populated properties", () => {
              expect(returnedEntity.aString).toBe(A_STRING)
              expect(returnedEntity.aNumber).toBe(A_NUMBER)
              expect(returnedEntity.aBoolean).toBe(true)
            })
          }
        })

        if (!isEmpty) it("saves the entity data to the key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining(ENTITY_JSON_DATA)))

        if (isEmpty) it("save the empty data to the key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining({})))
      })

      describe.each([
        [ "when saving an entity without an entityId but with a provided id", 'foo', ENTITY, 'foo', 'SimpleEntity:foo', false ],
        [ "when saving an entity with an entityId *and* a provided id", 'bar', ENTITY_WITH_ID, 'bar', 'SimpleEntity:bar', false ],
        [ "when saving an empty entity without an entityId but with a provided id", 'foo', EMPTY_ENTITY, 'foo', 'SimpleEntity:foo', true ],
        [ "when saving an empty entity with an entityId *and* a provided id", 'bar', EMPTY_ENTITY_WITH_ID, 'bar', 'SimpleEntity:bar', true ],
      ])('%s', (_, id, entity, entityIdRegex, keyNameRegex, isEmpty) => {

        beforeEach(async () => { returnedEntity = await repository.save(id, entity) })

        describe("the returned entity", () => {
          it("has a generated entity id", () => expect(returnedEntity[EntityId]).toMatch(entityIdRegex))
          it("has a keyname based on the entity id", () => expect(returnedEntity[EntityKeyName]).toMatch(keyNameRegex))

          if (isEmpty) {
            it("has populated properties", () => {
              expect(returnedEntity.aString).toBeUndefined()
              expect(returnedEntity.aNumber).toBeUndefined()
              expect(returnedEntity.aBoolean).toBeUndefined()
            })
          } else {
            it("has populated properties", () => {
              expect(returnedEntity.aString).toBe(A_STRING)
              expect(returnedEntity.aNumber).toBe(A_NUMBER)
              expect(returnedEntity.aBoolean).toBe(true)
            })
          }
        })

        if (!isEmpty) it("saves the entity data to the key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining(ENTITY_JSON_DATA)))

        if (isEmpty) it("save the empty data to the key", () =>
          expect(client.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(keyNameRegex),
            expect.objectContaining({})))
      })
    })
  })
})
