import Globals from '../helpers/globals';
import { fetchHashKeys, fetchHashFields, keyExists } from '../helpers/redis-helper';
import { Bigfoot, createBigfootSchema, A_BIGFOOT_SIGHTING, } from '../helpers/bigfoot-data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { EntityId } from '../../lib/entity/entity-types';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entity: Bigfoot;

  beforeAll(() => {
    client = globals.client;
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("when saving a new entity", () => {
    let entityId: EntityId;
    let expectedKey: string;

    describe("a simple entity", () => {
      beforeEach(async () => {
        entity = repository.create();
        entity.title = A_BIGFOOT_SIGHTING.title;
        entity.county = A_BIGFOOT_SIGHTING.county;
        entity.state = A_BIGFOOT_SIGHTING.state;
        entity.eyewitness = A_BIGFOOT_SIGHTING.eyewitness;
        entity.temperature = A_BIGFOOT_SIGHTING.temperature;
        entity.tags = A_BIGFOOT_SIGHTING.tags;
        entityId = await repository.save(entity);
        expectedKey = `Bigfoot:${entityId}`;
      });

      it("creates the expected fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, expectedKey);
        expect(fields).toHaveLength(6);
        expect(fields).toContainEqual('title');
        expect(fields).toContainEqual('county');
        expect(fields).toContainEqual('state');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
        expect(fields).toContainEqual('tags');
      });

      it("stores the expected values in a Redis Hash", async () => {
        let values = await fetchHashFields(client, expectedKey, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([
          A_BIGFOOT_SIGHTING.title,
          A_BIGFOOT_SIGHTING.county,
          A_BIGFOOT_SIGHTING.state,
          '1',
          A_BIGFOOT_SIGHTING.temperature?.toString(),
          A_BIGFOOT_SIGHTING.tags?.join(',')]);
      });
    });

    describe("a sparsely populated entity", () => {
      beforeEach(async () => {
        entity = repository.create();
        entity.state = A_BIGFOOT_SIGHTING.state;
        entity.eyewitness = A_BIGFOOT_SIGHTING.eyewitness;
        entity.temperature = A_BIGFOOT_SIGHTING.temperature;
        entityId = await repository.save(entity);
        expectedKey = `Bigfoot:${entityId}`;
      });

      it("creates the expected fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, expectedKey);
        expect(fields).toHaveLength(3);
        expect(fields).toContainEqual('state');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
      });

      it("stores the expected values in a Redis Hash", async () => {
        let values = await fetchHashFields(client, expectedKey, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([
          null,
          null,
          A_BIGFOOT_SIGHTING.state,
          '1',
          A_BIGFOOT_SIGHTING.temperature?.toString(),
          null]);
      });
    });

    describe("a sparsely populated entity with explicit null and undefined", () => {
      beforeEach(async () => {
        entity = repository.create();
        entity.title = A_BIGFOOT_SIGHTING.title;
        entity.county = null;
        entity.state = undefined;
        entity.eyewitness = null;
        entity.temperature = undefined;
        entity.tags = null;
        entityId = await repository.save(entity);
        expectedKey = `Bigfoot:${entityId}`;
      });

      it("creates the expected fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, expectedKey);
        expect(fields).toHaveLength(1);
        expect(fields).toContainEqual('title');
      });

      it("stores the expected values in a Redis Hash", async () => {
        let values = await fetchHashFields(client, expectedKey, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([A_BIGFOOT_SIGHTING.title, null, null, null, null, null]);
      });
    });

    describe("an unpopulated entity with all nulls and undefineds", () => {
      beforeEach(async () => {
        entity = repository.create();
        entity.title = undefined;
        entity.county = null;
        entity.state = undefined;
        entity.eyewitness = null;
        entity.temperature = undefined;
        entity.tags = null;
        entityId = await repository.save(entity);
        expectedKey = `Bigfoot:${entityId}`;
      });

      it("creates no fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, expectedKey);
        expect(fields).toHaveLength(0);
      });

      it("stores nothing in the Redis Hash", async () => {
        let values = await fetchHashFields(client, expectedKey, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([null, null, null, null, null, null]);
      });

      it("doesn't even store the key", async () => {
        let exists = await keyExists(client, expectedKey);
        expect(exists).toBe(false);
      });
    });
  });
});
