import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';

  describe("#fetch", () => {

    beforeAll(() => client = new Client());

    describe.each([

      ["when fetching a fully populated entity from a hash", {
        mockedData: { aString: 'foo', aNumber: '42', aBoolean: '0', anArray: 'bar|baz|qux' },
        expectedString: 'foo', expectedNumber: 42, expectedBoolean: false, expectedArray: [ 'bar', 'baz', 'qux' ]
      }],

      [ "when fetching a partially populated entity from a hash", {
        mockedData: { aString: 'foo', aNumber: '42' },
        expectedString: 'foo', expectedNumber: 42, expectedBoolean: null, expectedArray: null
      }],

      [ "when fetching a empty entity from a hash", {
        mockedData: {},
        expectedString: null, expectedNumber: null, expectedBoolean: null, expectedArray: null
      }]

    ])("%s", (_, data) => {

      let repository: Repository<SimpleHashEntity>;
      let entity: SimpleHashEntity;
    
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client);
        mocked(Client.prototype.hgetall).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns an entity with the expected id", () => expect(entity.entityId).toBe(entityId));

      it("returns an entity with the expected properties", () => {
        expect(entity.aString).toBe(data.expectedString);
        expect(entity.aNumber).toBe(data.expectedNumber);
        expect(entity.aBoolean).toBe(data.expectedBoolean);
        expect(entity.anArray).toEqual(data.expectedArray);
      });
    });

    describe.each([

      ["when fetching a fully populated entity from JSON", {
        mockedData: { aString: 'foo', aNumber: 42, aBoolean: false, anArray: [ "bar", "baz", "qux" ] },
        expectedString: 'foo', expectedNumber: 42, expectedBoolean: false, expectedArray: [ 'bar', 'baz', 'qux' ]
      }],

      [ "when fetching a partially populated entity from JSON", {
        mockedData: { aString: 'foo', aNumber: 42 },
        expectedString: 'foo', expectedNumber: 42, expectedBoolean: null, expectedArray: null
      }],

      [ "when fetching an empty entity from JSON", {
        mockedData: {},
        expectedString: null, expectedNumber: null, expectedBoolean: null, expectedArray: null
      }],
      
      [ "when fetching a missing entity from JSON", {
        mockedData: null,
        expectedString: null, expectedNumber: null, expectedBoolean: null, expectedArray: null
      }],
      
      [ "when fetching an entity from JSON with nulls", {
        mockedData: { aString: 'foo', aNumber: 42, aBoolean: null, anArray: null },
        expectedString: 'foo', expectedNumber: 42, expectedBoolean: null, expectedArray: null
      }]

    ])("%s", (_, data: any) => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client);
        mocked(Client.prototype.jsonget).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns an entity with the expected id", () => expect(entity.entityId).toBe(entityId));

      it("returns an entity with the expected properties", () => {
        expect(entity.aString).toBe(data.expectedString);
        expect(entity.aNumber).toBe(data.expectedNumber);
        expect(entity.aBoolean).toBe(data.expectedBoolean);
        expect(entity.anArray).toEqual(data.expectedArray);
      });
    });
  });
});
