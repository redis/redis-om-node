import { AN_EMPTY_ENTITY, AN_ENTITY, A_PARTIAL_ENTITY,
  createHashEntitySchema, expectEntityMatches, HashEntity, loadTestData } from '../helpers/data-helper';

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
    expectEntityMatches(entity, AN_ENTITY);
  });

  it("fetches a partially populated entity from Redis", async () => {
    let entity = await repository.fetch('partial');
    expect(entity.entityId).toBe('partial');
    expectEntityMatches(entity, A_PARTIAL_ENTITY);
  });

  it("fetches an empty entity from Redis", async () => {
    let entity = await repository.fetch('empty');
    expect(entity.entityId).toBe('empty');
    expectEntityMatches(entity, AN_EMPTY_ENTITY);
  });
});