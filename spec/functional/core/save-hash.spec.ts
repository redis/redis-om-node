import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleHashEntity, createHashEntitySchema} from '../helpers/data-helper';
import { fetchHashKeys, fetchHashFields, keyExists, flushAll } from '../helpers/redis-helper';

import {
  AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY,
  A_POINT_STRING, ANOTHER_POINT_STRING,
  A_DATE_EPOCH_STRING, ANOTHER_DATE_EPOCH_STRING,
  SOME_STRINGS_JOINED, SOME_OTHER_STRINGS_JOINED } from '../../helpers/example-data';

describe("save hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;
  let entity: SampleHashEntity;
  let entityId: string;
  let entityKey: string;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<SampleHashEntity>(schema);
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
      entityKey = `SampleHashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(14);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'anotherString',
        'someText', 'someOtherText', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'someStrings', 'someOtherStrings' ]));
    });

    it("stores the expected values in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'someText', 'someOtherText', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'someStrings', 'someOtherStrings');
      expect(values).toEqual([
        AN_ENTITY.aString,
        AN_ENTITY.anotherString,
        AN_ENTITY.someText,
        AN_ENTITY.someOtherText,
        AN_ENTITY.aNumber?.toString(),
        AN_ENTITY.anotherNumber?.toString(),
        AN_ENTITY.aBoolean ? '1' : '0',
        AN_ENTITY.anotherBoolean ? '1' : '0',
        A_POINT_STRING,
        ANOTHER_POINT_STRING,
        A_DATE_EPOCH_STRING,
        ANOTHER_DATE_EPOCH_STRING,
        SOME_STRINGS_JOINED,
        SOME_OTHER_STRINGS_JOINED]);
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
      entityKey = `SampleHashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(7);
      expect(fields).toEqual(expect.arrayContaining([
        'aString', 'someText', 'aNumber', 'aBoolean', 'aPoint', 'aDate', 'someStrings' ]));
    });

    it("stores the expected values in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'someText', 'someOtherText', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'someStrings', 'someOtherStrings');
      expect(values).toEqual([
        A_PARTIAL_ENTITY.aString, null,
        A_PARTIAL_ENTITY.someText, null,
        A_PARTIAL_ENTITY.aNumber?.toString(), null,
        A_PARTIAL_ENTITY.aBoolean ? '1' : '0', null,
        A_POINT_STRING, null,
        A_DATE_EPOCH_STRING, null,
        SOME_STRINGS_JOINED, null
      ]);
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
      entityKey = `SampleHashEntity:${entityId}`;
    });

    it("creates no fields in the hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(0);
    });

    it("stores no value in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'someText', 'someOtherText', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'anDate', 'anotherDate', 'someStrings', 'someOtherStrings');
      expect(values).toEqual([ null, null, null, null, null, null, null, null, null, null, null, null, null, null ]);
    });

    it("stores no hash at all", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
