import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleHashEntity, createHashEntitySchema, loadTestHash } from '../helpers/data-helper';
import { flushAll, keyExists } from '../helpers/redis-helper';

import { AN_EMPTY_ENTITY, AN_ENTITY } from '../../helpers/example-data';

describe("remove hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await flushAll(client);
    await loadTestHash(client, 'SampleHashEntity:full', AN_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:full2', AN_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:full3', AN_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:empty', AN_EMPTY_ENTITY);
    
    schema = createHashEntitySchema();
    repository = client.fetchRepository<SampleHashEntity>(schema);
  });

  afterAll(async () => await client.close());
      
  it("removes an entity", async () => {
    let exists;

    exists = await keyExists(client, 'SampleHashEntity:full');
    expect(exists).toBe(true);

    await repository.remove('full');

    exists = await keyExists(client, 'SampleHashEntity:full');
    expect(exists).toBe(false);
  });

  it("removes many entities", async () => {
    let firstEntityExists;
    let secondEntityExists;

    firstEntityExists = await keyExists(client, 'SampleHashEntity:full3');
    expect(firstEntityExists).toBe(true);

    secondEntityExists = await keyExists(client, 'SampleHashEntity:full2');
    expect(secondEntityExists).toBe(true);

    await repository.remove(['full3', 'full2']);

    firstEntityExists = await keyExists(client, 'SampleHashEntity:full3');
    expect(firstEntityExists).toBe(false);
    secondEntityExists = await keyExists(client, 'SampleHashEntity:full2');
    expect(secondEntityExists).toBe(false);
  });

  it("removes a non-existing entity", async () => {
    let exists;
    exists = await keyExists(client, 'SampleHashEntity:empty');
    expect(exists).toBe(false);

    await repository.remove('empty');

    exists = await keyExists(client, 'SampleHashEntity:empty');
    expect(exists).toBe(false);
  });
});
