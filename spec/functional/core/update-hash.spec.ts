import { fetchHashKeys, fetchHashFields, keyExists } from '../helpers/redis-helper';
import { HashEntity, AN_ENTITY, createHashEntitySchema, loadTestHash, ANOTHER_ENTITY } from '../helpers/data-helper';

import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

describe("update hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;
  let entity: HashEntity;
  let entityId: string;
  let entityKey: string;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
  });
  
  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    await loadTestHash(client, 'HashEntity:full', AN_ENTITY);
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
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = ANOTHER_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `HashEntity:full`;
    });

    it("returns the expected entity id", () =>{
      expect(entityId).toBe('full');
    });

    it("preserves the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(12);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aGeoPoint', 'anotherGeoPoint', 'anArray', 'anotherArray' ]));
    });

    it("updates the expected fields in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aGeoPoint', 'anotherGeoPoint', 'anArray', 'anotherArray');
      expect(values).toEqual([
        ANOTHER_ENTITY.aString,
        ANOTHER_ENTITY.anotherString,
        ANOTHER_ENTITY.aFullTextString,
        ANOTHER_ENTITY.anotherFullTextString,
        ANOTHER_ENTITY.aNumber?.toString(),
        ANOTHER_ENTITY.anotherNumber?.toString(),
        ANOTHER_ENTITY.aBoolean ? '1' : '0',
        ANOTHER_ENTITY.anotherBoolean ? '1' : '0',
        `${ANOTHER_ENTITY.aGeoPoint?.longitude},${ANOTHER_ENTITY.aGeoPoint?.latitude}`,
        `${ANOTHER_ENTITY.anotherGeoPoint?.longitude},${ANOTHER_ENTITY.anotherGeoPoint?.latitude}`,
        ANOTHER_ENTITY.anArray?.join('|'),
        ANOTHER_ENTITY.anotherArray?.join('|')
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
      entity.aGeoPoint = ANOTHER_ENTITY.aGeoPoint;
      entity.anotherGeoPoint = null;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `HashEntity:full`;
    });

    it("returns the expected entity id", () =>{
      expect(entityId).toBe('full');
    });

    it("removes the nulled fields from the hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(6);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'aFullTextString', 'aNumber', 'aBoolean', 'aGeoPoint', 'anArray' ]));
    });

    it("updates the expected fields in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'aGeoPoint', 'anotherGeoPoint', 'anArray', 'anotherArray');
      expect(values).toEqual([
        ANOTHER_ENTITY.aString, null,
        ANOTHER_ENTITY.aFullTextString, null,
        ANOTHER_ENTITY.aNumber?.toString(), null,
        ANOTHER_ENTITY.aBoolean ? '1' : '0', null,
        `${ANOTHER_ENTITY.aGeoPoint?.longitude},${ANOTHER_ENTITY.aGeoPoint?.latitude}`, null,
        ANOTHER_ENTITY.anArray?.join('|'), null
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
      entity.aGeoPoint = null;
      entity.anotherGeoPoint = null;
      entity.anArray = null;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `HashEntity:full`;
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
        'aBoolean', 'anotherBoolean', 'aGeoPoint', 'anotherGeoPoint', 'anArray', 'anotherArray');
      expect(values).toEqual([ null, null, null, null, null, null, null, null, null, null, null, null ]);
    });

    it("removes the entire hash", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
