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

  const fullHashMock = { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '0', someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH.toString(), someStrings: SOME_STRINGS_JOINED };
  const partialHashMock = { aString: A_STRING, aNumber: A_NUMBER_STRING };
  const emptyHashMock = {}

  const fullJsonMock = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH, someStrings: SOME_STRINGS };
  const partialJsonMock = { aString: A_STRING, aNumber: A_NUMBER };
  const emptyJsonMock = {};

  const expectedFull = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS };
  const expectedPartial = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aDate: null, aPoint: null, someStrings: null };
  const expectedEmpty = { aString: null, aNumber: null, aBoolean: null, aDate: null, someText: null, aPoint: null, someStrings: null };

  describe("#fetchMany", () => {

    describe("when fetching a Hash", () => {

      let repository: Repository<SimpleHashEntity>;
      let entities: SimpleHashEntity[];

      beforeAll(() => client = new Client());

      beforeEach(async () => {
        repository = new HashRepository(simpleHashSchema, client);
        mocked(Client.prototype.hgetall)
          .mockResolvedValueOnce(fullHashMock)
          .mockResolvedValueOnce(partialHashMock)
          .mockResolvedValue(emptyHashMock);
        entities = await repository.fetchMany('foo', 'bar', 'baz');
      });

      it("returns the expected number of entities", () =>
        expect(entities).toHaveLength(3));

      it("returns the expected entities", () =>
        expect(entities).toEqual(expect.arrayContaining([
          expect.objectContaining({ entityId: 'foo', ...expectedFull }),
          expect.objectContaining({ entityId: 'bar', ...expectedPartial }),
          expect.objectContaining({ entityId: 'baz', ...expectedEmpty })
        ])));
    });

    describe("when fetching JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entities: SimpleJsonEntity[];

      beforeEach(async () => {
        repository = new JsonRepository(simpleJsonSchema, client);
        mocked(Client.prototype.jsonget)
          .mockResolvedValueOnce(fullJsonMock)
          .mockResolvedValueOnce(partialJsonMock)
          .mockResolvedValue(emptyJsonMock)

        entities = await repository.fetchMany('foo', 'bar', 'baz');
      });

      it("returns the expected entity", () =>
        expect(entities).toEqual(expect.arrayContaining([
          expect.objectContaining({ entityId: 'foo', ...expectedFull }),
          expect.objectContaining({ entityId: 'bar', ...expectedPartial }),
          expect.objectContaining({ entityId: 'baz', ...expectedEmpty })
        ])));
    });
  });
});
