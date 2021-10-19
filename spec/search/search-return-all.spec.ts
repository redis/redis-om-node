import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Search from "../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {

  let client: Client;

  describe("#return", () => {

    beforeAll(() => client = new Client());

    describe("when running against hashes", () => {
      let search: Search<SimpleHashEntity>;
      let entities: SimpleHashEntity[];

      beforeEach(() => search = new Search<SimpleHashEntity>(simpleHashSchema, client));

      describe("when querying no results", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search).mockResolvedValue(['0']);
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 0, 10);
        });

        it("returns no results", () => expect(entities).toHaveLength(0));
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '1',
              'SimpleHashEntity:1', [
                'aString', 'foo',
                'aNumber', '42',
                'aBoolean', '0',
                'anArray', 'foo|bar|baz' ]])
            .mockResolvedValue(['1']);
          entities = await search.returnAll();
        });

        it("askes the client for a a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 0, 10);
        });

        it("returns a single result", async () => expect(entities).toHaveLength(1));

        describe("single result", () => {
          let entity: SimpleHashEntity;

          beforeEach(() => entity = entities[0]);

          it("has the expected entity id", () => expect(entity.entityId).toBe('1'));

          it("has the expected properties", async () => {
            expect(entity.aString).toBe('foo');
            expect(entity.aNumber).toBe(42);
            expect(entity.aBoolean).toBe(false);
            expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]);
          });
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '3',
              'SimpleHashEntity:1', [
                'aString', 'foo',
                'aNumber', '42',
                'aBoolean', '0',
                'anArray', 'foo|bar|baz' ],
              'SimpleHashEntity:2', [
                'aString', 'bar',
                'aNumber', '23',
                'aBoolean', '1',
                'anArray', 'bar|baz|qux' ],
              'SimpleHashEntity:3', [
                'aString', 'baz',
                'aNumber', '13',
                'aBoolean', '0',
                'anArray', 'baz|qux|quux' ]])
            .mockResolvedValue(['3']);
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 0, 10);
        });

        it("returns all the results", async () => expect(entities).toHaveLength(3));

        it("has the expected entity ids", () => {
          expect(entities[0].entityId).toBe('1');
          expect(entities[1].entityId).toBe('2');
          expect(entities[2].entityId).toBe('3');
        });

        it("has the expected properties", async () => {
          expect(entities[0].aString).toBe('foo');
          expect(entities[0].aNumber).toBe(42);
          expect(entities[0].aBoolean).toBe(false);
          expect(entities[0].anArray).toEqual([ 'foo', 'bar', 'baz' ]);

          expect(entities[1].aString).toBe('bar');
          expect(entities[1].aNumber).toBe(23);
          expect(entities[1].aBoolean).toBe(true);
          expect(entities[1].anArray).toEqual([ 'bar', 'baz', 'qux' ]);

          expect(entities[2].aString).toBe('baz');
          expect(entities[2].aNumber).toBe(13);
          expect(entities[2].aBoolean).toBe(false);
          expect(entities[2].anArray).toEqual([ 'baz', 'qux', 'quux' ]);
        });
      });

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '5',
              'SimpleHashEntity:1', [
                'aString', 'foo',
                'aNumber', '42',
                'aBoolean', '0',
                'anArray', 'foo|bar|baz' ],
              'SimpleHashEntity:2', [
                'aString', 'bar',
                'aNumber', '23',
                'aBoolean', '1',
                'anArray', 'bar|baz|qux' ]])
            .mockResolvedValueOnce([
              '5',
              'SimpleHashEntity:3', [
                'aString', 'baz',
                'aNumber', '13',
                'aBoolean', '0',
                'anArray', 'baz|qux|quux' ],
              'SimpleHashEntity:4', [
                'aString', 'qux',
                'aNumber', '7',
                'aBoolean', '1',
                'anArray', 'qux|quux|quuux' ]])
            .mockResolvedValueOnce([
              '5',
              'SimpleHashEntity:5', [
                'aString', 'quux',
                'aNumber', '37',
                'aBoolean', '0',
                'anArray', 'quux|quuux|quuuux' ]])
            .mockResolvedValue(['5']);
          entities = await search.returnAll({ pageSize: 2 });
        });

        it("askes the client for multiple pages of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(3);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 0, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 2, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', 4, 2);
        });

        it("returns all the results", async () => expect(entities).toHaveLength(5));

        it("has the expected entity ids", () => {
          expect(entities[0].entityId).toBe('1');
          expect(entities[1].entityId).toBe('2');
          expect(entities[2].entityId).toBe('3');
          expect(entities[3].entityId).toBe('4');
          expect(entities[4].entityId).toBe('5');
        });

        it("has the expected properties", async () => {
          expect(entities[0].aString).toBe('foo');
          expect(entities[0].aNumber).toBe(42);
          expect(entities[0].aBoolean).toBe(false);
          expect(entities[0].anArray).toEqual([ 'foo', 'bar', 'baz' ]);

          expect(entities[1].aString).toBe('bar');
          expect(entities[1].aNumber).toBe(23);
          expect(entities[1].aBoolean).toBe(true);
          expect(entities[1].anArray).toEqual([ 'bar', 'baz', 'qux' ]);

          expect(entities[2].aString).toBe('baz');
          expect(entities[2].aNumber).toBe(13);
          expect(entities[2].aBoolean).toBe(false);
          expect(entities[2].anArray).toEqual([ 'baz', 'qux', 'quux' ]);

          expect(entities[3].aString).toBe('qux');
          expect(entities[3].aNumber).toBe(7);
          expect(entities[3].aBoolean).toBe(true);
          expect(entities[3].anArray).toEqual([ 'qux', 'quux', 'quuux' ]);

          expect(entities[4].aString).toBe('quux');
          expect(entities[4].aNumber).toBe(37);
          expect(entities[4].aBoolean).toBe(false);
          expect(entities[4].anArray).toEqual([ 'quux', 'quuux', 'quuuux' ]);
        });
      });
    });

    describe("when running against JSON objects", () => {
      let search: Search<SimpleJsonEntity>;
      let entities: SimpleJsonEntity[];

      beforeEach(() => search = new Search<SimpleJsonEntity>(simpleJsonSchema, client));

      describe("when querying no results", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search).mockResolvedValue(['0']);
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 0, 10);
        });

        it("returns no results", async () => {
          expect(entities).toHaveLength(0);
        });
      });

      describe("when querying a single result", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '1',
              'SimpleJsonEntity:1', [ '$', `{
                "aString": "foo",
                "aNumber": 42,
                "aBoolean": false,
                "anArray": [ "foo", "bar", "baz" ] }`]])
              .mockResolvedValue(['1']);
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 0, 10);
        });

        it("returns a single result", async () => expect(entities).toHaveLength(1));

        describe("single result", () => {
          let entity: SimpleJsonEntity;

          beforeEach(() => entity = entities[0]);

          it("has the expected entity id", () => expect(entity.entityId).toBe('1'));

          it("has the expected properties", async () => {
            expect(entity.aString).toBe('foo');
            expect(entity.aNumber).toBe(42);
            expect(entity.aBoolean).toBe(false);
            expect(entity.anArray).toEqual([ 'foo', 'bar', 'baz' ]);
          });
        });
      });

      describe("when querying multiple results", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '3',
              'SimpleJsonEntity:1', [ '$', `{
                "aString": "foo",
                "aNumber": 42,
                "aBoolean": false,
                "anArray": [ "foo", "bar", "baz" ] }`],
              'SimpleJsonEntity:2', [ '$', `{
                "aString": "bar",
                "aNumber": 23,
                "aBoolean": true,
                "anArray": [ "bar", "baz", "qux" ] }`],
              'SimpleJsonEntity:3', [ '$', `{
                "aString": "baz",
                "aNumber": 13,
                "aBoolean": false,
                "anArray": [ "baz", "qux", "quux" ] }`]])
            .mockResolvedValue(['3']);
          entities = await search.returnAll();
        });

        it("askes the client for a single page of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 0, 10);
        });

        it("returns all the results", async () => expect(entities).toHaveLength(3));

        it("has the expected entity ids", () => {
          expect(entities[0].entityId).toBe('1');
          expect(entities[1].entityId).toBe('2');
          expect(entities[2].entityId).toBe('3');
        });

        it("has the expected properties", async () => {
          expect(entities[0].aString).toBe('foo');
          expect(entities[0].aNumber).toBe(42);
          expect(entities[0].aBoolean).toBe(false);
          expect(entities[0].anArray).toEqual([ 'foo', 'bar', 'baz' ]);

          expect(entities[1].aString).toBe('bar');
          expect(entities[1].aNumber).toBe(23);
          expect(entities[1].aBoolean).toBe(true);
          expect(entities[1].anArray).toEqual([ 'bar', 'baz', 'qux' ]);

          expect(entities[2].aString).toBe('baz');
          expect(entities[2].aNumber).toBe(13);
          expect(entities[2].aBoolean).toBe(false);
          expect(entities[2].anArray).toEqual([ 'baz', 'qux', 'quux' ]);
        });
      });

      describe("when querying multiple results that cross the page boundry", () => {
        beforeEach(async () => {
          mocked(Client.prototype.search)
            .mockResolvedValueOnce([
              '5',
              'SimpleJsonEntity:1', [ '$', `{
                "aString": "foo",
                "aNumber": 42,
                "aBoolean": false,
                "anArray": [ "foo", "bar", "baz" ] }`],
              'SimpleJsonEntity:2', [ '$', `{
                "aString": "bar",
                "aNumber": 23,
                "aBoolean": true,
                "anArray": [ "bar", "baz", "qux" ] }`]])
            .mockResolvedValueOnce([
              '5',
              'SimpleJsonEntity:3', [ '$', `{
                "aString": "baz",
                "aNumber": 13,
                "aBoolean": false,
                "anArray": [ "baz", "qux", "quux" ] }`],
              'SimpleJsonEntity:4', [ '$', `{
                "aString": "qux",
                "aNumber": 7,
                "aBoolean": true,
                "anArray": [ "qux", "quux", "quuux" ] }`]])
            .mockResolvedValueOnce([
              '5',
              'SimpleJsonEntity:5', [ '$', `{
                "aString": "quux",
                "aNumber": 37,
                "aBoolean": false,
                "anArray": [ "quux", "quuux", "quuuux" ] }`]])
            .mockResolvedValue(['5']);
          entities = await search.returnAll({ pageSize: 2 });
        });

        it("askes the client for a multiple pages of results", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(3);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 0, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 2, 2);
          expect(Client.prototype.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', 4, 2);
        });

        it("returns all the results", async () => expect(entities).toHaveLength(5));

        it("has the expected entity ids", () => {
          expect(entities[0].entityId).toBe('1');
          expect(entities[1].entityId).toBe('2');
          expect(entities[2].entityId).toBe('3');
          expect(entities[3].entityId).toBe('4');
          expect(entities[4].entityId).toBe('5');
        });

        it("has the expected properties", async () => {
          expect(entities[0].aString).toBe('foo');
          expect(entities[0].aNumber).toBe(42);
          expect(entities[0].aBoolean).toBe(false);
          expect(entities[0].anArray).toEqual([ 'foo', 'bar', 'baz' ]);

          expect(entities[1].aString).toBe('bar');
          expect(entities[1].aNumber).toBe(23);
          expect(entities[1].aBoolean).toBe(true);
          expect(entities[1].anArray).toEqual([ 'bar', 'baz', 'qux' ]);

          expect(entities[2].aString).toBe('baz');
          expect(entities[2].aNumber).toBe(13);
          expect(entities[2].aBoolean).toBe(false);
          expect(entities[2].anArray).toEqual([ 'baz', 'qux', 'quux' ]);

          expect(entities[3].aString).toBe('qux');
          expect(entities[3].aNumber).toBe(7);
          expect(entities[3].aBoolean).toBe(true);
          expect(entities[3].anArray).toEqual([ 'qux', 'quux', 'quuux' ]);

          expect(entities[4].aString).toBe('quux');
          expect(entities[4].aNumber).toBe(37);
          expect(entities[4].aBoolean).toBe(false);
          expect(entities[4].anArray).toEqual([ 'quux', 'quuux', 'quuuux' ]);
        });
      });
    });
  });
});
