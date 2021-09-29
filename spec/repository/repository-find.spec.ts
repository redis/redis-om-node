import Globals from '../helpers/globals';
import { addBigfootSighting, createBigfootSchema, expectMatchesSighting, sortByEntityId, Bigfoot,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY,
  ANOTHER_BIGFOOT_SIGHTING, ANOTHER_ENTITY_ID, ANOTHER_ENTITY_KEY,
  A_THIRD_BIGFOOT_SIGHTING, A_THIRD_ENTITY_ID, A_THIRD_ENTITY_KEY } from '../helpers/bigfoot-data-helper';
  
import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Repository from '../../lib/repository/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entities: Bigfoot[];

  beforeAll(() => {
    client = globals.client;
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
    await repository.createIndex();
  });

  describe("created index", () => {

    let result: any;

    beforeEach(async () => result = await client.redis.sendCommand<any>(['FT.INFO', 'Bigfoot:index']));

    it("has the expected name", () => {
      let indexName = result[1];
      expect(indexName).toBe('Bigfoot:index');
    });

    it("has the expected key type", () => {
      let keyType = result[5][1];
      expect(keyType).toBe('HASH');
    });

    it("has the expected prefixes", () => {
      let prefixes = result[5][3];
      expect(prefixes).toEqual([ 'Bigfoot:' ]);
    });

    it("has the expected fields", () => {
      let fields = result[7];
      expect(fields).toHaveLength(6);
      expect(fields[0]).toEqual([ 'title', 'type', 'TEXT', 'WEIGHT', '1' ]);
      expect(fields[1]).toEqual([ 'county', 'type', 'TAG', 'SEPARATOR', '|' ]);
      expect(fields[2]).toEqual([ 'state', 'type', 'TAG', 'SEPARATOR', '|' ]);
      expect(fields[3]).toEqual([ 'eyewitness', 'type', 'TAG', 'SEPARATOR', ',' ]);
      expect(fields[4]).toEqual([ 'temperature', 'type', 'NUMERIC' ]);
      expect(fields[5]).toEqual([ 'tags', 'type', 'TAG', 'SEPARATOR', '|' ]);
    });
  });

  describe("#find", () => {
    beforeEach(async () => {
      await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, ANOTHER_ENTITY_KEY, ANOTHER_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, A_THIRD_ENTITY_KEY, A_THIRD_BIGFOOT_SIGHTING);
    });

    describe("finding all the things", () => {
      beforeEach(async () => {
        entities = await repository.search().run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities", () => {
        expect(entities).toHaveLength(3);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[2], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });
    
    describe("finding entity matching a boolean, a string, a number, and an array value", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('eyewitness').true()
          .where('county').eq('Ashland')
          .where('temperature').gte(65)
          .where('tags').contains('kentucky')
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities that match", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });
  });
});
