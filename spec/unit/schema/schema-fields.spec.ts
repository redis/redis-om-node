import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import EntityData from '../../../lib/entity/entity-data';
import DataStructure from '../../../lib/schema/options/data-structure';
import Point from '../../../lib/entity/point';
import {
  A_STRING, ANOTHER_STRING,
  A_NUMBER, ANOTHER_NUMBER,
  SOME_STRINGS, SOME_OTHER_STRINGS,
  SOME_TEXT, SOME_OTHER_TEXT,
  A_DATE, ANOTHER_DATE,
  A_POINT, ANOTHER_POINT
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
  }

  class TestEntity extends Entity { }

  let schema: Schema<TestEntity>;
  let entity: TestEntity;

  describe.each([
    ["when configured for HASH", 'HASH'],
    ["when configured for JSON", 'JSON']
  ])("%s", (_, dataStructure) => {

    beforeAll(() => {
      schema = new Schema<TestEntity>(TestEntity, {
        aBoolean: { type: 'boolean' },
        aNumber: { type: 'number' },
        aString: { type: 'string' },
        someText: { type: 'string' },
        aPoint: { type: 'point' },
        aDate: { type: 'date' },
        someStrings: { type: 'string[]' }
      }, { dataStructure: dataStructure as DataStructure });
    });

    beforeEach(() => {
      let entityData: EntityData = {};
      entityData.aBoolean = true;
      entityData.aNumber = A_NUMBER;
      entityData.aString = A_STRING;
      entityData.someText = SOME_TEXT;
      entityData.aPoint = A_POINT;
      entityData.aDate = A_DATE;
      entityData.someStrings = SOME_STRINGS;
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
  });
});
