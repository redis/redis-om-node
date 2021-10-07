import { createBigfootSchema, createBigfootJsonSchema, Bigfoot, BigfootJson } from './helpers/bigfoot-data-helper';
  
import Client from '../lib/client';
import Schema from '../lib/schema/schema';
import Repository from '../lib/repository/repository';

describe("create index on JSON", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<BigfootJson>;
  let result: string[];

  beforeAll(async () => {
    client = new Client();
    await client.open();
    schema = createBigfootJsonSchema();
  });

  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    repository = client.fetchRepository<BigfootJson>(schema);
    await repository.createIndex();
    result = await client.execute<string[]>(['FT.INFO', 'BigfootJson:index']);
  });

  afterAll(async () => await client.close());

  it("has the expected name", () => {
    let indexName = result[1];
    expect(indexName).toBe('BigfootJson:index');
  });

  it("has the expected key type", () => {
    let keyType = result[5][1];
    expect(keyType).toBe('JSON');
  });

  it("has the expected prefixes", () => {
    let prefixes = result[5][3];
    expect(prefixes).toEqual([ 'BigfootJson:' ]);
  });

  it("has the expected fields", () => {
    let fields = result[7];
    expect(fields).toHaveLength(7);
    expect(fields[0]).toEqual([ 'title', 'type', 'TEXT', 'WEIGHT', '1' ]);
    expect(fields[1]).toEqual([ 'county', 'type', 'TAG', 'SEPARATOR', '|' ]);
    expect(fields[2]).toEqual([ 'state', 'type', 'TAG', 'SEPARATOR', '&' ]);
    expect(fields[3]).toEqual([ 'eyewitness', 'type', 'TAG', 'SEPARATOR', ',' ]);
    expect(fields[4]).toEqual([ 'temperature', 'type', 'NUMERIC' ]);
    expect(fields[5]).toEqual([ 'tags', 'type', 'TAG', 'SEPARATOR', '|' ]);
    expect(fields[6]).toEqual([ 'moreTags', 'type', 'TAG', 'SEPARATOR', '&' ]);
  });
});
