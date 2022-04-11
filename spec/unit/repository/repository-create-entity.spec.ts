import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { HashRepository } from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';
import {
  A_NUMBER, A_STRING, SOME_STRINGS, SOME_TEXT, A_DATE, A_POINT,
  SOME_OTHER_STRINGS, SOME_OTHER_TEXT, ANOTHER_DATE, ANOTHER_POINT } from '../../helpers/example-data';

jest.mock('../../../lib/client');

const ULID_REGEX = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let entity: SimpleEntity;

  describe('#createEntity', () => {

    beforeAll(() => client = new Client());
    beforeEach(() => repository = new HashRepository(simpleSchema, client));

    describe("when creating an entity", () => {
      beforeEach(() => entity = repository.createEntity());

      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has empty properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe(null);
        expect(entity.someText).toBe(null);
        expect(entity.aPoint).toBe(null);
        expect(entity.aDate).toBe(null);
        expect(entity.someStrings).toBe(null);
      });
    });

    describe("when creating an entity with data", () => {
      beforeEach(() => entity = repository.createEntity({
        aBoolean: true, aNumber: A_NUMBER, aString: A_STRING, someText: SOME_TEXT,
        aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS }));

      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
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

    describe("when creating an entity with missing data", () => {
      beforeEach(() => entity = repository.createEntity({ aString: A_STRING, someStrings: SOME_STRINGS }));
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe(A_STRING);
        expect(entity.someText).toBe(null);
        expect(entity.aPoint).toBe(null);
        expect(entity.aDate).toBe(null);
        expect(entity.someStrings).toEqual(SOME_STRINGS);
      });
    });

    describe("when creating an entity with extra data", () => {
      beforeEach(() => entity = repository.createEntity({
        aBoolean: true, aNumber: A_NUMBER, aString: A_STRING,
        anotherBoolean: false, anotherNumber: 23, anotherString: 'bar',
        someText: SOME_TEXT, someOtherText: SOME_OTHER_TEXT,
        aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS,
        anotherPoint: ANOTHER_POINT, anotherDate: ANOTHER_DATE, someOtherStrings: SOME_OTHER_STRINGS }));

      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(A_NUMBER);
        expect(entity.aString).toBe(A_STRING);
        expect(entity.someText).toBe(SOME_TEXT);
        expect(entity.aPoint).toEqual(A_POINT);
        expect(entity.aDate).toEqual(A_DATE);
        expect(entity.someStrings).toEqual(SOME_STRINGS);
      });
      ;

    it("complains when creating an entity with mismatched data", () => {
      expect(() => entity = repository.createEntity({
          aBoolean: A_NUMBER,
          aNumber: A_STRING,
          aString: A_POINT,
          someText: A_DATE,
          aPoint: SOME_STRINGS,
          aDate: SOME_OTHER_STRINGS,
          someStrings: A_NUMBER
        })).toThrowError();
      });
    });
  });
});
