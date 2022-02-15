import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema, loadTestJson } from '../helpers/data-helper';
import { fetchJson, flushAll, keyExists } from '../helpers/redis-helper';

import {
  AN_ENTITY, ANOTHER_ENTITY,
  ANOTHER_GEOPOINT_STRING, A_THIRD_GEOPOINT_STRING,
  ANOTHER_DATE_EPOCH, A_THIRD_DATE_EPOCH } from '../../helpers/example-data';

describe("update JSON", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;
  let entity: SampleJsonEntity;
  let entityId: string;
  let entityKey: string;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<SampleJsonEntity>(schema);
  });
  
  beforeEach(async () => {
    await flushAll(client);
    await loadTestJson(client, 'JsonEntity:full', AN_ENTITY);
  });

  afterAll(async () => await client.close());

  describe("when updating a fully populated entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = ANOTHER_ENTITY.aString;
      entity.anotherString = ANOTHER_ENTITY.anotherString;
      entity.aFullTextString = ANOTHER_ENTITY.aFullTextString;
      entity.anotherFullTextString = ANOTHER_ENTITY.anotherFullTextString;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean;
      entity.aGeoPoint = ANOTHER_ENTITY.aGeoPoint;
      entity.anotherGeoPoint = ANOTHER_ENTITY.anotherGeoPoint;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = ANOTHER_ENTITY.anotherDate;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = ANOTHER_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBe(ANOTHER_ENTITY.anotherString);
      expect(data.aFullTextString).toBe(ANOTHER_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBe(ANOTHER_ENTITY.anotherFullTextString);
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBe(ANOTHER_ENTITY.anotherNumber);
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBe(ANOTHER_ENTITY.anotherBoolean);
      expect(data.aGeoPoint).toBe(ANOTHER_GEOPOINT_STRING);
      expect(data.anotherGeoPoint).toBe(A_THIRD_GEOPOINT_STRING);
      expect(data.aDate).toBe(ANOTHER_DATE_EPOCH);
      expect(data.anotherDate).toBe(A_THIRD_DATE_EPOCH);
      expect(data.anArray).toEqual(ANOTHER_ENTITY.anArray);
      expect(data.anotherArray).toEqual(ANOTHER_ENTITY.anotherArray);
    });
  });

  describe("when updating a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = ANOTHER_ENTITY.aString;
      entity.anotherString = null;
      entity.aFullTextString = ANOTHER_ENTITY.aFullTextString;
      entity.anotherFullTextString = null;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = null;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = null;
      entity.aGeoPoint = ANOTHER_ENTITY.aGeoPoint;
      entity.anotherGeoPoint = null;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = null;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBeUndefined()
      expect(data.aFullTextString).toBe(ANOTHER_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBeUndefined();
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBeUndefined();
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBeUndefined();
      expect(data.aGeoPoint).toBe(ANOTHER_GEOPOINT_STRING);
      expect(data.anotherGeoPoint).toBeUndefined();
      expect(data.aDate).toBe(ANOTHER_DATE_EPOCH);
      expect(data.anotherDate).toBeUndefined();
      expect(data.anArray).toEqual(ANOTHER_ENTITY.anArray);
      expect(data.anotherArray).toBeUndefined();
    });
  });

  describe("when updating an empty entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = null;
      entity.anotherString = null;
      entity.aFullTextString = null;
      entity.anotherFullTextString = null;
      entity.aNumber = null;
      entity.anotherNumber = null;
      entity.aBoolean = null;
      entity.anotherBoolean = null;
      entity.aGeoPoint = null;
      entity.anotherGeoPoint = null;
      entity.aDate = null;
      entity.anotherDate = null;
      entity.anArray = null;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("removes the key from Redis", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
