import { AN_EMPTY_ENTITY, AN_ENTITY, A_PARTIAL_ENTITY,
  createHashEntitySchema, HashEntity, loadTestData } from '../helpers/data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

describe("fetch hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestData(client, 'HashEntity:full', AN_ENTITY);
    await loadTestData(client, 'HashEntity:partial', A_PARTIAL_ENTITY);
    await loadTestData(client, 'HashEntity:empty', AN_EMPTY_ENTITY);
    
    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
  });

  afterAll(async () => await client.close());

  it("fetches a fully populated entity from Redis", async () => {
    let entity = await repository.fetch('full');
    expect(entity.entityId).toBe('full');
    expect(entity.aString).toBe(AN_ENTITY.aString);
    expect(entity.anotherString).toBe(AN_ENTITY.anotherString);
    expect(entity.aFullTextString).toBe(AN_ENTITY.aFullTextString);
    expect(entity.anotherFullTextString).toBe(AN_ENTITY.anotherFullTextString);
    expect(entity.aNumber).toBe(AN_ENTITY.aNumber);
    expect(entity.anotherNumber).toBe(AN_ENTITY.anotherNumber);
    expect(entity.aBoolean).toBe(AN_ENTITY.aBoolean);
    expect(entity.anotherBoolean).toBe(AN_ENTITY.anotherBoolean);
    expect(entity.anArray).toEqual(AN_ENTITY.anArray);
    expect(entity.anotherArray).toEqual(AN_ENTITY.anotherArray);
  });

  it("fetches a partially populated entity from Redis", async () => {
    let entity = await repository.fetch('partial');
    expect(entity.entityId).toBe('partial');
    expect(entity.aString).toBe(A_PARTIAL_ENTITY.aString);
    expect(entity.anotherString).toBeNull();
    expect(entity.aFullTextString).toBe(A_PARTIAL_ENTITY.aFullTextString);
    expect(entity.anotherFullTextString).toBeNull();
    expect(entity.aNumber).toBe(A_PARTIAL_ENTITY.aNumber);
    expect(entity.anotherNumber).toBeNull();
    expect(entity.aBoolean).toBe(A_PARTIAL_ENTITY.aBoolean);
    expect(entity.anotherBoolean).toBeNull();
    expect(entity.anArray).toEqual(A_PARTIAL_ENTITY.anArray);
    expect(entity.anotherArray).toBeNull();
  });

  it("fetches an empty entity from Redis", async () => {
    let entity = await repository.fetch('empty');
    expect(entity.entityId).toBe('empty');
    expect(entity.aString).toBeNull();
    expect(entity.anotherString).toBeNull();
    expect(entity.aFullTextString).toBeNull();
    expect(entity.anotherFullTextString).toBeNull();
    expect(entity.aNumber).toBeNull();
    expect(entity.anotherNumber).toBeNull();
    expect(entity.aBoolean).toBeNull();
    expect(entity.anotherBoolean).toBeNull();
    expect(entity.anArray).toBeNull();
    expect(entity.anotherArray).toBeNull();
  });
});