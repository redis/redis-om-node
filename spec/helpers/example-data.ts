import Point from "../../lib/entity/point";

export const A_STRING = 'foo';
export const ANOTHER_STRING = 'bar';
export const A_THIRD_STRING = 'baz';

export const SOME_TEXT = "The quick brown fox jumped over the lazy dog.";
export const SOME_OTHER_TEXT = "The five boxing wizards jump quickly.";
export const SOME_MORE_TEXT = "How vexingly quick daft zebras jump!";

export const A_NUMBER = 42;
export const A_NUMBER_STRING = A_NUMBER.toString();

export const ANOTHER_NUMBER = 23;
export const ANOTHER_NUMBER_STRING = ANOTHER_NUMBER.toString();

export const A_THIRD_NUMBER = 13;
export const A_THIRD_NUMBER_STRING = A_THIRD_NUMBER.toString();

export const A_DATE: Date = new Date('1997-07-04T16:56:55.456Z');
export const A_DATE_ISO: string = A_DATE.toISOString();
export const A_DATE_EPOCH: number = A_DATE.getTime() / 1000;
export const A_DATE_EPOCH_STRING: string = A_DATE_EPOCH.toString();

export const ANOTHER_DATE: Date = new Date('1969-07-20T20:17:40.000Z');
export const ANOTHER_DATE_ISO: string = ANOTHER_DATE.toISOString();
export const ANOTHER_DATE_EPOCH: number = ANOTHER_DATE.getTime() / 1000;
export const ANOTHER_DATE_EPOCH_STRING: string = ANOTHER_DATE_EPOCH.toString();

export const A_THIRD_DATE: Date = new Date('2015-07-14T11:49:57.000Z');
export const A_THIRD_DATE_ISO: string = A_THIRD_DATE.toISOString();
export const A_THIRD_DATE_EPOCH: number = A_THIRD_DATE.getTime() / 1000;
export const A_THIRD_DATE_EPOCH_STRING: string = A_THIRD_DATE_EPOCH.toString();

export const A_POINT: Point = { longitude: 12.34, latitude: 56.78 };
export const A_POINT_JSON: string = JSON.stringify(A_POINT);
export const A_POINT_STRING: string = `${A_POINT.longitude},${A_POINT.latitude}`;

export const ANOTHER_POINT: Point = { longitude: -23.45, latitude: 67.89 };
export const ANOTHER_POINT_JSON: string = JSON.stringify(ANOTHER_POINT);
export const ANOTHER_POINT_STRING: string = `${ANOTHER_POINT.longitude},${ANOTHER_POINT.latitude}`;

export const A_THIRD_POINT: Point = { longitude: -34.56, latitude: 78.90 };
export const A_THIRD_POINT_JSON: string = JSON.stringify(A_THIRD_POINT);
export const A_THIRD_POINT_STRING: string = `${A_THIRD_POINT.longitude},${A_THIRD_POINT.latitude}`;

export const SOME_STRINGS: Array<string> = ['alfa', 'bravo', 'charlie'];
export const SOME_STRINGS_JSON: string = JSON.stringify(SOME_STRINGS);
export const SOME_STRINGS_JOINED: string = SOME_STRINGS.join('|');

export const SOME_OTHER_STRINGS: Array<string> = ['bravo', 'charlie', 'delta'];
export const SOME_OTHER_STRINGS_JSON: string = JSON.stringify(SOME_OTHER_STRINGS);
export const SOME_OTHER_STRINGS_JOINED: string = SOME_OTHER_STRINGS.join('|');

export const SOME_MORE_STRINGS: Array<string> = ['charlie', 'delta', 'echo'];
export const SOME_MORE_STRINGS_JSON: string = JSON.stringify(SOME_MORE_STRINGS);
export const SOME_MORE_STRINGS_JOINED: string = SOME_MORE_STRINGS.join('|');

export type SampleEntityData = {
  aString: string | null;
  anotherString: string | null;
  someText: string | null;
  someOtherText: string | null;
  aNumber: number | null;
  anotherNumber: number | null;
  aBoolean: boolean | null;
  anotherBoolean: boolean | null;
  aPoint: Point | null;
  anotherPoint: Point | null;
  aDate: Date | null;
  anotherDate: Date | null;
  someStrings: Array<string> | null;
  someOtherStrings: Array<string> | null;
};

export const AN_ENTITY: SampleEntityData = {
  aString: A_STRING,
  anotherString: ANOTHER_STRING,
  someText: SOME_TEXT,
  someOtherText: SOME_OTHER_TEXT,
  aNumber: A_NUMBER,
  anotherNumber: ANOTHER_NUMBER,
  aBoolean: true,
  anotherBoolean: false,
  aPoint: A_POINT,
  anotherPoint: ANOTHER_POINT,
  aDate: A_DATE,
  anotherDate: ANOTHER_DATE,
  someStrings: SOME_STRINGS,
  someOtherStrings: SOME_OTHER_STRINGS
};

export const ANOTHER_ENTITY: SampleEntityData = {
  aString: ANOTHER_STRING,
  anotherString: A_THIRD_STRING,
  someText: SOME_OTHER_TEXT,
  someOtherText: SOME_MORE_TEXT,
  aNumber: ANOTHER_NUMBER,
  anotherNumber: A_THIRD_NUMBER,
  aBoolean: true,
  anotherBoolean: true,
  aPoint: ANOTHER_POINT,
  anotherPoint: A_THIRD_POINT,
  aDate: ANOTHER_DATE,
  anotherDate: A_THIRD_DATE,
  someStrings: SOME_OTHER_STRINGS,
  someOtherStrings: SOME_MORE_STRINGS
};

export const A_THIRD_ENTITY: SampleEntityData = {
  aString: A_THIRD_STRING,
  anotherString: A_STRING,
  someText: SOME_MORE_TEXT,
  someOtherText: SOME_TEXT,
  aNumber: A_THIRD_NUMBER,
  anotherNumber: A_NUMBER,
  aBoolean: false,
  anotherBoolean: false,
  aPoint: A_THIRD_POINT,
  anotherPoint: A_POINT,
  aDate: A_THIRD_DATE,
  anotherDate: A_DATE,
  someStrings: SOME_MORE_STRINGS,
  someOtherStrings: SOME_STRINGS
};

export const A_PARTIAL_ENTITY: SampleEntityData = {
  aString: A_STRING,
  anotherString: null,
  someText: SOME_TEXT,
  someOtherText: null,
  aNumber: A_NUMBER,
  anotherNumber: null,
  aBoolean: true,
  anotherBoolean: null,
  aPoint: A_POINT,
  anotherPoint: null,
  aDate: A_DATE,
  anotherDate: null,
  someStrings: SOME_STRINGS,
  someOtherStrings: null
};

export const AN_EMPTY_ENTITY: SampleEntityData = {
  aString: null,
  anotherString: null,
  someText: null,
  someOtherText: null,
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
  someText: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
  someOtherText: null,
  aNumber: null,
  anotherNumber: null,
  aBoolean: null,
  anotherBoolean: null,
  aPoint: null,
  anotherPoint: null,
  aDate: null,
  anotherDate: null,
  someStrings: ['alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo', 'charlie delta'],
  someOtherStrings: null
};

