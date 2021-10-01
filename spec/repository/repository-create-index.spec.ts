import Globals from '../helpers/globals';
import { createBigfootSchema, createBigfootJsonSchema, Bigfoot, BigfootJson } from '../helpers/bigfoot-data-helper';
  
import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Repository from '../../lib/repository/repository';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;

  describe("#createIndex", () => {
    describe("for a HASH-backed index", () => {

      let schema: Schema<Bigfoot>;
      let result: string[];

      beforeAll(() => {
        client = globals.client;
        schema = createBigfootSchema();
      });
    
      beforeEach(async () => {
        repository = client.fetchRepository<Bigfoot>(schema);
        await repository.createIndex();
        result = await client.redis.sendCommand<string[]>(['FT.INFO', 'Bigfoot:index']);
      });
  
      it("has the expected name", () => {
        let indexName = result[1];
        expect(indexName).toBe('Bigfoot:index');
      });
  
      it("has the expected key type", () => {
        let keyType = result[5][1];
        expect(keyType).toBe('HASH');
      });
  
      it("has the expected prefixes", () => {
        let prefixes = result[5][3];
        expect(prefixes).toEqual([ 'Bigfoot:' ]);
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

    describe("for a JSON-backed index", () => {

      let schema: Schema<BigfootJson>;
      let result: string[];

      beforeAll(() => {
        client = globals.client;
        schema = createBigfootJsonSchema();
      });
    
      beforeEach(async () => {
        repository = client.fetchRepository<BigfootJson>(schema);
        await repository.createIndex();
        result = await client.redis.sendCommand<string[]>(['FT.INFO', 'BigfootJson:index']);
      });
  
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
  });
});
