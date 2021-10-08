import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Search from "../../lib/search/search";

import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {

  let client: Client;
  let search: Search<SimpleEntity>;
  let entities: SimpleEntity[];

  describe("#run", () => {

    beforeAll(() => client = new Client());
    beforeEach(() => search = new Search<SimpleEntity>(simpleSchema, client));

    describe("when querying no results", () => {
      beforeEach(async () => {
        mocked(Client.prototype.search).mockResolvedValue(['0']);
        entities = await search.run();
      });

      it("returns no results", async () => {
        expect(entities).toHaveLength(0);
      });
    });

    describe("when querying a single result", () => {
      beforeEach(async () => {
        mocked(Client.prototype.search).mockResolvedValue([
          '1',
          'SimpleEntity:1', [
            'aString', 'foo',
            'aNumber', '42',
            'aBoolean', '0',
            'anArray', 'foo|bar|baz' ]]);
        entities = await search.run();
      });

      it("returns a single result", async () => expect(entities).toHaveLength(1));

      describe("single result", () => {
        let entity: SimpleEntity;

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
        mocked(Client.prototype.search).mockResolvedValue([
          '1',
          'SimpleEntity:1', [
            'aString', 'foo',
            'aNumber', '42',
            'aBoolean', '0',
            'anArray', 'foo|bar|baz' ],
          'SimpleEntity:2', [
            'aString', 'bar',
            'aNumber', '23',
            'aBoolean', '1',
            'anArray', 'bar|baz|qux' ],
          'SimpleEntity:3', [
            'aString', 'baz',
            'aNumber', '13',
            'aBoolean', '0',
            'anArray', 'baz|qux|quux' ]]);
        entities = await search.run();
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
  });
});
