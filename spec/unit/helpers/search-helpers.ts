import { client } from '../helpers/mock-client'

import { EntityId } from '$lib/entity'

import {
  A_NUMBER, ANOTHER_NUMBER, A_THIRD_NUMBER,
  A_NUMBER_STRING, ANOTHER_NUMBER_STRING, A_THIRD_NUMBER_STRING,
  A_POINT, ANOTHER_POINT, A_THIRD_POINT,
  A_POINT_STRING, ANOTHER_POINT_STRING, A_THIRD_POINT_STRING,
  A_STRING, ANOTHER_STRING, A_THIRD_STRING,
  SOME_STRINGS, SOME_OTHER_STRINGS, SOME_MORE_STRINGS,
  SOME_STRINGS_JOINED, SOME_OTHER_STRINGS_JOINED, SOME_MORE_STRINGS_JOINED,
  SOME_STRINGS_JSON, SOME_OTHER_STRINGS_JSON, SOME_MORE_STRINGS_JSON,
  SOME_TEXT, SOME_OTHER_TEXT, SOME_MORE_TEXT } from '../../helpers/example-data'

export const SIMPLE_ENTITY_1 = {
  [EntityId]: '1',
  aString: A_STRING,
  someText: SOME_TEXT,
  aNumber: A_NUMBER,
  aBoolean: false,
  aPoint: A_POINT,
  someStrings: SOME_STRINGS
}

export const SIMPLE_ENTITY_2 = {
  [EntityId]: '2',
  aString: ANOTHER_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: true,
  aPoint: ANOTHER_POINT,
  someStrings: SOME_OTHER_STRINGS
}

export const SIMPLE_ENTITY_3 = {
  [EntityId]: '3',
  aString: A_THIRD_STRING,
  someText: SOME_MORE_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT,
  someStrings: SOME_MORE_STRINGS
}

export const SIMPLE_ENTITY_4 = {
  [EntityId]: '4',
  aString: A_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: true,
  aPoint: A_POINT,
  someStrings: SOME_OTHER_STRINGS
}

export const SIMPLE_ENTITY_5 = {
  [EntityId]: '5',
  aString: A_THIRD_STRING,
  someText: SOME_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT,
  someStrings: SOME_STRINGS
}

export function mockClientSearchToReturnNothing() {
  vi.mocked(client.search).mockResolvedValue({
    total: 0,
    documents: []
  })
}

export function mockClientSearchToReturnCountOf(count: number) {
  vi.mocked(client.search).mockResolvedValue({
    total: count,
    documents: []
  })
}

export function mockClientSearchToReturnSingleKey() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 1,
      documents: [
        { id: 'SimpleHashEntity:1', value: {} }
      ]
    })
    .mockResolvedValue({
      total: 1,
      documents: []
    })
}

export function mockClientSearchToReturnSingleHash() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 1,
      documents: [
        { id: 'SimpleHashEntity:1', value: HASH_DATA_1 }]
    })
    .mockResolvedValue({
      total: 1,
      documents: []
    })
}

export function mockClientSearchToReturnSingleJsonString() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 1,
      documents: [
        { id: 'SimpleJsonEntity:1', value: JSON_DATA_1 }]
    })
    .mockResolvedValue({
      total: 1,
      documents: []
    })
}

export function mockClientSearchToReturnMultipleKeys() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 3,
      documents: [
        { id: 'SimpleHashEntity:1', value: {} },
        { id: 'SimpleHashEntity:2', value: {} },
        { id: 'SimpleHashEntity:3', value: {} }]
    })
    .mockResolvedValue({
      total: 3,
      documents: []
    })
}

export function mockClientSearchToReturnMultipleHashes() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 3,
      documents: [
        { id: 'SimpleHashEntity:1', value: HASH_DATA_1 },
        { id: 'SimpleHashEntity:2', value: HASH_DATA_2 },
        { id: 'SimpleHashEntity:3', value: HASH_DATA_3 }]
    })
    .mockResolvedValue({
      total: 3,
      documents: []
    })
}

export function mockClientSearchToReturnMultipleJsonStrings() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 3,
      documents: [
        { id: 'SimpleJsonEntity:1', value: JSON_DATA_1 },
        { id: 'SimpleJsonEntity:2', value: JSON_DATA_2 },
        { id: 'SimpleJsonEntity:3', value: JSON_DATA_3 }]
    })
    .mockResolvedValue({
      total: 3,
      documents: []
    })
}

