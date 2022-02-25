import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { 
  A_NUMBER, ANOTHER_NUMBER, A_THIRD_NUMBER,
  A_NUMBER_STRING, ANOTHER_NUMBER_STRING, A_THIRD_NUMBER_STRING,
  A_POINT, ANOTHER_POINT, A_THIRD_POINT,
  A_POINT_STRING, ANOTHER_POINT_STRING, A_THIRD_POINT_STRING,
  A_STRING, ANOTHER_STRING, A_THIRD_STRING,
  SOME_STRINGS, SOME_OTHER_STRINGS, SOME_MORE_STRINGS,
  SOME_STRINGS_JOINED, SOME_OTHER_STRINGS_JOINED, SOME_MORE_STRINGS_JOINED,
  SOME_STRINGS_JSON, SOME_OTHER_STRINGS_JSON, SOME_MORE_STRINGS_JSON,
  SOME_TEXT, SOME_OTHER_TEXT, SOME_MORE_TEXT } from '../../helpers/example-data';

export const SIMPLE_ENTITY_1 = {
  entityId: '1',
  aString: A_STRING,
  someText: SOME_TEXT,
  aNumber: A_NUMBER,
  aBoolean: false,
  aPoint: A_POINT,
  someStrings: SOME_STRINGS
}

export const SIMPLE_ENTITY_2 = {
  entityId: '2',
  aString: ANOTHER_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: true,
  aPoint: ANOTHER_POINT,
  someStrings: SOME_OTHER_STRINGS
}

export const SIMPLE_ENTITY_3 = {
  entityId: '3',
  aString: A_THIRD_STRING,
  someText: SOME_MORE_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT,
  someStrings: SOME_MORE_STRINGS
}

export const SIMPLE_ENTITY_4 = {
  entityId: '4',
  aString: A_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: true,
  aPoint: A_POINT,
  someStrings: SOME_OTHER_STRINGS
}

export const SIMPLE_ENTITY_5 = {
  entityId: '5',
  aString: A_THIRD_STRING,
  someText: SOME_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT,
  someStrings: SOME_STRINGS
}

export function mockClientSearchToReturnNothing() {
  mocked(Client.prototype.search).mockResolvedValue(['0']);
}

export function mockClientSearchToReturnCountOf(count: number) {
  mocked(Client.prototype.search).mockResolvedValue([count.toString()]);
}

export function mockClientSearchToReturnSingleHash() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([ '1', 'SimpleHashEntity:1', HASH_DATA_1 ])
    .mockResolvedValue(['1']);
}

export function mockClientSearchToReturnSingleJsonString() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([ '1', 'SimpleJsonEntity:1', [ '$', JSON_DATA_1 ]])
    .mockResolvedValue(['1']);
}

export function mockClientSearchToReturnMultipleHashes() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '3',
      'SimpleHashEntity:1', HASH_DATA_1,
      'SimpleHashEntity:2', HASH_DATA_2,
      'SimpleHashEntity:3', HASH_DATA_3
    ])
    .mockResolvedValue(['3']);
}

export function mockClientSearchToReturnMultipleJsonStrings() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '3',
      'SimpleJsonEntity:1', [ '$', JSON_DATA_1 ],
      'SimpleJsonEntity:2', [ '$', JSON_DATA_2 ],
      'SimpleJsonEntity:3', [ '$', JSON_DATA_3 ]
    ])
    .mockResolvedValue(['3']);
}

export function mockClientSearchToReturnPaginatedHashes() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:1', HASH_DATA_1,
      'SimpleHashEntity:2', HASH_DATA_2
    ])
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:3', HASH_DATA_3,
      'SimpleHashEntity:4', HASH_DATA_4
    ])
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:5', HASH_DATA_5
    ])
    .mockResolvedValue(['5']);
}

export function mockClientSearchToReturnPaginatedJsonStrings() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:1', [ '$', JSON_DATA_1 ],
      'SimpleJsonEntity:2', [ '$', JSON_DATA_2 ]
    ])
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:3', [ '$', JSON_DATA_3 ],
      'SimpleJsonEntity:4', [ '$', JSON_DATA_4 ]
    ])
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:5', [ '$', JSON_DATA_5 ]
    ])
    .mockResolvedValue(['5']);
}

const HASH_DATA_1 = [
  'aString', A_STRING,
  'someText', SOME_TEXT,
  'aNumber', A_NUMBER_STRING,
  'aBoolean', '0',
  'aPoint', A_POINT_STRING,
  'someStrings', SOME_STRINGS_JOINED ];

const HASH_DATA_2 = [
  'aString', ANOTHER_STRING,
  'someText', SOME_OTHER_TEXT,
  'aNumber', ANOTHER_NUMBER_STRING,
  'aBoolean', '1',
  'aPoint', ANOTHER_POINT_STRING,
  'someStrings', SOME_OTHER_STRINGS_JOINED ];

const HASH_DATA_3 = [
  'aString', A_THIRD_STRING,
  'someText', SOME_MORE_TEXT,
  'aNumber', A_THIRD_NUMBER_STRING,
  'aBoolean', '0',
  'aPoint', A_THIRD_POINT_STRING,
  'someStrings', SOME_MORE_STRINGS_JOINED ];

const HASH_DATA_4 = [
  'aString', A_STRING,
  'someText', SOME_OTHER_TEXT,
  'aNumber', A_THIRD_NUMBER_STRING,
  'aBoolean', '1',
  'aPoint', A_POINT_STRING,
  'someStrings', SOME_OTHER_STRINGS_JOINED ];

const HASH_DATA_5 = [
  'aString', A_THIRD_STRING,
  'someText', SOME_TEXT,
  'aNumber', ANOTHER_NUMBER_STRING,
  'aBoolean', '0',
  'aPoint', A_THIRD_POINT_STRING,
  'someStrings', SOME_STRINGS_JOINED ];
    
const JSON_DATA_1 = `{
  "aString": "${A_STRING}",
  "someText": "${SOME_TEXT}",
  "aNumber": ${A_NUMBER},
  "aBoolean": false,
  "aPoint": "${A_POINT_STRING}",
  "someStrings": ${SOME_STRINGS_JSON}
}`;

const JSON_DATA_2 = `{
  "aString": "${ANOTHER_STRING}",
  "someText": "${SOME_OTHER_TEXT}",
  "aNumber": ${ANOTHER_NUMBER},
  "aBoolean": true,
  "aPoint": "${ANOTHER_POINT_STRING}",
  "someStrings": ${SOME_OTHER_STRINGS_JSON}
}`;

const JSON_DATA_3 = `{
  "aString": "${A_THIRD_STRING}",
  "someText": "${SOME_MORE_TEXT}",
  "aNumber": ${A_THIRD_NUMBER},
  "aBoolean": false,
  "aPoint": "${A_THIRD_POINT_STRING}",
  "someStrings": ${SOME_MORE_STRINGS_JSON}
}`;

const JSON_DATA_4 = `{
  "aString": "${A_STRING}",
  "someText": "${SOME_OTHER_TEXT}",
  "aNumber": ${A_THIRD_NUMBER},
  "aBoolean": true,
  "aPoint": "${A_POINT_STRING}",
  "someStrings": ${SOME_OTHER_STRINGS_JSON}
}`;

const JSON_DATA_5 = `{
  "aString": "${A_THIRD_STRING}",
  "someText": "${SOME_TEXT}",
  "aNumber": ${ANOTHER_NUMBER},
  "aBoolean": false,
  "aPoint": "${A_THIRD_POINT_STRING}",
  "someStrings": ${SOME_STRINGS_JSON}
}`;
