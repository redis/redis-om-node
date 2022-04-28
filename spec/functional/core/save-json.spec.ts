import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema} from '../helpers/data-helper';
import { fetchJson, flushAll, keyExists } from '../helpers/redis-helper';

import {
  AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY,
  A_POINT_STRING, ANOTHER_POINT_STRING,
  A_DATE_EPOCH, ANOTHER_DATE_EPOCH } from '../../helpers/example-data';

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
        someText: AN_ENTITY.someText,
        someOtherText: AN_ENTITY.someOtherText,
        aNumber: AN_ENTITY.aNumber,
        anotherNumber: AN_ENTITY.anotherNumber,
        aBoolean: AN_ENTITY.aBoolean,
        anotherBoolean: AN_ENTITY.anotherBoolean,
        aPoint: AN_ENTITY.aPoint,
        anotherPoint: AN_ENTITY.anotherPoint,
        aDate: AN_ENTITY.aDate,
        anotherDate: AN_ENTITY.anotherDate,
        someStrings: AN_ENTITY.someStrings,
        someOtherStrings: AN_ENTITY.someOtherStrings
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
    });

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(AN_ENTITY.aString);
      expect(data.anotherString).toBe(AN_ENTITY.anotherString);
      expect(data.someText).toBe(AN_ENTITY.someText);
      expect(data.someOtherText).toBe(AN_ENTITY.someOtherText);
      expect(data.aNumber).toBe(AN_ENTITY.aNumber);
      expect(data.anotherNumber).toBe(AN_ENTITY.anotherNumber);
      expect(data.aBoolean).toBe(AN_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBe(AN_ENTITY.anotherBoolean);
      expect(data.aPoint).toBe(A_POINT_STRING);
      expect(data.anotherPoint).toBe(ANOTHER_POINT_STRING);
      expect(data.aDate).toBe(A_DATE_EPOCH);
      expect(data.anotherDate).toBe(ANOTHER_DATE_EPOCH);
      expect(data.someStrings).toEqual(AN_ENTITY.someStrings);
      expect(data.someOtherStrings).toEqual(AN_ENTITY.someOtherStrings);
    });
  });

  describe("when saving a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity({
        aString: A_PARTIAL_ENTITY.aString,
        anotherString: A_PARTIAL_ENTITY.anotherString,
        someText: A_PARTIAL_ENTITY.someText,
        someOtherText: A_PARTIAL_ENTITY.someOtherText,
        aNumber: A_PARTIAL_ENTITY.aNumber,
        anotherNumber: A_PARTIAL_ENTITY.anotherNumber,
        aBoolean: A_PARTIAL_ENTITY.aBoolean,
        anotherBoolean: A_PARTIAL_ENTITY.anotherBoolean,
        aPoint: A_PARTIAL_ENTITY.aPoint,
        anotherPoint: A_PARTIAL_ENTITY.anotherPoint,
        aDate: A_PARTIAL_ENTITY.aDate,
        anotherDate: A_PARTIAL_ENTITY.anotherDate,
        someStrings: A_PARTIAL_ENTITY.someStrings,
        someOtherStrings: A_PARTIAL_ENTITY.someOtherStrings
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
    });

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(A_PARTIAL_ENTITY.aString);
      expect(data.anotherString).toBeUndefined();
      expect(data.someText).toBe(A_PARTIAL_ENTITY.someText);
      expect(data.someOtherText).toBeUndefined();
      expect(data.aNumber).toBe(A_PARTIAL_ENTITY.aNumber);
      expect(data.anotherNumber).toBeUndefined();
      expect(data.aBoolean).toBe(A_PARTIAL_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBeUndefined();
      expect(data.aPoint).toBe(A_POINT_STRING);
      expect(data.anotherPoint).toBeUndefined();
      expect(data.aDate).toBe(A_DATE_EPOCH);
      expect(data.anotherDate).toBeUndefined();
      expect(data.someStrings).toEqual(A_PARTIAL_ENTITY.someStrings);
      expect(data.someOtherStrings).toBeUndefined();
    });
  });

  describe("when saving an empty entity to redis", () => {
    beforeEach(async () => {
      entity = repository.createEntity({
        aString: AN_EMPTY_ENTITY.aString,
        anotherString: AN_EMPTY_ENTITY.anotherString,
        someText: AN_EMPTY_ENTITY.someText,
        someOtherText: AN_EMPTY_ENTITY.someOtherText,
        aNumber: AN_EMPTY_ENTITY.aNumber,
        anotherNumber: AN_EMPTY_ENTITY.anotherNumber,
        aBoolean: AN_EMPTY_ENTITY.aBoolean,
        anotherBoolean: AN_EMPTY_ENTITY.anotherBoolean,
        aPoint: AN_EMPTY_ENTITY.aPoint,
        anotherPoint: AN_EMPTY_ENTITY.anotherPoint,
        aDate: AN_EMPTY_ENTITY.aDate,
        anotherDate: AN_EMPTY_ENTITY.anotherDate,
        someStrings: AN_EMPTY_ENTITY.someStrings,
        someOtherStrings: AN_EMPTY_ENTITY.someOtherStrings
      });
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:${entityId}`;
    });

    it("creates an empty JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data).toEqual({});
    });
  });
});
