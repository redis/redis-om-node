import Globals from '../helpers/globals';
import { addBigfootSighting, createBigfootSchema, expectMatchesSighting, sortByEntityId, Bigfoot,
  A_BIGFOOT_SIGHTING, AN_ENTITY_ID, AN_ENTITY_KEY,
  ANOTHER_BIGFOOT_SIGHTING, ANOTHER_ENTITY_ID, ANOTHER_ENTITY_KEY,
  A_THIRD_BIGFOOT_SIGHTING, A_THIRD_ENTITY_ID, A_THIRD_ENTITY_KEY,
  AN_ESCAPED_BIGFOOT_SIGHTING, AN_ESCAPED_ENTITY_ID, AN_ESCAPED_ENTITY_KEY } from '../helpers/bigfoot-data-helper';
  
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

  describe("#search", () => {
    beforeEach(async () => {
      await addBigfootSighting(client, AN_ENTITY_KEY, A_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, ANOTHER_ENTITY_KEY, ANOTHER_BIGFOOT_SIGHTING);
      await addBigfootSighting(client, A_THIRD_ENTITY_KEY, A_THIRD_BIGFOOT_SIGHTING);
    });

    describe("finding entities with a particular tag", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('tags').contains('ohio')
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities thus tagged", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], ANOTHER_ENTITY_ID, ANOTHER_BIGFOOT_SIGHTING);
      });
    });

    describe("finding entities with one of the specified tags", () => {
      beforeEach(async () => {
        entities = await repository.search()
          .where('tags').containsOneOf('kentucky', 'walmart')
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns all the entities thus tagged", () => {
        expect(entities).toHaveLength(2);
        expectMatchesSighting(entities[0], AN_ENTITY_ID, A_BIGFOOT_SIGHTING);
        expectMatchesSighting(entities[1], A_THIRD_ENTITY_ID, A_THIRD_BIGFOOT_SIGHTING);
      });
    });

    describe("finding all the entities that match an array with escaped punctuation", () => {
      beforeEach(async () => {
        await addBigfootSighting(client, AN_ESCAPED_ENTITY_KEY, AN_ESCAPED_BIGFOOT_SIGHTING);
        entities = await repository.search()
          .where('tags').containsOneOf('riv ,.<>{}[]"\':;!@#$%^&*()-+=~ er', 'missing')     // has TAG separator of |
          .where('moreTags').containsOneOf('riv ,.<>{}[]"\':;!@#$%^*()-+=~| er', 'missing') // has TAG separator of &
          .run();
        entities.sort(sortByEntityId);
      });

      it("returns the entity that matches the string", () => {
        expect(entities).toHaveLength(1);
        expectMatchesSighting(entities[0], AN_ESCAPED_ENTITY_ID, AN_ESCAPED_BIGFOOT_SIGHTING);
      });
    });
  });
});
