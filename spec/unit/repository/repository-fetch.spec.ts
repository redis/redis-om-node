import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import {
  A_NUMBER, A_NUMBER_STRING, A_STRING, SOME_TEXT,
  SOME_STRINGS, SOME_STRINGS_JOINED,
  A_DATE, A_DATE_EPOCH, A_POINT, A_POINT_STRING
} from '../../helpers/example-data';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';

  describe("#fetch", () => {

    beforeAll(() => client = new Client());

    describe.each([

      ["when fetching a fully populated entity from a hash", {
        mockedData: { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '0', someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH.toString(), someStrings: SOME_STRINGS_JOINED },
        expectedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS }
      }],

      ["when fetching a partially populated entity from a hash", {
        mockedData: { aString: A_STRING, aNumber: A_NUMBER_STRING },
        expectedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aDate: null, aPoint: null, someStrings: null }
      }],

      ["when fetching a empty entity from a hash", {
        mockedData: {},
        expectedData: { aString: null, aNumber: null, aBoolean: null, aDate: null, someText: null, aPoint: null, someStrings: null }
      }]

    ])("%s", (_, data) => {

      let repository: Repository<SimpleHashEntity>;
      let entity: SimpleHashEntity;

      beforeEach(async () => {
        repository = new HashRepository(simpleHashSchema, client);
        mocked(Client.prototype.hgetall).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns the expected entity", () =>
        expect(entity).toEqual(expect.objectContaining({ entityId, ...data.expectedData })));
    });

    describe.each([

      ["when fetching a fully populated entity from JSON", {
        mockedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH, someStrings: SOME_STRINGS },
        expectedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS }
      }],

      ["when fetching a partially populated entity from JSON", {
        mockedData: { aString: A_STRING, aNumber: A_NUMBER },
        expectedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aPoint: null, aDate: null, someStrings: null }
      }],

      ["when fetching an empty entity from JSON", {
        mockedData: {},
        expectedData: { aString: null, aNumber: null, aBoolean: null, someText: null, aPoint: null, aDate: null, someStrings: null }
      }],

      ["when fetching a missing entity from JSON", {
        mockedData: null,
        expectedData: { aString: null, aNumber: null, aBoolean: null, someText: null, aPoint: null, aDate: null, someStrings: null }
      }],

      ["when fetching an entity from JSON with nulls", {
        mockedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aPoint: null, aDate: null, someStrings: null },
        expectedData: { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aPoint: null, aDate: null, someStrings: null }
      }]

    ])("%s", (_, data: any) => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeEach(async () => {
        repository = new JsonRepository(simpleJsonSchema, client);
        mocked(Client.prototype.jsonget).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns the expected entity", () =>
        expect(entity).toEqual(expect.objectContaining({ entityId, ...data.expectedData })));
    });
  });
});
