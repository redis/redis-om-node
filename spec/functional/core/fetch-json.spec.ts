import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleJsonEntity, createJsonEntitySchema, loadTestJson } from '../helpers/data-helper';
import { flushAll } from '../helpers/redis-helper';

import { AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY } from '../../helpers/example-data';

describe("fetch JSON", () => {

  let client: Client;
  let repository: Repository<SampleJsonEntity>;
  let schema: Schema<SampleJsonEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await flushAll(client);
    await loadTestJson(client, 'SampleJsonEntity:full', AN_ENTITY);
    await loadTestJson(client, 'SampleJsonEntity:partial', A_PARTIAL_ENTITY);
    await loadTestJson(client, 'SampleJsonEntity:empty', AN_EMPTY_ENTITY);

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<SampleJsonEntity>(schema);
  });

  afterAll(async () => await client.close());

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
});