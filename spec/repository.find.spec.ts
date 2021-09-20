import Globals from './globals';

import Client from '../lib/client';
import { Schema } from '../lib/schema'
import { Entity } from '../lib/entity';
import Repository from '../lib/repository';

const globals: Globals = (globalThis as unknown) as Globals;

const A_TITLE = "Bigfoot was seen out by the Walmart";
const A_COUNTY = "Athens"
const A_STATE = "OH"
const A_TEMPERATURE = 75;

const ANOTHER_TITLE = "Bigfoot was seen out by the Piggly Wiggly";
const ANOTHER_COUNTY = "Ashland"
const ANOTHER_STATE = "OH"
const ANOTHER_TEMPERATURE = 87;

const A_THIRD_TITLE = "Bigfoot was seen swimming in the river";
const A_THIRD_COUNTY = "Ashland"
const A_THIRD_STATE = "KY"
const A_THIRD_TEMPERATURE = 93;

const A_REDIS_ID = '1';
const ANOTHER_REDIS_ID = '2';
const A_THIRD_REDIS_ID = '3';

const A_REDIS_KEY = `Bigfoot:${A_REDIS_ID}`;
const ANOTHER_REDIS_KEY = `Bigfoot:${ANOTHER_REDIS_ID}`;
const A_THIRD_REDIS_KEY = `Bigfoot:${A_THIRD_REDIS_ID}`;

