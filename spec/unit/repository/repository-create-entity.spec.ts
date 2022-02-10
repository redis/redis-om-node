import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import HashRepository from '../../../lib/repository/hash-repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';
import {
  AN_ARRAY, A_DATE, A_GEOPOINT,
  ANOTHER_ARRAY, ANOTHER_DATE, ANOTHER_GEOPOINT } from '../helpers/test-data';

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
      it("has no entity data", () => expect(entity.entityData).toEqual({}));
      it("has empty properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe(null);
        expect(entity.aGeoPoint).toBe(null);
        expect(entity.aDate).toBe(null);
        expect(entity.anArray).toBe(null);
      });
    });

    describe("when creating an entity with data", () => {
      beforeEach(() => entity = repository.createEntity({
        aBoolean: true, aNumber: 42, aString: 'foo', aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY }));
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({
        aBoolean: true, aNumber: 42, aString: 'foo', aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY }));

      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(42);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toEqual(A_GEOPOINT);
        expect(entity.aDate).toEqual(A_DATE);
        expect(entity.anArray).toEqual(AN_ARRAY);
      });
    });

    describe("when creating an entity with missing data", () => {
      beforeEach(() => entity = repository.createEntity({ aString: 'foo', anArray: AN_ARRAY }));
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({ aString: 'foo', anArray: AN_ARRAY }));
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toBe(null);
        expect(entity.aDate).toBe(null);
        expect(entity.anArray).toEqual(AN_ARRAY);
      });
    });

    describe("when creating an entity with extra data", () => {
      beforeEach(() => entity = repository.createEntity({
          aBoolean: true, aNumber: 42, aString: 'foo', 
          anotherBoolean: false, anotherNumber: 23, anotherString: 'bar',
          aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY,
          anotherGeoPoint: ANOTHER_GEOPOINT, anotherDate: ANOTHER_DATE, anotherArray: ANOTHER_ARRAY }));
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(ULID_REGEX));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({
        aBoolean: true, aNumber: 42, aString: 'foo', aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY }))
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(42);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toEqual(A_GEOPOINT);
        expect(entity.aDate).toEqual(A_DATE);
        expect(entity.anArray).toEqual(AN_ARRAY);
      });
    });

    it("complains when creating an entity with mismatched data", () => {
      expect(() => entity = repository.createEntity({
          aBoolean: 42,
          aNumber: 'foo',
          aString: A_GEOPOINT,
          aGeoPoint: A_DATE,
          aDate: AN_ARRAY,
          anArray: true
        })).toThrowError();
    });
  });
});
