import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';

  describe("#fetch", () => {

    beforeAll(() => client = new Client());

    describe.each([

      [ "when fetching a fully populated entity from a hash", {
        mockedData: { aString: 'foo', aNumber: '42', aBoolean: '0', aGeoPoint: '12.34,56.78', anArray: 'bar|baz|qux' },
        expectedData: { aString: 'foo', aNumber: 42, aBoolean: false, 
          aGeoPoint: { longitude: 12.34, latitude: 56.78 }, anArray: [ 'bar', 'baz', 'qux' ] }
      }],

      [ "when fetching a partially populated entity from a hash", {
        mockedData: { aString: 'foo', aNumber: '42' },
        expectedData: { aString: 'foo', aNumber: 42, aBoolean: null, aGeoPoint: null, anArray: null }
      }],

      [ "when fetching a empty entity from a hash", {
        mockedData: {},
        expectedData: { aString: null, aNumber: null, aBoolean: null, aGeoPoint: null, anArray: null }
      }]

    ])("%s", (_, data) => {

      let repository: Repository<SimpleHashEntity>;
      let entity: SimpleHashEntity;
    
      beforeEach(async () => {
        repository = new Repository(simpleHashSchema, client);
        mocked(Client.prototype.hgetall).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns the expected entity", () =>
        expect(entity).toEqual(expect.objectContaining({ entityId, ...data.expectedData })));
    });

    describe.each([

      ["when fetching a fully populated entity from JSON", {
        mockedData: { aString: 'foo', aNumber: 42, aBoolean: false, aGeoPoint: '12.34,56.78', anArray: [ "bar", "baz", "qux" ] },
        expectedData: { aString: 'foo', aNumber: 42, aBoolean: false,
          aGeoPoint: { longitude: 12.34, latitude: 56.78 }, anArray: [ 'bar', 'baz', 'qux' ] }
      }],

      [ "when fetching a partially populated entity from JSON", {
        mockedData: { aString: 'foo', aNumber: 42 },
        expectedData: { aString: 'foo', aNumber: 42, aBoolean: null, aGeoPoint: null, anArray: null }
      }],

      [ "when fetching an empty entity from JSON", {
        mockedData: {},
        expectedData: { aString: null, aNumber: null, aBoolean: null, aGeoPoint: null, anArray: null }
      }],
      
      [ "when fetching a missing entity from JSON", {
        mockedData: null,
        expectedData: { aString: null, aNumber: null, aBoolean: null, aGeoPoint: null, anArray: null }
      }],
      
      [ "when fetching an entity from JSON with nulls", {
        mockedData: { aString: 'foo', aNumber: 42, aBoolean: null, aGeoPoint: null, anArray: null },
        expectedData: { aString: 'foo', aNumber: 42, aBoolean: null, aGeoPoint: null, anArray: null }
      }]

    ])("%s", (_, data: any) => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeEach(async () => {
        repository = new Repository(simpleJsonSchema, client);
        mocked(Client.prototype.jsonget).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns the expected entity", () =>
        expect(entity).toEqual(expect.objectContaining({ entityId, ...data.expectedData })));
    });
  });
});
