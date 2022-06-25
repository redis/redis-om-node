import { Client } from '$lib/client';
import { Schema } from '$lib/schema/schema';
import { Repository } from '$lib/repository';

import { SampleJsonEntity, loadTestJson, createJsonEntitySchema } from '../helpers/data-helper';
import { keyExists, removeAll } from '../helpers/redis-helper';

import { ANOTHER_ENTITY, AN_EMPTY_ENTITY, AN_ENTITY, A_THIRD_ENTITY } from '../../helpers/example-data';

describe("remove JSON", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;

  let exists: boolean;

  beforeAll(async () => {
    client = await new Client().open();
    schema = createJsonEntitySchema('remove-json')
    repository = client.fetchRepository<SampleJsonEntity>(schema);
  })

  beforeEach(async () => {
    await removeAll(client, 'remove-json:')
    await loadTestJson(client, 'remove-json:foo', AN_ENTITY);
    await loadTestJson(client, 'remove-json:bar', ANOTHER_ENTITY);
    await loadTestJson(client, 'remove-json:baz', A_THIRD_ENTITY);
  });

  afterAll(async () => await client.close());

  it("removes a single entity", async () => {
    exists = await keyExists(client, 'remove-json:foo');
    expect(exists).toBe(true);

    await repository.remove('foo');

    exists = await keyExists(client, 'remove-json:foo');
    expect(exists).toBe(false);
  });

  it("removes multiple entities", async () => {
    exists = await keyExists(client, 'remove-json:foo');
    expect(exists).toBe(true);

    exists = await keyExists(client, 'remove-json:bar');
    expect(exists).toBe(true);

    exists = await keyExists(client, 'remove-json:baz');
    expect(exists).toBe(true);

    await repository.remove('foo', 'bar', 'baz');

    exists = await keyExists(client, 'remove-json:foo');
    expect(exists).toBe(false);

    exists = await keyExists(client, 'remove-json:bar');
    expect(exists).toBe(false);

    exists = await keyExists(client, 'remove-json:baz');
    expect(exists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    exists = await keyExists(client, 'remove-json:empty');
    expect(exists).toBe(false);

    await repository.remove('empty');

    exists = await keyExists(client, 'remove-json:empty');
    expect(exists).toBe(false);
  });
});
