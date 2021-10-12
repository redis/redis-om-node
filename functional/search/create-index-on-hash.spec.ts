import { createHashEntitySchema, HashEntity } from '../helpers/data-helper';
import { fetchIndexInfo  } from '../helpers/redis-helper';
  
import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Repository from '../../lib/repository/repository';

describe("create index on hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;
  let result: string[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    schema = createHashEntitySchema();
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<HashEntity>(schema);
    await repository.createIndex();
    result = await fetchIndexInfo(client, 'HashEntity:index');
  });

  afterAll(async () => await client.close());

  it("has the expected name", () => {
    let indexName = result[1];
    expect(indexName).toBe('HashEntity:index');
  });

  it("has the expected key type", () => {
    let keyType = result[5][1];
    expect(keyType).toBe('HASH');
  });

  it("has the expected prefixes", () => {
    let prefixes = result[5][3];
    expect(prefixes).toEqual([ 'HashEntity:' ]);
  });

  it("has the expected fields", () => {
    let fields = result[7];
    expect(fields).toHaveLength(10);
    expect(fields[0]).toEqual([ 'aString', 'type', 'TAG', 'SEPARATOR', '|' ]);
    expect(fields[1]).toEqual([ 'anotherString', 'type', 'TAG', 'SEPARATOR', '|' ]);
    expect(fields[2]).toEqual([ 'aFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ]);
    expect(fields[3]).toEqual([ 'anotherFullTextString', 'type', 'TEXT', 'WEIGHT', '1' ]);
    expect(fields[4]).toEqual([ 'aNumber', 'type', 'NUMERIC' ]);
    expect(fields[5]).toEqual([ 'anotherNumber', 'type', 'NUMERIC' ]);
    expect(fields[6]).toEqual([ 'aBoolean', 'type', 'TAG', 'SEPARATOR', ',' ]);
    expect(fields[7]).toEqual([ 'anotherBoolean', 'type', 'TAG', 'SEPARATOR', ',' ]);
    expect(fields[8]).toEqual([ 'anArray', 'type', 'TAG', 'SEPARATOR', '|' ]);
    expect(fields[9]).toEqual([ 'anotherArray', 'type', 'TAG', 'SEPARATOR', '|' ]);
  });
});
