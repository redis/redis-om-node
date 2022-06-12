import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleHashEntity, loadTestHash, createHashEntitySchema } from '../helpers/data-helper';
import { keyExists, removeAll } from '../helpers/redis-helper';

import { ANOTHER_ENTITY, AN_EMPTY_ENTITY, AN_ENTITY, A_THIRD_ENTITY } from '../../helpers/example-data';

describe("remove hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;

  let exists: boolean;

  beforeAll(async () => {
    client = await new Client().open();
    schema = createHashEntitySchema('remove-hash');
    repository = client.fetchRepository<SampleHashEntity>(schema);
  })

  beforeEach(async () => {
    await removeAll(client, 'remove-hash:')
    await loadTestHash(client, 'remove-hash:foo', AN_ENTITY);
    await loadTestHash(client, 'remove-hash:bar', ANOTHER_ENTITY);
    await loadTestHash(client, 'remove-hash:baz', A_THIRD_ENTITY);
  });

  afterAll(async () => await client.close());

  it("removes a single entity", async () => {
    exists = await keyExists(client, 'remove-hash:foo');
    expect(exists).toBe(true);

    await repository.remove('foo');

    exists = await keyExists(client, 'remove-hash:foo');
    expect(exists).toBe(false);
  });

  it("removes multiple entities", async () => {
    exists = await keyExists(client, 'remove-hash:foo');
    expect(exists).toBe(true);

    exists = await keyExists(client, 'remove-hash:bar');
    expect(exists).toBe(true);

    exists = await keyExists(client, 'remove-hash:baz');
    expect(exists).toBe(true);

    await repository.remove('foo', 'bar', 'baz');

    exists = await keyExists(client, 'remove-hash:foo');
    expect(exists).toBe(false);

    exists = await keyExists(client, 'remove-hash:bar');
    expect(exists).toBe(false);

    exists = await keyExists(client, 'remove-hash:full');
    expect(exists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    exists = await keyExists(client, 'remove-hash:empty');
    expect(exists).toBe(false);

    await repository.remove('empty');

    exists = await keyExists(client, 'remove-hash:empty');
    expect(exists).toBe(false);
  });
});
