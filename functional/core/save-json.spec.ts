import { fetchJson } from '../helpers/redis-helper';
import { JsonEntity, AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY, createJsonEntitySchema} from '../helpers/data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { EntityId, EntityKey } from '../../lib/entity/entity-types';

describe("save JSON", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;
  let entity: JsonEntity;
  let entityId: EntityId;
  let entityKey: EntityKey;

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
      expect(data.aString).toBe(AN_ENTITY.aString);
      expect(data.anotherString).toBe(AN_ENTITY.anotherString);
      expect(data.aFullTextString).toBe(AN_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBe(AN_ENTITY.anotherFullTextString);
      expect(data.aNumber).toBe(AN_ENTITY.aNumber);
      expect(data.anotherNumber).toBe(AN_ENTITY.anotherNumber);
      expect(data.aBoolean).toBe(AN_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBe(AN_ENTITY.anotherBoolean);
      expect(data.anArray).toBe(AN_ENTITY.anArray?.join('|'));
      expect(data.anotherArray).toBe(AN_ENTITY.anotherArray?.join('|'));
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
      expect(data.aString).toBe(A_PARTIAL_ENTITY.aString ?? null);
      expect(data.anotherString).toBe(A_PARTIAL_ENTITY.anotherString ?? null);
      expect(data.aFullTextString).toBe(A_PARTIAL_ENTITY.aFullTextString ?? null);
      expect(data.anotherFullTextString).toBe(A_PARTIAL_ENTITY.anotherFullTextString ?? null);
      expect(data.aNumber).toBe(A_PARTIAL_ENTITY.aNumber ?? null);
      expect(data.anotherNumber).toBe(A_PARTIAL_ENTITY.anotherNumber ?? null);
      expect(data.aBoolean).toBe(A_PARTIAL_ENTITY.aBoolean ?? null);
      expect(data.anotherBoolean).toBe(A_PARTIAL_ENTITY.anotherBoolean ?? null);
      expect(data.anArray).toBe(A_PARTIAL_ENTITY.anArray?.join('|') ?? null);
      expect(data.anotherArray).toBe(A_PARTIAL_ENTITY.anotherArray?.join('|') ?? null);
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

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(AN_EMPTY_ENTITY.aString ?? null);
      expect(data.anotherString).toBe(AN_EMPTY_ENTITY.anotherString ?? null);
      expect(data.aFullTextString).toBe(AN_EMPTY_ENTITY.aFullTextString ?? null);
      expect(data.anotherFullTextString).toBe(AN_EMPTY_ENTITY.anotherFullTextString ?? null);
      expect(data.aNumber).toBe(AN_EMPTY_ENTITY.aNumber ?? null);
      expect(data.anotherNumber).toBe(AN_EMPTY_ENTITY.anotherNumber ?? null);
      expect(data.aBoolean).toBe(AN_EMPTY_ENTITY.aBoolean ?? null);
      expect(data.anotherBoolean).toBe(AN_EMPTY_ENTITY.anotherBoolean ?? null);
      expect(data.anArray).toBe(AN_EMPTY_ENTITY.anArray?.join('|') ?? null);
      expect(data.anotherArray).toBe(AN_EMPTY_ENTITY.anotherArray?.join('|') ?? null);
    });
  });
});
