import Entity from '../../../lib/entity/entity';
import Schema from '../../../lib/schema/schema';
import { GeoPoint } from '../../../lib/schema/schema-definitions';

export const A_TEST_DATE = new Date('1997-07-04T16:56:55.000Z');
export const A_TEST_DATE_ISO = A_TEST_DATE.toISOString();
export const A_TEST_DATE_EPOCH = A_TEST_DATE.getTime();

export const ANOTHER_TEST_DATE = new Date('1969-07-20T20:17:40.000Z');
export const ANOTHER_TEST_DATE_ISO = ANOTHER_TEST_DATE.toISOString();
export const ANOTHER_TEST_DATE_EPOCH = ANOTHER_TEST_DATE.getTime();

export class SimpleEntity extends Entity {}
export class SimpleHashEntity extends SimpleEntity {}
export class SimpleJsonEntity extends SimpleEntity {}

export interface SimpleEntity {
  aString?: string | null;
  aNumber?: number | null;
  aBoolean?: boolean | null;
  aGeoPoint?: GeoPoint | null;
  aDate?: Date | null;
  anArray?: string[] | null;
}

export interface SimpleHashEntity extends SimpleEntity {}
export interface SimpleJsonEntity extends SimpleEntity {}

export class FullTextEntity extends Entity {}
export class AliasedEntity extends Entity {}
export class StopWordsOffEntity extends Entity {}
export class CustomStopWordsEntity extends Entity {}

export interface FullTextEntity {
  aString?: string | null;
}  

export interface AliasedEntity {
  aString?: string | null;
  aNumber?: number | null;
  aBoolean?: boolean | null;
  aGeoPoint?: GeoPoint | null;
  aDate?: Date | null;
  anArray?: string[] | null;
}

export const simpleSchema = new Schema(SimpleEntity, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aGeoPoint: { type: 'geopoint' },
  aDate: { type: 'date' },
  anArray: { type: 'array' }
});

export const simpleHashSchema = new Schema(SimpleHashEntity, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aGeoPoint: { type: 'geopoint' },
  aDate: { type: 'date' },
  anArray: { type: 'array' }
}, {
  dataStructure: 'HASH'
});

export const simpleJsonSchema = new Schema(SimpleJsonEntity, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aGeoPoint: { type: 'geopoint' },
  aDate: { type: 'date' },
  anArray: { type: 'array' }
}, {
  dataStructure: 'JSON'
});

export const fullTextSchema = new Schema(FullTextEntity, {
  aString: { type: 'string', textSearch: true },
});

export const aliasedSchema = new Schema(AliasedEntity, {
  aString: { type: 'string', alias: 'anotherString' },
  aNumber: { type: 'number', alias: 'anotherNumber' },
  aBoolean: { type: 'boolean', alias: 'anotherBoolean' },
  aGeoPoint: { type: 'geopoint', alias: 'anotherGeoPoint' },
  aDate: { type: 'date', alias: 'anotherDate' },
  anArray: { type: 'array', alias: 'anotherArray' }
});

export const stopWordsOffSchema = new Schema(StopWordsOffEntity, {
  aString: { type: 'string', textSearch: true }
}, {
  useStopWords: 'OFF'
});

export const customStopWordsSchema = new Schema(CustomStopWordsEntity, {
  aString: { type: 'string', textSearch: true }
}, {
  useStopWords: 'CUSTOM',
  stopWords: [ 'foo', 'bar', 'baz' ]
});
