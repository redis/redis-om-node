import { Point } from "../../lib/schema/schema-definitions";


export const A_STRING = 'foo';
export const ANOTHER_STRING = 'bar';
export const A_THIRD_STRING = 'baz';

export const A_NUMBER = 42;
export const ANOTHER_NUMBER = 23;
export const A_THIRD_NUMBER = 13;

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

export const A_POINT: Point = { longitude: 12.34, latitude: 56.78 };
export const A_POINT_JSON: string = JSON.stringify(A_POINT);
export const A_POINT_STRING: string = `${A_POINT.longitude},${A_POINT.latitude}`;

export const ANOTHER_POINT: Point = { longitude: 23.45, latitude: 67.89 };
export const ANOTHER_POINT_JSON: string = JSON.stringify(ANOTHER_POINT);
export const ANOTHER_POINT_STRING: string = `${ANOTHER_POINT.longitude},${ANOTHER_POINT.latitude}`;

export const A_THIRD_POINT: Point = { longitude: 34.56, latitude: 78.90 };
export const A_THIRD_POINT_JSON: string = JSON.stringify(A_THIRD_POINT);
export const A_THIRD_POINT_STRING: string = `${A_THIRD_POINT.longitude},${A_THIRD_POINT.latitude}`;

export const A_STRING_ARRAY: string[] = [ 'alfa', 'bravo', 'charlie' ];
export const A_STRING_ARRAY_JSON: string = JSON.stringify(A_STRING_ARRAY);
export const A_STRING_ARRAY_JOINED: string = A_STRING_ARRAY.join('|');
export const A_STRING_ARRAY_LEN: number = A_STRING_ARRAY.length;

export const ANOTHER_STRING_ARRAY: string[] = [ 'bravo', 'charlie', 'delta' ];
export const ANOTHER_STRING_ARRAY_JSON: string = JSON.stringify(ANOTHER_STRING_ARRAY);
export const ANOTHER_STRING_ARRAY_JOINED: string = ANOTHER_STRING_ARRAY.join('|');
export const ANOTHER_STRING_ARRAY_LEN: number = ANOTHER_STRING_ARRAY.length;

export const A_THIRD_STRING_ARRAY: string[] = [ 'charlie', 'delta', 'echo' ];
export const A_THIRD_STRING_ARRAY_JSON: string = JSON.stringify(A_THIRD_STRING_ARRAY);
export const A_THIRD_STRING_ARRAY_JOINED: string = A_THIRD_STRING_ARRAY.join('|');
export const A_THIRD_STRING_ARRAY_LEN: number = A_THIRD_STRING_ARRAY.length;

export type SampleEntityData = {
  aString: string | null;
  anotherString: string | null;
  aFullTextString: string | null;
  anotherFullTextString: string | null;
  aNumber: number | null;
  anotherNumber: number | null;
  aBoolean: boolean | null;
  anotherBoolean: boolean | null;
  aPoint: Point | null;
  anotherPoint: Point | null;
  aDate: Date | null;
  anotherDate: Date | null;
  someStrings: string[] | null;
  someOtherStrings: string[] | null;  
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
  aPoint: A_POINT,
  anotherPoint: ANOTHER_POINT,
  aDate: A_DATE,
  anotherDate: ANOTHER_DATE,
  someStrings: A_STRING_ARRAY,
  someOtherStrings: ANOTHER_STRING_ARRAY
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
  aPoint: ANOTHER_POINT,
  anotherPoint: A_THIRD_POINT,
  aDate: ANOTHER_DATE,
  anotherDate: A_THIRD_DATE,
  someStrings: ANOTHER_STRING_ARRAY,
  someOtherStrings: A_THIRD_STRING_ARRAY
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
  aPoint: A_THIRD_POINT,
  anotherPoint: A_POINT,
  aDate: A_THIRD_DATE,
  anotherDate: A_DATE,
  someStrings: A_THIRD_STRING_ARRAY,
  someOtherStrings: A_STRING_ARRAY
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
  aPoint: A_POINT,
  anotherPoint: null,
  aDate: A_DATE,
  anotherDate: null,
  someStrings: A_STRING_ARRAY,
  someOtherStrings: null
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
  aPoint: null,
  anotherPoint: null,
  aDate: null,
  anotherDate: null,
  someStrings: null,
  someOtherStrings: null
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
  aPoint: null,
  anotherPoint: null,
  aDate: null,
  anotherDate: null,
  someStrings: [ 'alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo', 'charlie delta' ],
  someOtherStrings: null
};

