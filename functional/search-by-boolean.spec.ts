import { addBigfootSighting, createBigfootSchema, expectMatchesSighting, sortByEntityId, Bigfoot,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY,
  ANOTHER_BIGFOOT_SIGHTING, ANOTHER_ENTITY_ID, ANOTHER_ENTITY_KEY,
  A_THIRD_BIGFOOT_SIGHTING, A_THIRD_ENTITY_ID, A_THIRD_ENTITY_KEY } from './helpers/data-helper';
  
import Client from '../lib/client';
import Schema from '../lib/schema/schema';
import Repository from '../lib/repository/repository';

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entities: Bigfoot[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<Bigfoot>(schema);
    await repository.createIndex();
  });

  afterAll(async () => await client.close());

  describe("#search", () => {
    beforeEach(async () => {
      await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, ANOTHER_ENTITY_KEY, ANOTHER_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, A_THIRD_ENTITY_KEY, A_THIRD_BIGFOOT_SIGHTING);
    });

    describe("finding a boolean true", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('eyewitness').true()
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities matching a boolean true", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });

    describe("finding a boolean false", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('eyewitness').false()
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities matching a boolean false", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
      });
    });
  });
});
