import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleHashEntity, createHashEntitySchema, loadTestHash } from '../helpers/data-helper';
import { fetchHashKeys, fetchHashFields, flushAll, keyExists } from '../helpers/redis-helper';

import {
  AN_ENTITY, ANOTHER_ENTITY,
  ANOTHER_POINT_STRING, A_THIRD_POINT_STRING,
  ANOTHER_ARRAY_JOINED, A_THIRD_ARRAY_JOINED,
  ANOTHER_DATE_EPOCH_STRING, A_THIRD_DATE_EPOCH_STRING } from '../../helpers/example-data';

describe("update hash", () => {

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
  
  beforeEach(async () => {
    await flushAll(client);
    await loadTestHash(client, 'SampleHashEntity:full', AN_ENTITY);
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
      entity.aPoint = ANOTHER_ENTITY.aPoint;
      entity.anotherPoint = ANOTHER_ENTITY.anotherPoint;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = ANOTHER_ENTITY.anotherDate;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = ANOTHER_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `SampleHashEntity:full`;
    });

    it("returns the expected entity id", () =>{
      expect(entityId).toBe('full');
    });

    it("preserves the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(14);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'anArray', 'anotherArray' ]));
    });

    it("updates the expected fields in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'anArray', 'anotherArray');
      expect(values).toEqual([
        ANOTHER_ENTITY.aString,
        ANOTHER_ENTITY.anotherString,
        ANOTHER_ENTITY.aFullTextString,
        ANOTHER_ENTITY.anotherFullTextString,
        ANOTHER_ENTITY.aNumber?.toString(),
        ANOTHER_ENTITY.anotherNumber?.toString(),
        ANOTHER_ENTITY.aBoolean ? '1' : '0',
        ANOTHER_ENTITY.anotherBoolean ? '1' : '0',
        ANOTHER_POINT_STRING,
        A_THIRD_POINT_STRING,
        ANOTHER_DATE_EPOCH_STRING,
        A_THIRD_DATE_EPOCH_STRING,
        ANOTHER_ARRAY_JOINED,
        A_THIRD_ARRAY_JOINED
      ]);
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
      entity.aPoint = ANOTHER_ENTITY.aPoint;
      entity.anotherPoint = null;
      entity.aDate = ANOTHER_ENTITY.aDate;
      entity.anotherDate = null;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `SampleHashEntity:full`;
    });

    it("returns the expected entity id", () =>{
      expect(entityId).toBe('full');
    });

    it("removes the nulled fields from the hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(7);
      expect(fields).toEqual(expect.arrayContaining([
        'aString', 'aFullTextString', 'aNumber', 'aBoolean', 'aPoint', 'aDate', 'anArray' ]));
    });

    it("updates the expected fields in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'anArray', 'anotherArray');
      expect(values).toEqual([
        ANOTHER_ENTITY.aString, null,
        ANOTHER_ENTITY.aFullTextString, null,
        ANOTHER_ENTITY.aNumber?.toString(), null,
        ANOTHER_ENTITY.aBoolean ? '1' : '0', null,
        ANOTHER_POINT_STRING, null,
        ANOTHER_DATE_EPOCH_STRING, null,
        ANOTHER_ARRAY_JOINED, null
      ]);
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
      entity.aPoint = null;
      entity.anotherPoint = null;
      entity.aDate = null;
      entity.anotherDate = null;
      entity.anArray = null;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `SampleHashEntity:full`;
    });

    it("returns the expected entity id", () =>{
      expect(entityId).toBe('full');
    });

    it("removes all the fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(0);
    });

    it("removes all the values from the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aPoint', 'anotherPoint',
        'aDate', 'anotherDate', 'anArray', 'anotherArray');
      expect(values).toEqual([ null, null, null, null, null, null, null, null, null, null, null, null, null, null ]);
    });

    it("removes the entire hash", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
