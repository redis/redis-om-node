import { AN_EMPTY_ENTITY, AN_ENTITY, createHashEntitySchema, HashEntity, loadTestHash } from '../helpers/data-helper';
import { keyExists } from '../helpers/redis-helper';

import Client from '../../../src/client';
import Schema from '../../../src/schema/schema';
import Repository from '../../../src/repository/repository';

describe("remove hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestHash(client, 'HashEntity:full', AN_ENTITY);
    await loadTestHash(client, 'HashEntity:empty', AN_EMPTY_ENTITY);
    
    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
  });

  afterAll(async () => await client.close());
      
  it("removes an entity", async () => {
    await repository.remove('full');
    let exists = await keyExists(client, 'HashEntity:full');
    expect(exists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    await repository.remove('empty');
    let exists = await keyExists(client, 'HashEntity:empty');
    expect(exists).toBe(false);
  });
});
