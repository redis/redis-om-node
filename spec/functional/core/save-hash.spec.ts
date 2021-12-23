import { fetchHashKeys, fetchHashFields, keyExists } from '../helpers/redis-helper';
import { HashEntity, AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY, createHashEntitySchema} from '../helpers/data-helper';

import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

describe("save hash", () => {

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
  });

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
        anArray: AN_ENTITY.anArray,
        anotherArray: AN_ENTITY.anotherArray
      });
      entityId = await repository.save(entity);
      entityKey = `HashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(10);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'anotherString',
        'aFullTextString', 'anotherFullTextString', 'aNumber', 'anotherNumber',
        'aBoolean', 'anotherBoolean', 'anArray', 'anotherArray' ]));
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
          AN_ENTITY.anotherArray?.join('|') ]);
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
        anArray: A_PARTIAL_ENTITY.anArray,
        anotherArray: A_PARTIAL_ENTITY.anotherArray
      });
      entityId = await repository.save(entity);
      entityKey = `HashEntity:${entityId}`;
    });

    it("creates the expected fields in a hash", async () => {
      let fields = await fetchHashKeys(client, entityKey);
      expect(fields).toHaveLength(5);
      expect(fields).toEqual(expect.arrayContaining([ 'aString', 'aFullTextString', 'aNumber', 'aBoolean', 'anArray' ]));
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
      entity = repository.createEntity({
        aString: AN_EMPTY_ENTITY.aString,
        anotherString: AN_EMPTY_ENTITY.anotherString,
        aFullTextString: AN_EMPTY_ENTITY.aFullTextString,
        anotherFullTextString: AN_EMPTY_ENTITY.anotherFullTextString,
        aNumber: AN_EMPTY_ENTITY.aNumber,
        anotherNumber: AN_EMPTY_ENTITY.anotherNumber,
        aBoolean: AN_EMPTY_ENTITY.aBoolean,
        anotherBoolean: AN_EMPTY_ENTITY.anotherBoolean,
        anArray: AN_EMPTY_ENTITY.anArray,
        anotherArray: AN_EMPTY_ENTITY.anotherArray
      });
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
