import { GeoPoint } from "../../lib/schema/schema-definitions";

export const A_DATE: Date = new Date('1997-07-04T16:56:55.000Z');
export const A_DATE_ISO: string = A_DATE.toISOString();
export const A_DATE_EPOCH: number = A_DATE.getTime();
export const A_DATE_EPOCH_STRING: string = A_DATE_EPOCH.toString();

export const ANOTHER_DATE: Date = new Date('1969-07-20T20:17:40.000Z');
export const ANOTHER_DATE_ISO: string = ANOTHER_DATE.toISOString();
export const ANOTHER_DATE_EPOCH: number = ANOTHER_DATE.getTime();
export const ANOTHER_DATE_EPOCH_STRING: string = ANOTHER_DATE_EPOCH.toString();

export const A_THIRD_DATE: Date = new Date('2015-07-14T11:49:57.000Z');
export const A_THIRD_DATE_ISO: string = A_THIRD_DATE.toISOString();
export const A_THIRD_DATE_EPOCH: number = A_THIRD_DATE.getTime();
export const A_THIRD_DATE_EPOCH_STRING: string = A_THIRD_DATE_EPOCH.toString();

export const A_GEOPOINT: GeoPoint = { longitude: 12.34, latitude: 56.78 };
export const A_GEOPOINT_JSON: string = JSON.stringify(A_GEOPOINT);
export const A_GEOPOINT_STRING: string = `${A_GEOPOINT.longitude},${A_GEOPOINT.latitude}`;

export const ANOTHER_GEOPOINT: GeoPoint = { longitude: 23.45, latitude: 67.89 };
export const ANOTHER_GEOPOINT_JSON: string = JSON.stringify(ANOTHER_GEOPOINT);
export const ANOTHER_GEOPOINT_STRING: string = `${ANOTHER_GEOPOINT.longitude},${ANOTHER_GEOPOINT.latitude}`;

export const A_THIRD_GEOPOINT: GeoPoint = { longitude: 34.56, latitude: 78.90 };
export const A_THIRD_GEOPOINT_JSON: string = JSON.stringify(A_THIRD_GEOPOINT);
export const A_THIRD_GEOPOINT_STRING: string = `${A_THIRD_GEOPOINT.longitude},${A_THIRD_GEOPOINT.latitude}`;

export const AN_ARRAY: string[] = [ 'alfa', 'bravo', 'charlie' ];
export const AN_ARRAY_JSON: string = JSON.stringify(AN_ARRAY);
export const AN_ARRAY_JOINED: string = AN_ARRAY.join('|');
export const AN_ARRAY_LEN: number = AN_ARRAY.length;

export const ANOTHER_ARRAY: string[] = [ 'bravo', 'charlie', 'delta' ];
export const ANOTHER_ARRAY_JSON: string = JSON.stringify(ANOTHER_ARRAY);
export const ANOTHER_ARRAY_JOINED: string = ANOTHER_ARRAY.join('|');
export const ANOTHER_ARRAY_LEN: number = ANOTHER_ARRAY.length;

export const A_THIRD_ARRAY: string[] = [ 'charlie', 'delta', 'echo' ];
export const A_THIRD_JSON: string = JSON.stringify(A_THIRD_ARRAY);
export const A_THIRD_ARRAY_JOINED: string = A_THIRD_ARRAY.join('|');
export const A_THIRD_ARRAY_LEN: number = ANOTHER_ARRAY.length;

export type SampleEntityData = {
  aString: string | null;
  anotherString: string | null;
  aFullTextString: string | null;
  anotherFullTextString: string | null;
  aNumber: number | null;
  anotherNumber: number | null;
  aBoolean: boolean | null;
  anotherBoolean: boolean | null;
  aGeoPoint: GeoPoint | null;
  anotherGeoPoint: GeoPoint | null;
  aDate: Date | null;
  anotherDate: Date | null;
  anArray: string[] | null;
  anotherArray: string[] | null;  
};

export const AN_ENTITY: SampleEntityData = {
  aString: 'foo',
  anotherString: 'bar',
  aFullTextString: 'The quick brown fox jumped over the lazy dog.',
  anotherFullTextString: 'The five boxing wizards jump quickly.',
  aNumber: 42,
  anotherNumber: 23,
  aBoolean: true,
  anotherBoolean: false,
  aGeoPoint: A_GEOPOINT,
  anotherGeoPoint: ANOTHER_GEOPOINT,
  aDate: A_DATE,
  anotherDate: ANOTHER_DATE,
  anArray: AN_ARRAY,
  anotherArray: ANOTHER_ARRAY
};

export const ANOTHER_ENTITY: SampleEntityData = {
  aString: 'bar',
  anotherString: 'baz',
  aFullTextString: 'How vexingly quick daft zebras jump!',
  anotherFullTextString: 'Pack my box with five dozen liquor jugs.',
  aNumber: 23,
  anotherNumber: 13,
  aBoolean: true,
  anotherBoolean: true,
  aGeoPoint: ANOTHER_GEOPOINT,
  anotherGeoPoint: A_THIRD_GEOPOINT,
  aDate: ANOTHER_DATE,
  anotherDate: A_THIRD_DATE,
  anArray: ANOTHER_ARRAY,
  anotherArray: A_THIRD_ARRAY
};

export const A_THIRD_ENTITY: SampleEntityData = {
  aString: 'baz',
  anotherString: 'qux',
  aFullTextString: 'Sphinx of black quartz, judge my vow.',
  anotherFullTextString: 'Mr. Jock, TV quiz Ph.D., bags few lynx.',
  aNumber: 13,
  anotherNumber: 7,
  aBoolean: false,
  anotherBoolean: false,
  aGeoPoint: A_THIRD_GEOPOINT,
  anotherGeoPoint: A_GEOPOINT,
  aDate: A_THIRD_DATE,
  anotherDate: A_DATE,
  anArray: A_THIRD_ARRAY,
  anotherArray: AN_ARRAY
};

export const A_PARTIAL_ENTITY: SampleEntityData = {
  aString: 'foo',
  anotherString: null,
  aFullTextString: 'The quick brown fox jumped over the lazy dog.',
  anotherFullTextString: null,
  aNumber: 42,
  anotherNumber: null,
  aBoolean: true,
  anotherBoolean: null,
  aGeoPoint: A_GEOPOINT,
  anotherGeoPoint: null,
  aDate: A_DATE,
  anotherDate: null,
  anArray: AN_ARRAY,
  anotherArray: null
};

export const AN_EMPTY_ENTITY: SampleEntityData = {
  aString: null,
  anotherString: null,
  aFullTextString: null,
  anotherFullTextString: null,
  aNumber: null,
  anotherNumber: null,
  aBoolean: null,
  anotherBoolean: null,
  aGeoPoint: null,
  anotherGeoPoint: null,
  aDate: null,
  anotherDate: null,
  anArray: null,
  anotherArray: null
};

export const AN_ESCAPED_ENTITY: SampleEntityData = {
  aString: "foo ,.<>{}[]\"':;!@#$%^*()-+=~& bar",
  anotherString: null,
  aFullTextString: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
  anotherFullTextString: null,
  aNumber: null,
  anotherNumber: null,
  aBoolean: null,
  anotherBoolean: null,
  aGeoPoint: null,
  anotherGeoPoint: null,
  aDate: null,
  anotherDate: null,
  anArray: [ 'alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo', 'charlie delta' ],
  anotherArray: null
};

