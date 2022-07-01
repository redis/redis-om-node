import { Schema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';
import { SchemaDefinition } from '$lib/schema/definition';
import { DataStructure } from '$lib/schema/options';

const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})

describe("Schema", () => {
  describe.each([

    ["that defines a vector for a JSON", {
      schemaDef: { aField: { type: 'vector', vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE' } } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: [],
      expectedWarning: null
    }],

  ])("%s", (_, data) => {

    class TestEntity extends Entity {}

    if (data.expectedWarning) {
      it("generates the expected warning", () => {
        expect(warnSpy).toHaveBeenCalledWith(data.expectedWarning);
      });
    } else {
      it("does not generate a warning", () => {
        expect(warnSpy).not.toHaveBeenCalled();
      });
    }

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
