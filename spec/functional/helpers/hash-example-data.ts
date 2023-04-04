import { Entity, EntityId } from "$lib/index"

import { RedisHashData } from "$lib/client"

import { ANOTHER_DATE, ANOTHER_DATE_EPOCH_STRING, ANOTHER_NUMBER, ANOTHER_NUMBER_STRING, ANOTHER_POINT, ANOTHER_POINT_STRING, ANOTHER_STRING, A_DATE, A_DATE_EPOCH_STRING, A_NUMBER, A_NUMBER_STRING, A_POINT, A_POINT_STRING, A_STRING, A_THIRD_DATE, A_THIRD_DATE_EPOCH_STRING, A_THIRD_NUMBER, A_THIRD_NUMBER_STRING, A_THIRD_POINT, A_THIRD_POINT_STRING, A_THIRD_STRING, SOME_MORE_STRINGS, SOME_MORE_STRINGS_JOINED, SOME_MORE_TEXT, SOME_OTHER_STRINGS, SOME_OTHER_STRINGS_JOINED, SOME_OTHER_TEXT, SOME_STRINGS, SOME_STRINGS_JOINED, SOME_TEXT } from "../../helpers/example-data"

export const AN_ENTITY: Entity = {
  [EntityId]: '1',
  // in schema
  aString: A_STRING,
  someText: SOME_TEXT,
  aNumber: A_NUMBER,
  aBoolean: true,
  aPoint: A_POINT,
  aDate: A_DATE,
  someStrings: SOME_STRINGS,
  // not in schema
  anotherString: ANOTHER_STRING,
  someOtherText: SOME_OTHER_TEXT,
  anotherNumber: ANOTHER_NUMBER_STRING,
  anotherBoolean: '0',
  anotherPoint: ANOTHER_POINT_STRING,
  anotherDate: ANOTHER_DATE_EPOCH_STRING,
  someOtherStrings: SOME_OTHER_STRINGS_JOINED
}

export const A_HASH: RedisHashData = {
  // in schema
  root_aString: A_STRING,
  root_someText: SOME_TEXT,
  root_aNumber: A_NUMBER_STRING,
  root_aBoolean: '1',
  root_aPoint: A_POINT_STRING,
  root_aDate: A_DATE_EPOCH_STRING,
  root_someStrings: SOME_STRINGS_JOINED,
  // not in schema
  anotherString: ANOTHER_STRING,
  someOtherText: SOME_OTHER_TEXT,
  anotherNumber: ANOTHER_NUMBER_STRING,
  anotherBoolean: '0',
  anotherPoint: ANOTHER_POINT_STRING,
  anotherDate: ANOTHER_DATE_EPOCH_STRING,
  someOtherStrings: SOME_OTHER_STRINGS_JOINED
}

export const ANOTHER_ENTITY: Entity = {
  [EntityId]: '2',
  // in schema
  aString: ANOTHER_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: true,
  aPoint: ANOTHER_POINT,
  aDate: ANOTHER_DATE,
  someStrings: SOME_OTHER_STRINGS,
  // not in schema
  anotherString: A_THIRD_STRING,
  someOtherText: SOME_MORE_TEXT,
  anotherNumber: A_THIRD_NUMBER_STRING,
  anotherBoolean: '1',
  anotherPoint: A_THIRD_POINT_STRING,
  anotherDate: A_THIRD_DATE_EPOCH_STRING,
  someOtherStrings: SOME_MORE_STRINGS_JOINED
}

export const ANOTHER_HASH: RedisHashData = {
  // in schema
  root_aString: ANOTHER_STRING,
  root_someText: SOME_OTHER_TEXT,
  root_aNumber: ANOTHER_NUMBER_STRING,
  root_aBoolean: '1',
  root_aPoint: ANOTHER_POINT_STRING,
  root_aDate: ANOTHER_DATE_EPOCH_STRING,
  root_someStrings: SOME_OTHER_STRINGS_JOINED,
  // not in schema
  anotherString: A_THIRD_STRING,
  someOtherText: SOME_MORE_TEXT,
  anotherNumber: A_THIRD_NUMBER_STRING,
  anotherBoolean: '1',
  anotherPoint: A_THIRD_POINT_STRING,
  anotherDate: A_THIRD_DATE_EPOCH_STRING,
  someOtherStrings: SOME_MORE_STRINGS_JOINED
}

export const A_THIRD_ENTITY: Entity = {
  [EntityId]: '3',
  // in schema
  aString: A_THIRD_STRING,
  someText: SOME_MORE_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT,
  aDate: A_THIRD_DATE,
  someStrings: SOME_MORE_STRINGS,
  // not in schema
  anotherString: A_STRING,
  someOtherText: SOME_TEXT,
  anotherNumber: A_NUMBER_STRING,
  anotherBoolean: '0',
  anotherPoint: A_POINT_STRING,
  anotherDate: A_DATE_EPOCH_STRING,
  someOtherStrings: SOME_STRINGS_JOINED
}

export const A_THIRD_HASH: RedisHashData = {
  // in schema
  root_aString: A_THIRD_STRING,
  root_someText: SOME_MORE_TEXT,
  root_aNumber: A_THIRD_NUMBER_STRING,
  root_aBoolean: '0',
  root_aPoint: A_THIRD_POINT_STRING,
  root_aDate: A_THIRD_DATE_EPOCH_STRING,
  root_someStrings: SOME_MORE_STRINGS_JOINED,
  // not in schema
  anotherString: A_STRING,
  someOtherText: SOME_TEXT,
  anotherNumber: A_NUMBER_STRING,
  anotherBoolean: '0',
  anotherPoint: A_POINT_STRING,
  anotherDate: A_DATE_EPOCH_STRING,
  someOtherStrings: SOME_STRINGS_JOINED
}

export const AN_EMPTY_ENTITY: Entity = {
  [EntityId]: 'empty'
}

export const AN_EMPTY_HASH: RedisHashData = {}

export const AN_ESCAPED_ENTITY: Entity = {
  [EntityId]: 'escaped',
  aString: "foo ,.<>{}[]\"':;!@#$%^()-+=~& bar",
  someText: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
  someStrings: ['alfa ,.<>{}[]"\':;!@#$%^&()-+=~ bravo', 'charlie delta']
}

export const AN_ESCAPED_HASH: RedisHashData = {
  root_aString: "foo ,.<>{}[]\"':;!@#$%^()-+=~& bar",
  root_someText: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
  root_someStrings: ['alfa ,.<>{}[]"\':;!@#$%^&()-+=~ bravo', 'charlie delta'].join('|')
}
