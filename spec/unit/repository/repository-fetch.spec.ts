import '../helpers/mock-client'
import { Client } from '$lib/client';
import { Repository } from '$lib/repository';
import { JsonRepository, HashRepository } from '$lib/repository';

import {
  A_NUMBER, A_NUMBER_STRING, A_STRING, SOME_TEXT,
  SOME_STRINGS, SOME_STRINGS_JOINED,
  A_DATE, A_DATE_EPOCH, A_POINT, A_POINT_STRING
} from '../../helpers/example-data';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';


describe("Repository", () => {

  let client: Client;
  let entityId = 'foo';

  describe("#fetch", () => {

    beforeAll(() => {
      client = new Client()
    });

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
        vi.mocked(client.hgetall).mockResolvedValue(data.mockedData)
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
        vi.mocked(client.jsonget).mockResolvedValue(data.mockedData)
        entity = await repository.fetch(entityId);
      });

      it("returns the expected entity", () =>
        expect(entity).toEqual(expect.objectContaining({ entityId, ...data.expectedData })));
    });

    const fullHashMock = { aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '0', someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH.toString(), someStrings: SOME_STRINGS_JOINED };
    const partialHashMock = { aString: A_STRING, aNumber: A_NUMBER_STRING };
    const emptyHashMock = {}

    const fullJsonMock = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH, someStrings: SOME_STRINGS };
    const partialJsonMock = { aString: A_STRING, aNumber: A_NUMBER };
    const emptyJsonMock = {};

    const expectedFull = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS };
    const expectedPartial = { aString: A_STRING, aNumber: A_NUMBER, aBoolean: null, someText: null, aDate: null, aPoint: null, someStrings: null };
    const expectedEmpty = { aString: null, aNumber: null, aBoolean: null, aDate: null, someText: null, aPoint: null, someStrings: null };

    describe("when fetching a single Hash", () => {

      let repository: Repository<SimpleHashEntity>;
      let enitity: SimpleHashEntity;

      beforeAll(() => {
        client = new Client()
      });

      beforeEach(async () => {
        repository = new HashRepository(simpleHashSchema, client);
        vi.mocked(client.hgetall)
          .mockResolvedValue(fullHashMock);
          enitity = await repository.fetch('foo');
      });

      it("returns the expected type", () =>
        expect(enitity).toBeInstanceOf(SimpleHashEntity));

      it("returns the expected entity", () =>
        expect(enitity).toEqual(
          expect.objectContaining({ entityId: 'foo', ...expectedFull })
        ));
    });

    describe("when fetching multiple Hashes", () => {

      let repository: Repository<SimpleHashEntity>;
      let entities: SimpleHashEntity[];

      beforeAll(() => {
        client = new Client()
      });

      beforeEach(async () => {
        repository = new HashRepository(simpleHashSchema, client);
        vi.mocked(client.hgetall)
          .mockResolvedValueOnce(fullHashMock)
          .mockResolvedValueOnce(partialHashMock)
          .mockResolvedValue(emptyHashMock);
        entities = await repository.fetch('foo', 'bar', 'baz');
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

    describe("when fetching an array of Hashes", () => {

      let repository: Repository<SimpleHashEntity>;
      let entities: SimpleHashEntity[];

      beforeAll(() => {
        client = new Client()
      });

      beforeEach(async () => {
        repository = new HashRepository(simpleHashSchema, client);
        vi.mocked(client.hgetall)
          .mockResolvedValueOnce(fullHashMock)
          .mockResolvedValueOnce(partialHashMock)
          .mockResolvedValue(emptyHashMock);
        entities = await repository.fetch(['foo', 'bar', 'baz']);
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

    describe("when fetching a single JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let enitity: SimpleJsonEntity;

      beforeAll(() => {
        client = new Client()
      });

      beforeEach(async () => {
        repository = new JsonRepository(simpleJsonSchema, client);
        vi.mocked(client.jsonget)
          .mockResolvedValue(fullJsonMock);
          enitity = await repository.fetch('foo');
      });

      it("returns the expected type", () =>
        expect(enitity).toBeInstanceOf(SimpleJsonEntity));

      it("returns the expected entity", () =>
        expect(enitity).toEqual(
          expect.objectContaining({ entityId: 'foo', ...expectedFull })
        ));
    });

    describe("when fetching multiple JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entities: SimpleJsonEntity[];

      beforeEach(async () => {
        repository = new JsonRepository(simpleJsonSchema, client);
        vi.mocked(client.jsonget)
          .mockResolvedValueOnce(fullJsonMock)
          .mockResolvedValueOnce(partialJsonMock)
          .mockResolvedValue(emptyJsonMock)

        entities = await repository.fetch('foo', 'bar', 'baz');
      });

      it("returns the expected entity", () =>
        expect(entities).toEqual(expect.arrayContaining([
          expect.objectContaining({ entityId: 'foo', ...expectedFull }),
          expect.objectContaining({ entityId: 'bar', ...expectedPartial }),
          expect.objectContaining({ entityId: 'baz', ...expectedEmpty })
        ])));
    });

    describe("when fetching an array of JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entities: SimpleJsonEntity[];

      beforeEach(async () => {
        repository = new JsonRepository(simpleJsonSchema, client);
        vi.mocked(client.jsonget)
          .mockResolvedValueOnce(fullJsonMock)
          .mockResolvedValueOnce(partialJsonMock)
          .mockResolvedValue(emptyJsonMock)

        entities = await repository.fetch(['foo', 'bar', 'baz']);
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