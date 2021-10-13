import { AN_EMPTY_ENTITY, AN_ENTITY, A_PARTIAL_ENTITY,
  createJsonEntitySchema, expectEntityMatches, JsonEntity, loadTestJson } from '../helpers/data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

describe("fetch JSON", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestJson(client, 'JsonEntity:full', AN_ENTITY);
    await loadTestJson(client, 'JsonEntity:partial', A_PARTIAL_ENTITY);
    await loadTestJson(client, 'JsonEntity:empty', AN_EMPTY_ENTITY);

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<JsonEntity>(schema);
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