import { AN_EMPTY_ENTITY, AN_ENTITY, createJsonEntitySchema, JsonEntity, loadTestJson } from '../helpers/data-helper';
import { keyExists } from '../helpers/redis-helper';

import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

describe("remove hash", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestJson(client, 'JsonEntity:full', AN_ENTITY);
    await loadTestJson(client, 'JsonEntity:empty', AN_EMPTY_ENTITY);
    
    schema = createJsonEntitySchema();
    repository = client.fetchRepository<JsonEntity>(schema);
  });

  afterAll(async () => await client.close());
      
  it("removes an entity", async () => {
    await repository.remove('full');
    let exists = await keyExists(client, 'JsonEntity:full');
    expect(exists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    await repository.remove('empty');
    let exists = await keyExists(client, 'JsonEntity:empty');
    expect(exists).toBe(false);
  });
});
