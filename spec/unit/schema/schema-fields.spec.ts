import { Schema, EmbeddedSchema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';
import { EntityData } from '$lib/entity/entity-data';
import { DataStructure } from '$lib/schema/options';
import { Point } from '$lib/entity/point';
import {
  A_STRING, ANOTHER_STRING,
  A_NUMBER, ANOTHER_NUMBER,
  SOME_STRINGS, SOME_OTHER_STRINGS,
  SOME_TEXT, SOME_OTHER_TEXT,
  A_DATE, ANOTHER_DATE,
  A_POINT, ANOTHER_POINT, A_THIRD_NUMBER, A_THIRD_STRING, SOME_MORE_TEXT
} from '../../helpers/example-data';

describe("Schema", () => {

  interface TestEntity {
    aBoolean: boolean;
    aNumber: number;
    aString: string;
    someText: string;
    aPoint: Point;
    aDate: Date;
    someStrings: Array<string>;
    anObject: TestEmbeddedEntity;
  }

  interface TestEmbeddedEntity {
    aNumber: number;
    aString: string;
    someText: string;
    aDeeperObject: TestDeeplyEmbeddedEntity;
  }

  interface TestDeeplyEmbeddedEntity {
    aNumber: number;
    aString: string;
    someText: string;
  }

  class TestEntity extends Entity {}
  class TestEmbeddedEntity extends Entity {}
  class TestDeeplyEmbeddedEntity extends Entity {}

  let schema: Schema<TestEntity>;
  let embeddedSchema: EmbeddedSchema<TestEmbeddedEntity>;
  let deeplyEmbeddedSchema: EmbeddedSchema<TestDeeplyEmbeddedEntity>;

  let entity: TestEntity;

  describe.each([
    ["when configured for HASH", 'HASH'],
    ["when configured for JSON", 'JSON']
  ])("%s", (_, dataStructure) => {

    beforeAll(() => {

      deeplyEmbeddedSchema = new EmbeddedSchema<TestDeeplyEmbeddedEntity>(TestDeeplyEmbeddedEntity, {
        aNumber: { type: 'number' },
        aString: { type: 'string' },
        someText: { type: 'text' }
      })

      embeddedSchema = new EmbeddedSchema<TestEmbeddedEntity>(TestEmbeddedEntity, {
        aNumber: { type: 'number' },
        aString: { type: 'string' },
        someText: { type: 'text' },
        aDeeperObject: { type: 'object', schema: deeplyEmbeddedSchema }
      })

      schema = new Schema<TestEntity>(TestEntity, {
        aBoolean: { type: 'boolean' },
        aNumber: { type: 'number' },
        aString: { type: 'string' },
        someText: { type: 'string' },
        aPoint: { type: 'point' },
        aDate: { type: 'date' },
        someStrings: { type: 'string[]' },
        anObject: { type: 'object', schema: embeddedSchema }
      }, { dataStructure: dataStructure as DataStructure });
    });

    beforeEach(() => {
      const entityData: EntityData = {
        aBoolean: true,
        aNumber: A_NUMBER,
        aString: A_STRING,
        someText: SOME_TEXT,
        aPoint: A_POINT,
        aDate: A_DATE,
        someStrings: SOME_STRINGS,
        anObject: {
          aNumber: ANOTHER_NUMBER,
          aString: ANOTHER_STRING,
          someText: SOME_OTHER_TEXT,
          aDeeperObject: {
            aNumber: A_THIRD_NUMBER,
            aString: A_THIRD_STRING,
            someText: SOME_MORE_TEXT,
          }
        }
      };
      entity = new TestEntity(schema, "some_id", entityData)
    });

    it("adds a boolean getter and setter", () => {
      expect(entity).toHaveProperty('aBoolean', true);
      entity.aBoolean = false;
      expect(entity.aBoolean).toBe(false);
    });

    it("adds a number getter and setter", () => {
      expect(entity).toHaveProperty('aNumber', A_NUMBER);
      entity.aNumber = ANOTHER_NUMBER;
      expect(entity.aNumber).toBe(ANOTHER_NUMBER);
    });

    it("adds a string getter and setter", () => {
      expect(entity).toHaveProperty('aString', A_STRING);
      entity.aString = ANOTHER_STRING;
      expect(entity.aString).toBe(ANOTHER_STRING);
    });

    it("adds a text getter and setter", () => {
      expect(entity).toHaveProperty('someText', SOME_TEXT);
      entity.someText = SOME_OTHER_TEXT;
      expect(entity.someText).toBe(SOME_OTHER_TEXT);
    });

    it("adds a point getter and setter", () => {
      expect(entity).toHaveProperty('aPoint', A_POINT);
      entity.aPoint = ANOTHER_POINT;
      expect(entity.aPoint).toEqual(ANOTHER_POINT);
    });

    it("adds a date getter and setter", () => {
      expect(entity).toHaveProperty('aDate', A_DATE);
      entity.aDate = ANOTHER_DATE;
      expect(entity.aDate).toBe(ANOTHER_DATE);
    });

    it("adds a array getter and setter", () => {
      expect(entity).toHaveProperty('someStrings', SOME_STRINGS);
      entity.someStrings = SOME_OTHER_STRINGS;
      expect(entity.someStrings).toEqual(SOME_OTHER_STRINGS);
    });

    it("adds an object getter and setter", () => {
      expect(entity).toHaveProperty('anObject', expect.any(TestEmbeddedEntity));
    });

    describe("embedded object", () => {

      it("adds embedded getters and setters", () => {
        expect(entity.anObject).toHaveProperty('aNumber', ANOTHER_NUMBER);
        expect(entity.anObject).toHaveProperty('aString', A_STRING);
        expect(entity.anObject).toHaveProperty('someText', SOME_TEXT);

        entity.anObject.aNumber = A_THIRD_NUMBER;
        entity.anObject.aString = A_THIRD_STRING;
        entity.anObject.someText = SOME_MORE_TEXT;

        expect(entity.anObject.aNumber).toBe(A_THIRD_NUMBER);
        expect(entity.anObject.aString).toBe(A_THIRD_STRING);
        expect(entity.anObject.someText).toBe(SOME_MORE_TEXT);
      });

      it("adds a deeper object getter and setter", () => {
        expect(entity.anObject).toHaveProperty('aDeeperObject', expect.any(TestDeeplyEmbeddedEntity));
      });

      describe("deeply embedded object", () => {
        it("adds deeply embedded getters and setters", () => {
          expect(entity.anObject).toHaveProperty('aNumber', A_THIRD_NUMBER);
          expect(entity.anObject).toHaveProperty('aString', A_THIRD_STRING);
          expect(entity.anObject).toHaveProperty('someText', SOME_MORE_TEXT);

          entity.anObject.aNumber = A_NUMBER;
          entity.anObject.aString = A_STRING
          entity.anObject.someText = SOME_TEXT;

          expect(entity.anObject.aNumber).toBe(A_NUMBER);
          expect(entity.anObject.aString).toBe(A_STRING);
          expect(entity.anObject.someText).toBe(SOME_TEXT);
        });
      });
    });
  });
});
