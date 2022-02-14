import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema, loadTestJson } from '../helpers/data-helper';
import { flushAll, keyExists } from '../helpers/redis-helper';

import { AN_EMPTY_ENTITY, AN_ENTITY } from '../../helpers/example-data';

describe("remove hash", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await flushAll(client);
    await loadTestJson(client, 'SampleJsonEntity:full', AN_ENTITY);
    await loadTestJson(client, 'SampleJsonEntity:empty', AN_EMPTY_ENTITY);
    
    schema = createJsonEntitySchema();
    repository = client.fetchRepository<SampleJsonEntity>(schema);
  });

  afterAll(async () => await client.close());
      
  it("removes an entity", async () => {
    await repository.remove('full');
    let exists = await keyExists(client, 'SampleJsonEntity:full');
    expect(exists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    await repository.remove('empty');
    let exists = await keyExists(client, 'SampleJsonEntity:empty');
    expect(exists).toBe(false);
  });
});
