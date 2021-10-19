import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { ANOTHER_ENTITY, AN_ENTITY, AN_ESCAPED_ENTITY, A_THIRD_ENTITY,
  createHashEntitySchema, expectEntityMatches, HashEntity,
  loadTestHash, sortByEntityId } from '../helpers/data-helper';

describe("search for hashes", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;
  let entities: HashEntity[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestHash(client, 'HashEntity:1', AN_ENTITY);
    await loadTestHash(client, 'HashEntity:2', ANOTHER_ENTITY);
    await loadTestHash(client, 'HashEntity:3', A_THIRD_ENTITY);
    await loadTestHash(client, 'HashEntity:4', AN_ESCAPED_ENTITY);
    
    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);

    await repository.createIndex();
  });

  afterAll(async () => await client.close());

  it("performs a wildcard search", async () => {

    entities = await repository.search().return();
    entities.sort(sortByEntityId);

    expect(entities).toHaveLength(4);

    expect(entities[0].entityId).toBe('1');
    expect(entities[1].entityId).toBe('2');
    expect(entities[2].entityId).toBe('3');
    expect(entities[3].entityId).toBe('4');

    expectEntityMatches(entities[0], AN_ENTITY);
    expectEntityMatches(entities[1], ANOTHER_ENTITY);
    expectEntityMatches(entities[2], A_THIRD_ENTITY);
    expectEntityMatches(entities[3], AN_ESCAPED_ENTITY);
  });

  it("searches a string", async () => {
    entities = await repository.search().where('aString').eq('foo').return();
    expect(entities).toHaveLength(1);
    expect(entities[0].entityId).toBe('1');
    expectEntityMatches(entities[0], AN_ENTITY);
  });

  it("searches a string with full text", async () => {
    entities = await repository.search().where('aFullTextString').matches('quick').return();
    entities.sort(sortByEntityId);
    expect(entities).toHaveLength(2);
    expect(entities[0].entityId).toBe('1');
    expect(entities[1].entityId).toBe('2');
    expectEntityMatches(entities[0], AN_ENTITY);
    expectEntityMatches(entities[1], ANOTHER_ENTITY);
  });

  it("searches a number", async () => {
    entities = await repository.search().where('aNumber').lte(23).return();
    entities.sort(sortByEntityId);
    expect(entities).toHaveLength(2);
    expect(entities[0].entityId).toBe('2');
    expect(entities[1].entityId).toBe('3');
    expectEntityMatches(entities[0], ANOTHER_ENTITY);
    expectEntityMatches(entities[1], A_THIRD_ENTITY);
  });

  it("searches a boolean", async () => {
    entities = await repository.search().where('aBoolean').true().return();
    entities.sort(sortByEntityId);
    expect(entities).toHaveLength(2);
    expect(entities[0].entityId).toBe('1');
    expect(entities[1].entityId).toBe('2');
    expectEntityMatches(entities[0], AN_ENTITY);
    expectEntityMatches(entities[1], ANOTHER_ENTITY);
  });

  it("searches an array", async () => {
    entities = await repository.search().where('anArray').contains('charlie').return();
    entities.sort(sortByEntityId);
    expect(entities).toHaveLength(3);
    expect(entities[0].entityId).toBe('1');
    expect(entities[1].entityId).toBe('2');
    expect(entities[2].entityId).toBe('3');
    expectEntityMatches(entities[0], AN_ENTITY);
    expectEntityMatches(entities[1], ANOTHER_ENTITY);
    expectEntityMatches(entities[2], A_THIRD_ENTITY);
  });

  it("searches all the field types", async () => {
    entities = await repository.search()
      .where('aString').eq('foo')
      .and('aFullTextString').matches('dog')
      .and('aNumber').gte(42)
      .and('aBoolean').true()
      .and('anArray').contains('alfa')
      .return();

    expect(entities).toHaveLength(1);
    expect(entities[0].entityId).toBe('1');
    expectEntityMatches(entities[0], AN_ENTITY);
  });

  it("searches a string with escaped punctuation", async () => {
    entities = await repository.search().where('aString').equals('foo ,.<>{}[]"\':;!@#$%^*()-+=~& bar').return();
    expect(entities).toHaveLength(1);
    expect(entities[0].entityId).toBe('4');
    expectEntityMatches(entities[0], AN_ESCAPED_ENTITY);
  });

  it("searches a string with full text with escaped punctuation", async () => {
    entities = await repository.search().where('aFullTextString').matches('zany').return();
    expect(entities).toHaveLength(1);
    expect(entities[0].entityId).toBe('4');
    expectEntityMatches(entities[0], AN_ESCAPED_ENTITY);
  });

  it("searches an array with escaped punctuation", async () => {
    entities = await repository.search().where('anArray').contains('alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo').return();
    expect(entities).toHaveLength(1);
    expect(entities[0].entityId).toBe('4');
    expectEntityMatches(entities[0], AN_ESCAPED_ENTITY);
  });
});
