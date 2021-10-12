import { fetchHashKeys, fetchHashFields, keyExists } from '../helpers/redis-helper';
import { HashEntity, AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY, createHashEntitySchema} from '../helpers/data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { EntityId, EntityKey } from '../../lib/entity/entity-types';

describe("save hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;
  let entity: HashEntity;
  let entityId: EntityId;
  let entityKey: EntityKey;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
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
      entityKey = `HashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(10);
      expect(fields).toContainEqual('aString');
      expect(fields).toContainEqual('anotherString');
      expect(fields).toContainEqual('aFullTextString');
      expect(fields).toContainEqual('anotherFullTextString');
      expect(fields).toContainEqual('aNumber');
      expect(fields).toContainEqual('anotherNumber');
      expect(fields).toContainEqual('aBoolean');
      expect(fields).toContainEqual('anotherBoolean');
      expect(fields).toContainEqual('anArray');
      expect(fields).toContainEqual('anotherArray');
    });

    it("stores the expected values in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'anArray', 'anotherArray');
      expect(values).toEqual([
        AN_ENTITY.aString,
        AN_ENTITY.anotherString,
        AN_ENTITY.aFullTextString,
        AN_ENTITY.anotherFullTextString,
        AN_ENTITY.aNumber?.toString(),
        AN_ENTITY.anotherNumber?.toString(),
        AN_ENTITY.aBoolean ? '1' : '0',
        AN_ENTITY.anotherBoolean ? '1' : '0',
        AN_ENTITY.anArray?.join('|'),
        AN_ENTITY.anotherArray?.join('|')
      ]);
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
      entityKey = `HashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(5);
      expect(fields).toContainEqual('aString');
      expect(fields).toContainEqual('aFullTextString');
      expect(fields).toContainEqual('aNumber');
      expect(fields).toContainEqual('aBoolean');
      expect(fields).toContainEqual('anArray');
    });

    it("stores the expected values in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'anArray', 'anotherArray');
      expect(values).toEqual([
        A_PARTIAL_ENTITY.aString, null,
        A_PARTIAL_ENTITY.aFullTextString, null,
        A_PARTIAL_ENTITY.aNumber?.toString(), null,
        A_PARTIAL_ENTITY.aBoolean ? '1' : '0', null,
        A_PARTIAL_ENTITY.anArray?.join('|'), null
      ]);
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
      entityKey = `HashEntity:${entityId}`;
    });

    it("creates no fields in the hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(0);
    });

    it("stores no value in the hash", async () => {
      let values = await fetchHashFields(client, entityKey, 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'anArray', 'anotherArray');
      expect(values).toEqual([ null, null, null, null, null, null, null, null, null, null ]);
    });

    it("stores no hash at all", async () => {
      let exists = await keyExists(client, entityKey);
      expect(exists).toBe(false);
    });
  });
});
