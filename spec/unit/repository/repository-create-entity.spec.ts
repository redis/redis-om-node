import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let entity: SimpleEntity;

  describe('#createEntity', () => {

    beforeAll(() => client = new Client());

    describe("when creating an entity", () => {
      beforeEach(() => {
        repository = new Repository(simpleSchema, client);
        entity = repository.createEntity();
      });
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));
      it("has no entity data", () => expect(entity.entityData).toEqual({}))
      it("has empty properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe(null);
        expect(entity.aGeoPoint).toBe(null);
        expect(entity.anArray).toBe(null);
      });
    });

    describe("when creating an entity with data", () => {
      beforeEach(() => {
        repository = new Repository(simpleSchema, client);
        entity = repository.createEntity({
          aBoolean: true, aNumber: 42, aString: 'foo',
          aGeoPoint: { longitude: 12.34, latitude: 56.78 },
          anArray: [ 'bar', 'baz', 'qux' ]
        });
      });
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({
        aBoolean: true, aNumber: 42, aString: 'foo',
        aGeoPoint: { longitude: 12.34, latitude: 56.78 },
        anArray: [ 'bar', 'baz', 'qux' ] }))
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(42);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toEqual({ longitude: 12.34, latitude: 56.78 });
        expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
      });
    });

    describe("when creating an entity with missing data", () => {
      beforeEach(() => {
        repository = new Repository(simpleSchema, client);
        entity = repository.createEntity({
          aString: 'foo', anArray: [ 'bar', 'baz', 'qux' ]
        });
      });
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({
        aString: 'foo', anArray: [ 'bar', 'baz', 'qux' ] }))
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(null);
        expect(entity.aNumber).toBe(null);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toBe(null);
        expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
      });
    });

    describe("when creating an entity with extra data", () => {
      beforeEach(() => {
        repository = new Repository(simpleSchema, client);
        entity = repository.createEntity({
          aBoolean: true, aNumber: 42, aString: 'foo', 
          anotherBoolean: false, anotherNumber: 23, anotherString: 'bar',
          aGeoPoint: { longitude: 12.34, latitude: 56.78 },
          anArray: [ 'bar', 'baz', 'qux' ]
        });
      });
  
      it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
      it("has a generated entity id", () => expect(entity.entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));
      it("has the expected entity data", () => expect(entity.entityData).toEqual({
        aBoolean: true, aNumber: 42, aString: 'foo',
        aGeoPoint: { longitude: 12.34, latitude: 56.78 },
        anArray: [ 'bar', 'baz', 'qux' ] }))
      it("has populated properties", () => {
        expect(entity.aBoolean).toBe(true);
        expect(entity.aNumber).toBe(42);
        expect(entity.aString).toBe('foo');
        expect(entity.aGeoPoint).toEqual({ longitude: 12.34, latitude: 56.78 });
        expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
      });
    });

    it("complains when creating an entity with mismatched data", () => {
      repository = new Repository(simpleSchema, client);
      expect(() => entity = repository.createEntity({
          aBoolean: 42,
          aNumber: { longitude: 12.34, latitude: 56.78 },
          aString: [ 'bar', 'baz', 'qux' ],
          aGeoPoint: 'foo',
          anArray: true
        })).toThrowError();
    });
  });
});
