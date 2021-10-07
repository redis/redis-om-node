import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from "../../lib/schema/schema";
import Search from "../../lib/search/search";

jest.mock('../../lib/client');


interface TestEntity {
  aString: string;
  aNumber: number;
  aBoolean: boolean;
}

class TestEntity extends Entity {}

beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  let client: Client;
  let schema: Schema<TestEntity>;
  let search: Search<TestEntity>;

  beforeAll(async () => {
    client = new Client();
    schema = new Schema<TestEntity>(
      TestEntity, {
        aString: { type: 'string' },
        aNumber: { type: 'number' },
        aBoolean: { type: 'boolean' }
      });
  });

  beforeEach(() => {
    search = new Search<TestEntity>(schema, client);
  });

  describe("#run", () => {

    let entities: TestEntity[];

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
          'TestEntity:1', [
            'aString', 'foo',
            'aNumber', '42',
            'aBoolean', '0' ]]);
        entities = await search.run();
      });

      it("returns a single result", async () => expect(entities).toHaveLength(1));

      describe("single result", () => {
        let entity: TestEntity;

        beforeEach(() => entity = entities[0]);

        it("has the expected entity id", () => expect(entity.entityId).toBe('1'));

        it("has the expected properties", async () => {
          expect(entity.aString).toBe('foo');
          expect(entity.aNumber).toBe(42);
          expect(entity.aBoolean).toBe(false);
        });
      });
    });

    describe("when querying multiple results", () => {
      beforeEach(async () => {
        mocked(Client.prototype.search).mockResolvedValue([
          '1',
          'TestEntity:1', [
            'aString', 'foo',
            'aNumber', '42',
            'aBoolean', '0' ],
          'TestEntity:2', [
            'aString', 'bar',
            'aNumber', '23',
            'aBoolean', '1' ],
          'TestEntity:3', [
            'aString', 'baz',
            'aNumber', '13',
            'aBoolean', '0' ]]);
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
        expect(entities[1].aString).toBe('bar');
        expect(entities[1].aNumber).toBe(23);
        expect(entities[1].aBoolean).toBe(true);
        expect(entities[2].aString).toBe('baz');
        expect(entities[2].aNumber).toBe(13);
        expect(entities[2].aBoolean).toBe(false);
      });
    });
  });
});
