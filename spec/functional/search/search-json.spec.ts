import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { ANOTHER_ENTITY, AN_ENTITY, AN_ESCAPED_ENTITY, A_THIRD_ENTITY,
  createJsonEntitySchema, JsonEntity, loadTestJson } from '../helpers/data-helper';

describe("search for JSON documents", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;
  let entities: JsonEntity[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await client.execute(['FLUSHALL']);
    await loadTestJson(client, 'JsonEntity:1', AN_ENTITY);
    await loadTestJson(client, 'JsonEntity:2', ANOTHER_ENTITY);
    await loadTestJson(client, 'JsonEntity:3', A_THIRD_ENTITY);
    await loadTestJson(client, 'JsonEntity:4', AN_ESCAPED_ENTITY);
    
    schema = createJsonEntitySchema();
    repository = client.fetchRepository<JsonEntity>(schema);

    await repository.createIndex();
  });

  afterAll(async () => await client.close());

  it("performs a wildcard search", async () => {
    entities = await repository.search().returnAll();

    expect(entities).toHaveLength(4);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY }),
      expect.objectContaining({ entityId: '3', ...A_THIRD_ENTITY }),
      expect.objectContaining({ entityId: '4', ...AN_ESCAPED_ENTITY })
    ]));
  });

  it("performs a paginated search", async () => {
    entities = await repository.search().returnAll({ pageSize: 2 });

    expect(entities).toHaveLength(4);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY }),
      expect.objectContaining({ entityId: '3', ...A_THIRD_ENTITY }),
      expect.objectContaining({ entityId: '4', ...AN_ESCAPED_ENTITY })
    ]));
  });

  it("searches a string", async () => {
    entities = await repository.search().where('aString').eq('foo').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY })
    ]));
  });

  it("searches a string with full text", async () => {
    entities = await repository.search().where('aFullTextString').matches('quick').returnAll();

    expect(entities).toHaveLength(2);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY })
    ]));
  });

  it("searches a string with full text and an exact match", async () => {
    entities = await repository.search().where('aFullTextString').exactly.matches('lazy dog').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY })
    ]));
  });

  it("searches a string with full text, an exact match, and stop words", async () => {
    entities = await repository.search().where('aFullTextString').exactly.matches('the lazy dog').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
    ]));
  });

  it("searches a number", async () => {
    entities = await repository.search().where('aNumber').lte(23).returnAll();

    expect(entities).toHaveLength(2);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY }),
      expect.objectContaining({ entityId: '3', ...A_THIRD_ENTITY })
    ]));
  });

  it("searches a boolean", async () => {
    entities = await repository.search().where('aBoolean').true().returnAll();

    expect(entities).toHaveLength(2);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY })
    ]));
  });

  it("searches an array", async () => {
    entities = await repository.search().where('anArray').contains('charlie').returnAll();

    expect(entities).toHaveLength(3);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
      expect.objectContaining({ entityId: '2', ...ANOTHER_ENTITY }),
      expect.objectContaining({ entityId: '3', ...A_THIRD_ENTITY })
    ]));
  });

  it("searches all the field types", async () => {
    entities = await repository.search()
      .where('aString').eq('foo')
      .and('aFullTextString').matches('dog')
      .and('aNumber').gte(42)
      .and('aBoolean').true()
      .and('anArray').contains('alfa')
      .returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY })
    ]));
  });

  it("searches a string with escaped punctuation", async () => {
    entities = await repository.search().where('aString').equals('foo ,.<>{}[]"\':;!@#$%^*()-+=~& bar').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '4', ...AN_ESCAPED_ENTITY })
    ]));
  });

  it("searches a string with full text with escaped punctuation", async () => {
    entities = await repository.search().where('aFullTextString').matches('zany').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '4', ...AN_ESCAPED_ENTITY })
    ]));
  });

  it("searches an array with escaped punctuation", async () => {
    entities = await repository.search().where('anArray').contains('alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '4', ...AN_ESCAPED_ENTITY })
    ]));
  });
});
