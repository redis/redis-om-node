import { Schema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';
import { SchemaDefinition } from '$lib/schema/definition';
import { DataStructure } from '$lib/schema/options';

describe("Schema", () => {
  describe.each([

    ["that defines an unindexed binary", {
      schemaDef: { aField: { type: 'binary' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'NOINDEX'
      ]
    }],

    ["that defines a FLAT / 512 / COSINE vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE'
      ]
    }],

    ["that defines a FLAT / 256 / IP vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'FLAT', dim: 256, distance_metric: 'IP' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '256', 'DISTANCE_METRIC', 'IP'
      ]
    }],

    ["that defines a FLAT / 1024 / L2 vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'FLAT', dim: 1024, distance_metric: 'L2' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '1024', 'DISTANCE_METRIC', 'L2'
      ]
    }],

    ["that defines a FLAT / 512 / COSINE vector with block_size for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE', block_size: 512*512 } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'FLAT', '8', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE', 'BLOCK_SIZE', '262144'
      ]
    }],

    ["that defines an aliased FLAT / 512 / COSINE vector for a HASH", {
      schemaDef: { aField: { type: 'binary', alias: 'anotherField', vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'anotherField', 'VECTOR', 'FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE'
      ]
    }],

    // NOTE: it makes little sense to do this, but maybe someone wants to turn off indexing
    // but keep the schema definition, so we'll assume that NOINDEX should take precendence
    ["that defines an unindexed FLAT vector for a HASH", {
      schemaDef: { aField: { type: 'binary', indexed: false, vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'NOINDEX'
      ]
    }],

    ["that defines a HNSW / 512 / COSINE vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '6', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE'
      ]
    }],

    ["that defines a HNSW / 256 / IP vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 256, distance_metric: 'IP' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '6', 'TYPE', 'FLOAT32', 'DIM', '256', 'DISTANCE_METRIC', 'IP'
      ]
    }],

    ["that defines a HNSW / 1024 / L2 vector for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 1024, distance_metric: 'L2' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '6', 'TYPE', 'FLOAT32', 'DIM', '1024', 'DISTANCE_METRIC', 'L2'
      ]
    }],

    ["that defines a HNSW / 512 / COSINE vector with M for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE', m: 8 } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '8', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE', 'M', '8'
      ]
    }],

    ["that defines a HNSW / 512 / COSINE vector with EF_CONSTRUCTION for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE', ef_construction: 250 } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '8', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE', 'EF_CONSTRUCTION', '250'
      ]
    }],

    ["that defines a HNSW / 512 / COSINE vector with EF_RUNTIME for a HASH", {
      schemaDef: { aField: { type: 'binary', vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE', ef_runtime: 20 } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'VECTOR', 'HNSW', '8', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE', 'EF_RUNTIME', '20'
      ]
    }],

    ["that defines an aliased HNSW / 512 / COSINE vector for a HASH", {
      schemaDef: { aField: { type: 'binary', alias: 'anotherField', vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'anotherField', 'VECTOR', 'HNSW', '6', 'TYPE', 'FLOAT32', 'DIM', '512', 'DISTANCE_METRIC', 'COSINE'
      ]
    }],

    // NOTE: it makes little sense to do this, but maybe someone wants to turn off indexing
    // but keep the schema definition, so we'll assume that NOINDEX shoudl take precendence
    ["that defines an unindexed HNSW vector for a HASH", {
      schemaDef: { aField: { type: 'binary', indexed: false, vector: { algorithm: 'HNSW', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: [
        'aField', 'NOINDEX'
      ]
    }],

  ])("%s", (_, data) => {

    class TestEntity extends Entity {}

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
