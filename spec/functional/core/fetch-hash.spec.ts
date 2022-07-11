import { Client } from '$lib/client';
import { Schema } from '$lib/schema/schema';
import { Repository } from '$lib/repository';

import { SampleHashEntity, loadTestHash, createHashEntitySchema } from '../helpers/data-helper';
import { removeAll } from '../helpers/redis-helper';

import { AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY } from '../../helpers/example-data';

describe("fetch hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await removeAll(client, 'fetch-hash:')
    await loadTestHash(client, 'fetch-hash:full', AN_ENTITY);
    await loadTestHash(client, 'fetch-hash:partial', A_PARTIAL_ENTITY);
    await loadTestHash(client, 'fetch-hash:empty', AN_EMPTY_ENTITY);

    schema = createHashEntitySchema('fetch-hash');
    repository = client.fetchRepository<SampleHashEntity>(schema);
  });

  afterAll(async () => {
    await removeAll(client, 'fetch-hash:')
    await client.close()
  });

  it("fetches a fully populated entity from Redis", async () => {
    let entity = await repository.fetch('full');
    expect(entity.entityId).toBe('full');
    expect(entity).toEqual(expect.objectContaining(AN_ENTITY));
  });

  it("fetches a partially populated entity from Redis", async () => {
    let entity = await repository.fetch('partial');
    expect(entity.entityId).toBe('partial');
    expect(entity).toEqual(expect.objectContaining(A_PARTIAL_ENTITY));
  });

  it("fetches an empty entity from Redis", async () => {
    let entity = await repository.fetch('empty');
    expect(entity.entityId).toBe('empty');
    expect(entity).toEqual(expect.objectContaining(AN_EMPTY_ENTITY));
  });

  it("fetches all the entities from Redis", async () => {
    let entities = await repository.fetch('full', 'partial', 'empty');
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: 'full', ...AN_ENTITY }),
      expect.objectContaining({ entityId: 'partial', ...A_PARTIAL_ENTITY }),
      expect.objectContaining({ entityId: 'empty', ...AN_EMPTY_ENTITY })
    ]));
  });
});