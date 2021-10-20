import { fetchJson, keyExists } from '../helpers/redis-helper';
import { JsonEntity, AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY, createJsonEntitySchema} from '../helpers/data-helper';

import Client from '../../../src/client';
import Schema from '../../../src/schema/schema';
import Repository from '../../../src/repository/repository';

describe("save JSON", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;
  let entity: JsonEntity;
  let entityId: string;
  let entityKey: string;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<JsonEntity>(schema);
  });
  
  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
  });

  afterAll(async () => await client.close());

  describe("when saving a fully populated entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity();
      entity.aString = AN_ENTITY.aString;
      entity.anotherString = AN_ENTITY.anotherString;
      entity.aFullTextString = AN_ENTITY.aFullTextString;
      entity.anotherFullTextString = AN_ENTITY.anotherFullTextString;
      entity.aNumber = AN_ENTITY.aNumber;
      entity.anotherNumber = AN_ENTITY.anotherNumber;
      entity.aBoolean = AN_ENTITY.aBoolean;
      entity.anotherBoolean = AN_ENTITY.anotherBoolean;
      entity.anArray = AN_ENTITY.anArray;
      entity.anotherArray = AN_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:${entityId}`;
    });

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data).toEqual(expect.objectContaining(AN_ENTITY));
    });
  });

  describe("when saving a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity();
      entity.aString = A_PARTIAL_ENTITY.aString;
      entity.anotherString = A_PARTIAL_ENTITY.anotherString;
      entity.aFullTextString = A_PARTIAL_ENTITY.aFullTextString;
      entity.anotherFullTextString = A_PARTIAL_ENTITY.anotherFullTextString;
      entity.aNumber = A_PARTIAL_ENTITY.aNumber;
      entity.anotherNumber = A_PARTIAL_ENTITY.anotherNumber;
      entity.aBoolean = A_PARTIAL_ENTITY.aBoolean;
      entity.anotherBoolean = A_PARTIAL_ENTITY.anotherBoolean;
      entity.anArray = A_PARTIAL_ENTITY.anArray;
      entity.anotherArray = A_PARTIAL_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:${entityId}`;
    });

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(A_PARTIAL_ENTITY.aString);
      expect(data.anotherString).toBeUndefined();
      expect(data.aFullTextString).toBe(A_PARTIAL_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBeUndefined();
      expect(data.aNumber).toBe(A_PARTIAL_ENTITY.aNumber);
      expect(data.anotherNumber).toBeUndefined();
      expect(data.aBoolean).toBe(A_PARTIAL_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBeUndefined();
      expect(data.anArray).toEqual(A_PARTIAL_ENTITY.anArray);
      expect(data.anotherArray).toBeUndefined();
    });
  });

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity();
      entity.aString = AN_EMPTY_ENTITY.aString;
      entity.anotherString = AN_EMPTY_ENTITY.anotherString;
      entity.aFullTextString = AN_EMPTY_ENTITY.aFullTextString;
      entity.anotherFullTextString = AN_EMPTY_ENTITY.anotherFullTextString;
      entity.aNumber = AN_EMPTY_ENTITY.aNumber;
      entity.anotherNumber = AN_EMPTY_ENTITY.anotherNumber;
      entity.aBoolean = AN_EMPTY_ENTITY.aBoolean;
      entity.anotherBoolean = AN_EMPTY_ENTITY.anotherBoolean;
      entity.anArray = AN_EMPTY_ENTITY.anArray;
      entity.anotherArray = AN_EMPTY_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:${entityId}`;
    });

    it("does not save JSON", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBeFalse();
    });
  });
});
