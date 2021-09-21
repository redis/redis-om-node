import Globals from './helpers/globals';
import { fetchHashKeys, fetchHashFields, keyExists } from './helpers/redis-helper';
import { addBigfootSighting, Bigfoot, createSchema, expectMatchesSighting,
  A_BIGFOOT_SIGHTING, A_REDIS_ID, A_REDIS_KEY, ANOTHER_BIGFOOT_SIGHTING} from './helpers/bigfoot-data-helper';

import Client from '../lib/client';
import Schema from '../lib/schema/schema'
import Repository from '../lib/repository';
import { RedisId } from '../lib/entity/entity-types';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entity: Bigfoot;

  beforeAll(() => {
    client = globals.client;
    schema = createSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe("when updating an existing entity", () => {

    let redisId: RedisId;

    beforeEach(async () => {
      addBigfootSighting(client, A_REDIS_KEY, A_BIGFOOT_SIGHTING);
      entity = await repository.fetch(A_REDIS_ID);
    });

    describe("and updating all the fields in the entity", () => {
      beforeEach(async () => {
        entity.title = ANOTHER_BIGFOOT_SIGHTING.title;
        entity.county = ANOTHER_BIGFOOT_SIGHTING.county;
        entity.state = ANOTHER_BIGFOOT_SIGHTING.state;
        entity.eyewitness = ANOTHER_BIGFOOT_SIGHTING.eyewitness;
        entity.temperature = ANOTHER_BIGFOOT_SIGHTING.temperature;
        entity.tags = ANOTHER_BIGFOOT_SIGHTING.tags;
        redisId = await repository.save(entity);
      });

      it("returns the Redis ID", () => expect(redisId).toBe(A_REDIS_ID))

      it("maintains the expected fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, A_REDIS_KEY);
        expect(fields).toHaveLength(6);
        expect(fields).toContainEqual('title');
        expect(fields).toContainEqual('county');
        expect(fields).toContainEqual('state');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
        expect(fields).toContainEqual('tags');
      });

      it("updates the expected values in a Redis Hash", async () => {
        let values = await fetchHashFields(client, A_REDIS_KEY, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([
          ANOTHER_BIGFOOT_SIGHTING.title,
          ANOTHER_BIGFOOT_SIGHTING.county,
          ANOTHER_BIGFOOT_SIGHTING.state,
          '0',
          ANOTHER_BIGFOOT_SIGHTING.temperature?.toString(),
          ANOTHER_BIGFOOT_SIGHTING.tags?.join(',')]);
      });
    });

    describe("and updating some of the fields in the entity", () => {
      beforeEach(async () => {
        entity.eyewitness = ANOTHER_BIGFOOT_SIGHTING.eyewitness;
        entity.temperature = ANOTHER_BIGFOOT_SIGHTING.temperature;
        redisId = await repository.save(entity);
      });

      it("returns the Redis ID", () => expect(redisId).toBe(A_REDIS_ID))

      it("maintains the expected fields in a Redis Hash", async () => {
        let fields = await fetchHashKeys(client, A_REDIS_KEY);
        expect(fields).toHaveLength(6);
        expect(fields).toContainEqual('title');
        expect(fields).toContainEqual('county');
        expect(fields).toContainEqual('state');
        expect(fields).toContainEqual('eyewitness');
        expect(fields).toContainEqual('temperature');
        expect(fields).toContainEqual('tags');
      });

      it("updates the expected values in a Redis Hash", async () => {
        let values = await fetchHashFields(client, A_REDIS_KEY, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([
          A_BIGFOOT_SIGHTING.title,
          A_BIGFOOT_SIGHTING.county,
          A_BIGFOOT_SIGHTING.state,
          '0',
          ANOTHER_BIGFOOT_SIGHTING.temperature?.toString(),
          A_BIGFOOT_SIGHTING.tags?.join(',')]);
      });
    });

    describe("and updating some of the fields in the entity to null or undefined", () => {
      beforeEach(async () => {
        entity.title = ANOTHER_BIGFOOT_SIGHTING.title;
        entity.county = null;
        entity.state = undefined;
        entity.eyewitness = null;
        entity.temperature = undefined;
        entity.tags = null;

        redisId = await repository.save(entity);
      });
      
      it("returns the Redis ID", () => expect(redisId).toBe(A_REDIS_ID))
      
      it("removes the null and undefined field from the Redis Hash", async () => {
        let fields = await fetchHashKeys(client, A_REDIS_KEY);
        expect(fields).toHaveLength(1);
        expect(fields).toContainEqual('title');
      });
      
      it("removes the expected values from the Redis Hash", async () => {
        let values = await fetchHashFields(client, A_REDIS_KEY, 'title', 'county', 'state', 'eyewitness', 'temperature', 'tags');
        expect(values).toEqual([ANOTHER_BIGFOOT_SIGHTING.title, null, null, null, null, null]);
      });
    });

    describe("and updating all of the fields in the entity to null or undefined", () => {
      beforeEach(async () => {
        entity.title = undefined;
        entity.county = null;
        entity.state = undefined;
        entity.eyewitness = null;
        entity.temperature = undefined;
        entity.tags = null;

        redisId = await repository.save(entity);
      });
      
      it("returns the Redis ID", () => expect(redisId).toBe(A_REDIS_ID))
      
      it("removes the null and undefined field from the Redis Hash", async () => {
        let fields = await fetchHashKeys(client, A_REDIS_KEY);
        expect(fields).toHaveLength(0);
      });
      
      it("removes all the values from the Redis Hash", async () => {
        let values = await fetchHashFields(client, A_REDIS_KEY, 'title', 'county', 'state', 'eyewitness', 'temperature');
        expect(values).toEqual([null, null, null, null, null]);
      });

      it("removes the entity from Redis", async () => {
        let exists = await keyExists(client, A_REDIS_KEY)
        expect(exists).toBe(false);
      });
    });
  });
});
