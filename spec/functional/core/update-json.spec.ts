import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema, loadTestJson } from '../helpers/data-helper';
import { fetchJson, flushAll, keyExists } from '../helpers/redis-helper';

import {
  AN_ENTITY, ANOTHER_ENTITY,
  ANOTHER_POINT_STRING, A_THIRD_POINT_STRING,
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
      entity.someText = ANOTHER_ENTITY.someText;
      entity.someOtherText = ANOTHER_ENTITY.someOtherText;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean;
      entity.aPoint = ANOTHER_ENTITY.aPoint;
      entity.anotherPoint = ANOTHER_ENTITY.anotherPoint;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = ANOTHER_ENTITY.anotherDate;
      entity.someStrings = ANOTHER_ENTITY.someStrings;
      entity.someOtherStrings = ANOTHER_ENTITY.someOtherStrings;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBe(ANOTHER_ENTITY.anotherString);
      expect(data.someText).toBe(ANOTHER_ENTITY.someText);
      expect(data.someOtherText).toBe(ANOTHER_ENTITY.someOtherText);
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBe(ANOTHER_ENTITY.anotherNumber);
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBe(ANOTHER_ENTITY.anotherBoolean);
      expect(data.aPoint).toBe(ANOTHER_POINT_STRING);
      expect(data.anotherPoint).toBe(A_THIRD_POINT_STRING);
      expect(data.aDate).toBe(ANOTHER_DATE_EPOCH);
      expect(data.anotherDate).toBe(A_THIRD_DATE_EPOCH);
      expect(data.someStrings).toEqual(ANOTHER_ENTITY.someStrings);
      expect(data.someOtherStrings).toEqual(ANOTHER_ENTITY.someOtherStrings);
    });
  });

  describe("when updating a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = ANOTHER_ENTITY.aString;
      entity.anotherString = null;
      entity.someText = ANOTHER_ENTITY.someText;
      entity.someOtherText = null;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = null;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = null;
      entity.aPoint = ANOTHER_ENTITY.aPoint;
      entity.anotherPoint = null;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = null;
      entity.someStrings = ANOTHER_ENTITY.someStrings;
      entity.someOtherStrings = null;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBeUndefined()
      expect(data.someText).toBe(ANOTHER_ENTITY.someText);
      expect(data.someOtherText).toBeUndefined();
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBeUndefined();
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBeUndefined();
      expect(data.aPoint).toBe(ANOTHER_POINT_STRING);
      expect(data.anotherPoint).toBeUndefined();
      expect(data.aDate).toBe(ANOTHER_DATE_EPOCH);
      expect(data.anotherDate).toBeUndefined();
      expect(data.someStrings).toEqual(ANOTHER_ENTITY.someStrings);
      expect(data.someOtherStrings).toBeUndefined();
    });
  });

  describe("when updating an empty entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = null;
      entity.anotherString = null;
      entity.someText = null;
      entity.someOtherText = null;
      entity.aNumber = null;
      entity.anotherNumber = null;
      entity.aBoolean = null;
      entity.anotherBoolean = null;
      entity.aPoint = null;
      entity.anotherPoint = null;
      entity.aDate = null;
      entity.anotherDate = null;
      entity.someStrings = null;
      entity.someOtherStrings = null;
      entityId = await repository.save(entity);
      entityKey = `SampleJsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data).toEqual({});
    });
  });
});