describe("Repository", () => {

  interface Bigfoot {
    title: string;
    county: string;
    state: string;
    eyewitness: boolean;
    temperature: number;
  }
  
  class Bigfoot extends Entity {}

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entities: Bigfoot[];

  beforeAll(() => {
    client = globals.client;
    schema = new Schema<Bigfoot>(
      Bigfoot, {
        title: { type: 'string', textSearch: true },
        county: { type: 'string' },
        state: { type: 'string' },
        eyewitness: { type: 'boolean' },
        temperature: { type: 'number' }
      });
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<Bigfoot>(schema);
    await repository.createIndex();
  });

  describe("#find", () => {

    beforeEach(async () => {
      await client.execute([
        'HSET', A_REDIS_KEY,
          'title', A_TITLE,
          'county', A_COUNTY,
          'state', A_STATE,
          'eyewitness', '1',
          'temperature', A_TEMPERATURE
        ]);
      await client.execute([
        'HSET', ANOTHER_REDIS_KEY,
          'title', ANOTHER_TITLE,
          'county', ANOTHER_COUNTY,
          'state', ANOTHER_STATE,
          'eyewitness', '0',
          'temperature', ANOTHER_TEMPERATURE
        ]);
      await client.execute([
        'HSET', A_THIRD_REDIS_KEY,
          'title', A_THIRD_TITLE,
          'county', A_THIRD_COUNTY,
          'state', A_THIRD_STATE,
          'eyewitness', '1',
          'temperature', A_THIRD_TEMPERATURE
        ]);
    });

    describe("finding everything", () => {
      beforeEach(async () => {
        entities = await repository.search().run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(3);

        expect(entities[0].redisId).toBe(A_REDIS_ID);
        expect(entities[0].title).toBe(A_TITLE);
        expect(entities[0].county).toBe(A_COUNTY);
        expect(entities[0].state).toBe(A_STATE);
        expect(entities[0].eyewitness).toBe(true);
        expect(entities[0].temperature).toBe(A_TEMPERATURE);

        expect(entities[1].redisId).toBe(ANOTHER_REDIS_ID);
        expect(entities[1].title).toBe(ANOTHER_TITLE);
        expect(entities[1].county).toBe(ANOTHER_COUNTY);
        expect(entities[1].state).toBe(ANOTHER_STATE);
        expect(entities[1].eyewitness).toBe(false);
        expect(entities[1].temperature).toBe(ANOTHER_TEMPERATURE);

        expect(entities[2].redisId).toBe(A_THIRD_REDIS_ID);
        expect(entities[2].title).toBe(A_THIRD_TITLE);
        expect(entities[2].county).toBe(A_THIRD_COUNTY);
        expect(entities[2].state).toBe(A_THIRD_STATE);
        expect(entities[2].eyewitness).toBe(true);
        expect(entities[2].temperature).toBe(A_THIRD_TEMPERATURE);
      });
    });
    
    describe("finding matching a string", () => {
      beforeEach(async () => {
        entities = await repository.search().where('state').is('OH').run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(2);

        expect(entities[0].redisId).toBe(A_REDIS_ID);
        expect(entities[0].title).toBe(A_TITLE);
        expect(entities[0].county).toBe(A_COUNTY);
        expect(entities[0].state).toBe(A_STATE);
        expect(entities[0].eyewitness).toBe(true);
        expect(entities[0].temperature).toBe(A_TEMPERATURE);

        expect(entities[1].redisId).toBe(ANOTHER_REDIS_ID);
        expect(entities[1].title).toBe(ANOTHER_TITLE);
        expect(entities[1].county).toBe(ANOTHER_COUNTY);
        expect(entities[1].state).toBe(ANOTHER_STATE);
        expect(entities[1].eyewitness).toBe(false);
        expect(entities[1].temperature).toBe(ANOTHER_TEMPERATURE);
      });
    });

    describe("finding matching multiple strings", () => {
      beforeEach(async () => {
        entities = await repository
          .search()
            .where('county').is('Ashland')
            .where('state').is('OH')
            .run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(1);

        expect(entities[0].redisId).toBe(ANOTHER_REDIS_ID);
        expect(entities[0].title).toBe(ANOTHER_TITLE);
        expect(entities[0].county).toBe(ANOTHER_COUNTY);
        expect(entities[0].state).toBe(ANOTHER_STATE);
        expect(entities[0].eyewitness).toBe(false);
        expect(entities[0].temperature).toBe(ANOTHER_TEMPERATURE);
      });
    });

    describe("finding matching a boolean true", () => {
      beforeEach(async () => {
        entities = await repository
          .search()
            .where('eyewitness').isTrue()
            .run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(2);

        expect(entities[0].redisId).toBe(A_REDIS_ID);
        expect(entities[0].title).toBe(A_TITLE);
        expect(entities[0].county).toBe(A_COUNTY);
        expect(entities[0].state).toBe(A_STATE);
        expect(entities[0].eyewitness).toBe(true);
        expect(entities[0].temperature).toBe(A_TEMPERATURE);

        expect(entities[1].redisId).toBe(A_THIRD_REDIS_ID);
        expect(entities[1].title).toBe(A_THIRD_TITLE);
        expect(entities[1].county).toBe(A_THIRD_COUNTY);
        expect(entities[1].state).toBe(A_THIRD_STATE);
        expect(entities[1].eyewitness).toBe(true);
        expect(entities[1].temperature).toBe(A_THIRD_TEMPERATURE);
      });
    });

    describe("finding matching a boolean false", () => {
      beforeEach(async () => {
        entities = await repository
          .search()
            .where('eyewitness').isFalse()
            .run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(1);

        expect(entities[0].redisId).toBe(ANOTHER_REDIS_ID);
        expect(entities[0].title).toBe(ANOTHER_TITLE);
        expect(entities[0].county).toBe(ANOTHER_COUNTY);
        expect(entities[0].state).toBe(ANOTHER_STATE);
        expect(entities[0].eyewitness).toBe(false);
        expect(entities[0].temperature).toBe(ANOTHER_TEMPERATURE);
      });
    });

    describe("finding matching a boolean and a string", () => {
      beforeEach(async () => {
        entities = await repository
          .search()
            .where('eyewitness').isTrue()
            .where('county').is('Ashland')
            .run();
        entities.sort((a, b) => a.redisId < b.redisId ? -1 : (a.redisId === b.redisId ? 0: 1));
      })

      it("returns all the entities", () => {
        expect(entities).toHaveLength(1);

        expect(entities[0].redisId).toBe(A_THIRD_REDIS_ID);
        expect(entities[0].title).toBe(A_THIRD_TITLE);
        expect(entities[0].county).toBe(A_THIRD_COUNTY);
        expect(entities[0].state).toBe(A_THIRD_STATE);
        expect(entities[0].eyewitness).toBe(true);
        expect(entities[0].temperature).toBe(A_THIRD_TEMPERATURE);
      });
    });
  });
});
