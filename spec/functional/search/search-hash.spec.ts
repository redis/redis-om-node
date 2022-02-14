import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

import { SampleHashEntity, createHashEntitySchema, loadTestHash } from '../helpers/data-helper';
import { flushAll } from '../helpers/redis-helper';

import { AN_ENTITY, ANOTHER_ENTITY, A_THIRD_ENTITY, AN_ESCAPED_ENTITY, A_GEOPOINT } from '../../helpers/example-data';

describe("search for hashes", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;
  let entities: SampleHashEntity[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    await flushAll(client);
    await loadTestHash(client, 'SampleHashEntity:1', AN_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:2', ANOTHER_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:3', A_THIRD_ENTITY);
    await loadTestHash(client, 'SampleHashEntity:4', AN_ESCAPED_ENTITY);
    
    schema = createHashEntitySchema();
    repository = client.fetchRepository<SampleHashEntity>(schema);

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
    entities = await repository.search().where('aFullTextString').matches('brown quick').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY })
    ]));
  });

  it("searches a string with full text and an exact match", async () => {
    entities = await repository.search().where('aFullTextString').exactly.matches('quick brown').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY })
    ]));
  });

  it("searches a string with full text and stop words", async () => {
    entities = await repository.search().where('aFullTextString').matches('brown quick the').returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
    ]));
  });

  it("throw an error when searching a string with full text, an exact match, and stop words", async () => {
    expect(async () => {
      entities = await repository.search().where('aFullTextString').exactly.matches('the quick brown').returnAll();
    }).rejects.toThrow(`The query to RediSearch had a syntax error: "Syntax error at offset 19 near the".\nThis is often the result of using a stop word in the query. Either change the query to not use a stop word or change the stop words in the schema definition. You can check the RediSearch source for the default stop words at: https://github.com/RediSearch/RediSearch/blob/master/src/stopwords.h`)
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

  it("searches a geopoint", async () => {
    entities = await repository.search()
      .where('aGeoPoint').inCircle(circle => circle.origin(A_GEOPOINT).radius(10).meters)
        .returnAll();

    expect(entities).toHaveLength(1);
    expect(entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityId: '1', ...AN_ENTITY }),
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
      .and('aGeoPoint').inCircle(circle => circle.origin(A_GEOPOINT).radius(10).meters)
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