export function mockClientSearchToReturnPaginatedKeys() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:1', value: {} },
        { id: 'SimpleHashEntity:2', value: {} }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:3', value: {} },
        { id: 'SimpleHashEntity:4', value: {} }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:5', value: {} }]
    })
    .mockResolvedValue({
      total: 5,
      documents: []
    })
}

export function mockClientSearchToReturnPaginatedHashes() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:1', value: HASH_DATA_1 },
        { id: 'SimpleHashEntity:2', value: HASH_DATA_2 }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:3', value: HASH_DATA_3 },
        { id: 'SimpleHashEntity:4', value: HASH_DATA_4 }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleHashEntity:5', value: HASH_DATA_5 }]
    })
    .mockResolvedValue({
      total: 5,
      documents: []
    })
}

export function mockClientSearchToReturnPaginatedJsonStrings() {
  vi.mocked(client.search)
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleJsonEntity:1', value: JSON_DATA_1 },
        { id: 'SimpleJsonEntity:2', value: JSON_DATA_2 }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleJsonEntity:3', value: JSON_DATA_3 },
        { id: 'SimpleJsonEntity:4', value: JSON_DATA_4 }]
    })
    .mockResolvedValueOnce({
      total: 5,
      documents: [
        { id: 'SimpleJsonEntity:5', value: JSON_DATA_5 }]
    })
    .mockResolvedValue({
      total: 5,
      documents: []
    })
}

const HASH_DATA_1 = {
  aString: A_STRING,
  someText: SOME_TEXT,
  aNumber: A_NUMBER_STRING,
  aBoolean: '0',
  aPoint: A_POINT_STRING,
  someStrings: SOME_STRINGS_JOINED }

const HASH_DATA_2 = {
  aString: ANOTHER_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: ANOTHER_NUMBER_STRING,
  aBoolean: '1',
  aPoint: ANOTHER_POINT_STRING,
  someStrings: SOME_OTHER_STRINGS_JOINED }

const HASH_DATA_3 = {
  aString: A_THIRD_STRING,
  someText: SOME_MORE_TEXT,
  aNumber: A_THIRD_NUMBER_STRING,
  aBoolean: '0',
  aPoint: A_THIRD_POINT_STRING,
  someStrings: SOME_MORE_STRINGS_JOINED }

const HASH_DATA_4 = {
  aString: A_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: A_THIRD_NUMBER_STRING,
  aBoolean: '1',
  aPoint: A_POINT_STRING,
  someStrings: SOME_OTHER_STRINGS_JOINED }

const HASH_DATA_5 = {
  aString: A_THIRD_STRING,
  someText: SOME_TEXT,
  aNumber: ANOTHER_NUMBER_STRING,
  aBoolean: '0',
  aPoint: A_THIRD_POINT_STRING,
  someStrings: SOME_STRINGS_JOINED }

const JSON_DATA_1 = {
  aString: A_STRING,
  someText: SOME_TEXT,
  aNumber: A_NUMBER,
  aBoolean: false,
  aPoint: A_POINT_STRING,
  someStrings: SOME_STRINGS
}

const JSON_DATA_2 = {
  aString: ANOTHER_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: true,
  aPoint: ANOTHER_POINT_STRING,
  someStrings: SOME_OTHER_STRINGS
}

const JSON_DATA_3 = {
  aString: A_THIRD_STRING,
  someText: SOME_MORE_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT_STRING,
  someStrings: SOME_MORE_STRINGS
}

const JSON_DATA_4 = {
  aString: A_STRING,
  someText: SOME_OTHER_TEXT,
  aNumber: A_THIRD_NUMBER,
  aBoolean: true,
  aPoint: A_POINT_STRING,
  someStrings: SOME_OTHER_STRINGS
}

const JSON_DATA_5 = {
  aString: A_THIRD_STRING,
  someText: SOME_TEXT,
  aNumber: ANOTHER_NUMBER,
  aBoolean: false,
  aPoint: A_THIRD_POINT_STRING,
  someStrings: SOME_STRINGS
}
