import '../helpers/mock-client'
import { Client } from '$lib/client';
import { HashRepository, Repository } from '$lib/repository';

import { simpleSchema } from '../helpers/test-entity-and-schema';
import { A_NUMBER, A_STRING, SOME_STRINGS, SOME_TEXT, A_DATE, A_POINT } from '../../helpers/example-data';
import { Entity } from '$lib/entity/entity';

const ULID_REGEX = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/
const KEYNAME_REGEX = /^SimpleEntity:[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/

describe("Repository", () => {

  let client: Client;
  let repository: Repository;
  let entity: Entity;

  describe('#createEntity', () => {

    beforeAll(() => {
      client = new Client()
    });
    beforeEach(() => {
      repository = new HashRepository(simpleSchema, client)
    });

    describe("when creating an entity", () => {
      beforeEach(() => { entity = repository.createEntity() });

      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toMatch(KEYNAME_REGEX));
      it("is otherwise empty", () => {
        expect(Object.keys(entity)).toHaveLength(2)
        expect(Object.keys(entity)).toEqual(expect.arrayContaining(['entityId', 'keyName']))
      });
    });

    describe("when creating an entity with a provided id", () => {
      beforeEach(() => { entity = repository.createEntity('foo') });

      it("has the provided entity id", () => expect(entity.entityId).toBe('foo'));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toBe(`SimpleEntity:foo`));
      it("is otherwise empty", () => {
        expect(Object.keys(entity)).toHaveLength(2)
        expect(Object.keys(entity)).toEqual(expect.arrayContaining(['entityId', 'keyName']))
      });
    });

    describe("when mistakenly creating an entity with an explicitly defined entityId and keyName", () => {
      beforeEach(() => {
        entity = repository.createEntity({ entityId: 'foo', keyName: 'bar' })
      });

      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toMatch(KEYNAME_REGEX));
      it("is otherwise empty", () => {
        expect(Object.keys(entity)).toHaveLength(2)
        expect(Object.keys(entity)).toEqual(expect.arrayContaining(['entityId', 'keyName']))
      });
    });

    describe("when mistakenly creating an entity with an explicitly defined entityId and keyName and a provided id", () => {
      beforeEach(() => {
        entity = repository.createEntity('foo', { entityId: 'foo', keyName: 'bar' })
      });

      it("has the provided entity id", () => expect(entity.entityId).toBe('foo'));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toBe(`SimpleEntity:foo`));
      it("is otherwise empty", () => {
        expect(Object.keys(entity)).toHaveLength(2)
        expect(Object.keys(entity)).toEqual(expect.arrayContaining(['entityId', 'keyName']))
      });
    });

    describe("when creating an entity with data", () => {
      beforeEach(() => {
        entity = repository.createEntity({
          aBoolean: true, aNumber: A_NUMBER, aString: A_STRING, someText: SOME_TEXT,
          aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS
        })
      });

      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toMatch(KEYNAME_REGEX));
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(A_NUMBER);
        expect(entity.aString).toBe(A_STRING);
        expect(entity.someText).toBe(SOME_TEXT);
        expect(entity.aPoint).toEqual(A_POINT);
        expect(entity.aDate).toEqual(A_DATE);
        expect(entity.someStrings).toEqual(SOME_STRINGS);
      });
    });

    describe("when creating an entity with data and a provided id", () => {
      beforeEach(() => {
        entity = repository.createEntity('foo', {
          aBoolean: true, aNumber: A_NUMBER, aString: A_STRING, someText: SOME_TEXT,
          aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS
        })
      });

      it("has a generated entity id", () => expect(entity.entityId).toBe('foo'));
      it("has a keyname based on the entity id", () => expect(entity.keyName).toBe(`SimpleEntity:foo`));
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(A_NUMBER);
        expect(entity.aString).toBe(A_STRING);
        expect(entity.someText).toBe(SOME_TEXT);
        expect(entity.aPoint).toEqual(A_POINT);
        expect(entity.aDate).toEqual(A_DATE);
        expect(entity.someStrings).toEqual(SOME_STRINGS);
      });
    });
  });
});
