import { Entity, EntityId } from "$lib/index"

import { RedisJsonData } from "$lib/client"

import { ANOTHER_DATE, ANOTHER_DATE_EPOCH, ANOTHER_NUMBER, ANOTHER_POINT, ANOTHER_POINT_STRING, ANOTHER_STRING, A_DATE, A_DATE_EPOCH, A_NUMBER, A_POINT, A_POINT_STRING, A_STRING, A_THIRD_DATE, A_THIRD_DATE_EPOCH, A_THIRD_NUMBER, A_THIRD_POINT, A_THIRD_POINT_STRING, A_THIRD_STRING, SOME_MORE_STRINGS, SOME_MORE_TEXT, SOME_OTHER_STRINGS, SOME_OTHER_TEXT, SOME_STRINGS, SOME_TEXT } from "../../helpers/example-data"

export const AN_ENTITY: Entity = {
  [EntityId]: '1',
  // in schema
  root: {
    aString: A_STRING,
    someText: SOME_TEXT,
    aNumber: A_NUMBER,
    aBoolean: true,
    aPoint: A_POINT,
    aDate: A_DATE,
    someStrings: SOME_STRINGS
  },
  // not in schema
  anotherString: ANOTHER_STRING,
  someOtherText: SOME_OTHER_TEXT,
  anotherNumber: ANOTHER_NUMBER,
  anotherBoolean: false,
  anotherPoint: ANOTHER_POINT,
  anotherDate: ANOTHER_DATE_EPOCH,
  someOtherStrings: SOME_OTHER_STRINGS
}

export const A_JSON: RedisJsonData = {
  // in schema
  root: {
    aString: A_STRING,
    someText: SOME_TEXT,
    aNumber: A_NUMBER,
    aBoolean: true,
    aPoint: A_POINT_STRING,
    aDate: A_DATE_EPOCH,
    someStrings: SOME_STRINGS
  },
  // not in schema
  anotherString: ANOTHER_STRING,
  someOtherText: SOME_OTHER_TEXT,
  anotherNumber: ANOTHER_NUMBER,
  anotherBoolean: false,
  anotherPoint: ANOTHER_POINT,
  anotherDate: ANOTHER_DATE_EPOCH,
  someOtherStrings: SOME_OTHER_STRINGS
}

export const ANOTHER_ENTITY: Entity = {
  [EntityId]: '2',
  // in schema
  root: {
    aString: ANOTHER_STRING,
    someText: SOME_OTHER_TEXT,
    aNumber: ANOTHER_NUMBER,
    aBoolean: true,
    aPoint: ANOTHER_POINT,
    aDate: ANOTHER_DATE,
    someStrings: SOME_OTHER_STRINGS
  },
  // not in schema
  anotherString: A_THIRD_STRING,
  someOtherText: SOME_MORE_TEXT,
  anotherNumber: A_THIRD_NUMBER,
  anotherBoolean: true,
  anotherPoint: A_THIRD_POINT,
  anotherDate: A_THIRD_DATE_EPOCH,
  someOtherStrings: SOME_MORE_STRINGS
}

export const ANOTHER_JSON: RedisJsonData = {
  // in schema
  root: {
    aString: ANOTHER_STRING,
    someText: SOME_OTHER_TEXT,
    aNumber: ANOTHER_NUMBER,
    aBoolean: true,
    aPoint: ANOTHER_POINT_STRING,
    aDate: ANOTHER_DATE_EPOCH,
    someStrings: SOME_OTHER_STRINGS
  },
  // not in schema
  anotherString: A_THIRD_STRING,
  someOtherText: SOME_MORE_TEXT,
  anotherNumber: A_THIRD_NUMBER,
  anotherBoolean: true,
  anotherPoint: A_THIRD_POINT,
  anotherDate: A_THIRD_DATE_EPOCH,
  someOtherStrings: SOME_MORE_STRINGS
}

export const A_THIRD_ENTITY: Entity = {
  [EntityId]: '3',
  // in schema
  root: {
    aString: A_THIRD_STRING,
    someText: SOME_MORE_TEXT,
    aNumber: A_THIRD_NUMBER,
    aBoolean: false,
    aPoint: A_THIRD_POINT,
    aDate: A_THIRD_DATE,
    someStrings: SOME_MORE_STRINGS
  },
  // not in schema
  anotherString: A_STRING,
  someOtherText: SOME_TEXT,
  anotherNumber: A_NUMBER,
  anotherBoolean: false,
  anotherPoint: A_POINT,
  anotherDate: A_DATE_EPOCH,
  someOtherStrings: SOME_STRINGS
}

export const A_THIRD_JSON: RedisJsonData = {
  // in schema
  root: {
    aString: A_THIRD_STRING,
    someText: SOME_MORE_TEXT,
    aNumber: A_THIRD_NUMBER,
    aBoolean: false,
    aPoint: A_THIRD_POINT_STRING,
    aDate: A_THIRD_DATE_EPOCH,
    someStrings: SOME_MORE_STRINGS
  },
  // not in schema
  anotherString: A_STRING,
  someOtherText: SOME_TEXT,
  anotherNumber: A_NUMBER,
  anotherBoolean: false,
  anotherPoint: A_POINT,
  anotherDate: A_DATE_EPOCH,
  someOtherStrings: SOME_STRINGS
}

export const AN_EMPTY_ENTITY: Entity = {
  [EntityId]: 'empty'
}

export const AN_EMPTY_JSON: RedisJsonData = {}

export const AN_ESCAPED_ENTITY: Entity = {
  [EntityId]: 'escaped',
  root: {
    aString: "foo ,.<>{}[]\"':;!@#$%^()-+=~& bar",
    someText: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
    someStrings: ['alfa ,.<>{}[]"\':;!@#$%^&()-+=~ bravo', 'charlie delta']
  }
}

export const AN_ESCAPED_JSON: RedisJsonData = {
  root: {
    aString: "foo ,.<>{}[]\"':;!@#$%^()-+=~& bar",
    someText: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
    someStrings: ['alfa ,.<>{}[]"\':;!@#$%^&()-+=~ bravo', 'charlie delta']
  }
}
