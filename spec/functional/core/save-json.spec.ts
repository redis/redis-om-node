import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema} from '../helpers/data-helper';
import { fetchJson, flushAll, keyExists } from '../helpers/redis-helper';

import {
  AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY,
  A_GEOPOINT_STRING, ANOTHER_GEOPOINT_STRING } from '../../helpers/example-data';

describe("save JSON", () => {

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
  
  beforeEach(async () => await flushAll(client));
  afterAll(async () => await client.close());

  describe("when saving a fully populated entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity({
        aString: AN_ENTITY.aString,
        anotherString: AN_ENTITY.anotherString,
        aFullTextString: AN_ENTITY.aFullTextString,
        anotherFullTextString: AN_ENTITY.anotherFullTextString,
        aNumber: AN_ENTITY.aNumber,
        anotherNumber: AN_ENTITY.anotherNumber,
        aBoolean: AN_ENTITY.aBoolean,
        anotherBoolean: AN_ENTITY.anotherBoolean,
        aGeoPoint: AN_ENTITY.aGeoPoint,
        anotherGeoPoint: AN_ENTITY.anotherGeoPoint,
        anArray: AN_ENTITY.anArray,
        anotherArray: AN_ENTITY.anotherArray
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
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
      expect(data.aGeoPoint).toBe(A_GEOPOINT_STRING);
      expect(data.anotherGeoPoint).toBe(ANOTHER_GEOPOINT_STRING);
      expect(data.anArray).toEqual(AN_ENTITY.anArray);
      expect(data.anotherArray).toEqual(AN_ENTITY.anotherArray);
    });
  });

  describe("when saving a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity({
        aString: A_PARTIAL_ENTITY.aString,
        anotherString: A_PARTIAL_ENTITY.anotherString,
        aFullTextString: A_PARTIAL_ENTITY.aFullTextString,
        anotherFullTextString: A_PARTIAL_ENTITY.anotherFullTextString,
        aNumber: A_PARTIAL_ENTITY.aNumber,
        anotherNumber: A_PARTIAL_ENTITY.anotherNumber,
        aBoolean: A_PARTIAL_ENTITY.aBoolean,
        anotherBoolean: A_PARTIAL_ENTITY.anotherBoolean,
        aGeoPoint: A_PARTIAL_ENTITY.aGeoPoint,
        anotherGeoPoint: A_PARTIAL_ENTITY.anotherGeoPoint,
        anArray: A_PARTIAL_ENTITY.anArray,
        anotherArray: A_PARTIAL_ENTITY.anotherArray
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
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
      expect(data.aGeoPoint).toBe(A_GEOPOINT_STRING);
      expect(data.anotherGeoPoint).toBeUndefined();
      expect(data.anArray).toEqual(A_PARTIAL_ENTITY.anArray);
      expect(data.anotherArray).toBeUndefined();
    });
  });

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity({
        aString: AN_EMPTY_ENTITY.aString,
        anotherString: AN_EMPTY_ENTITY.anotherString,
        aFullTextString: AN_EMPTY_ENTITY.aFullTextString,
        anotherFullTextString: AN_EMPTY_ENTITY.anotherFullTextString,
        aNumber: AN_EMPTY_ENTITY.aNumber,
        anotherNumber: AN_EMPTY_ENTITY.anotherNumber,
        aBoolean: AN_EMPTY_ENTITY.aBoolean,
        anotherBoolean: AN_EMPTY_ENTITY.anotherBoolean,
        aGeoPoint: AN_EMPTY_ENTITY.aGeoPoint,
        anotherGeoPoint: AN_EMPTY_ENTITY.anotherGeoPoint,
        anArray: AN_EMPTY_ENTITY.anArray,
        anotherArray: AN_EMPTY_ENTITY.anotherArray
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
    });

    it("does not save JSON", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
