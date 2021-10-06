import { addBigfootSighting, Bigfoot, createBigfootSchema, expectMatchesSighting,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY,
  A_PARTIAL_BIGFOOT_SIGHTING, A_PARTIAL_ENTITY_ID, A_PARTIAL_ENTITY_KEY,
  AN_EMPTY_BIGFOOT_SIGHTING, AN_EMPTY_ENTITY_ID } from '../helpers/bigfoot-data-helper';
  
import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entity: Bigfoot;

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

  describe("#fetch", () => {
    describe("when fetching a fully populated entity from Redis", () => {
      beforeEach(async () => {
        await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
        entity = await repository.fetch(AN_ENTITY_ID);
      });

      it("returns the expected entity", () => {
        expectMatchesSighting(entity, AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
      });
    });

    describe("when fetching a partially populated entity from Redis", () => {
      beforeEach(async () => {
        await addBigfootSighting(client, A_PARTIAL_ENTITY_KEY, A_PARTIAL_BIGFOOT_SIGHTING);
        entity = await repository.fetch(A_PARTIAL_ENTITY_ID);
      });

      it("returns the expected entity", () => {
        expectMatchesSighting(entity, A_PARTIAL_ENTITY_ID, A_PARTIAL_BIGFOOT_SIGHTING);
      });
    });

    describe("when fetching an unpopulated entity from Redis", () => {
      beforeEach(async () => {
        entity = await repository.fetch(AN_EMPTY_ENTITY_ID);
      });

      it("returns the expected entity", () => {
        expect(entity.entityId).toBe(AN_EMPTY_ENTITY_ID);
        expectMatchesSighting(entity, AN_EMPTY_ENTITY_ID, AN_EMPTY_BIGFOOT_SIGHTING);
      });
    });
  });
});