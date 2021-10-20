import { mocked } from 'ts-jest/utils';

import Client from "../../../src/client";

export const SIMPLE_ENTITY_1 = {
  entityId: '1',
  aString: 'foo',
  aNumber: 42,
  aBoolean: false,
  anArray: [ 'foo', 'bar', 'baz' ]
}

export const SIMPLE_ENTITY_2 = {
  entityId: '2',
  aString: 'bar',
  aNumber: 23,
  aBoolean: true,
  anArray: [ 'bar', 'baz', 'qux' ]
}

export const SIMPLE_ENTITY_3 = {
  entityId: '3',
  aString: 'baz',
  aNumber: 13,
  aBoolean: false,
  anArray: [ 'baz', 'qux', 'quux' ]
}

export const SIMPLE_ENTITY_4 = {
  entityId: '4',
  aString: 'qux',
  aNumber: 7,
  aBoolean: true,
  anArray: [ 'qux', 'quux', 'quuux' ]
}

export const SIMPLE_ENTITY_5 = {
  entityId: '5',
  aString: 'quux',
  aNumber: 37,
  aBoolean: false,
  anArray: [ 'quux', 'quuux', 'quuuux' ]
}

export function expectEntityMatches(actual: any, expected: any) {
  expect(actual.entityId).toBe(expected.entityId);
  expect(actual.aString).toBe(expected.aString);
  expect(actual.aNumber).toBe(expected.aNumber);
  expect(actual.aBoolean).toBe(expected.aBoolean);
  expect(actual.anArray).toEqual(expected.anArray);
}

export function mockClientSearchToReturnNothing() {
  mocked(Client.prototype.search).mockResolvedValue(['0']);
}

export function mockClientSearchToReturnCountOf(count: number) {
  mocked(Client.prototype.search).mockResolvedValue([count.toString()]);
}

export function mockClientSearchToReturnSingleHash() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '1',
      'SimpleHashEntity:1', [
        'aString', 'foo',
        'aNumber', '42',
        'aBoolean', '0',
        'anArray', 'foo|bar|baz' ]])
    .mockResolvedValue(['1']);
}

export function mockClientSearchToReturnSingleJsonString() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '1',
      'SimpleJsonEntity:1', [ '$', `{
        "aString": "foo",
        "aNumber": 42,
        "aBoolean": false,
        "anArray": [ "foo", "bar", "baz" ] }`]])
    .mockResolvedValue(['1']);
}

export function mockClientSearchToReturnMultipleHashes() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '3',
      'SimpleHashEntity:1', [
        'aString', 'foo',
        'aNumber', '42',
        'aBoolean', '0',
        'anArray', 'foo|bar|baz' ],
      'SimpleHashEntity:2', [
        'aString', 'bar',
        'aNumber', '23',
        'aBoolean', '1',
        'anArray', 'bar|baz|qux' ],
      'SimpleHashEntity:3', [
        'aString', 'baz',
        'aNumber', '13',
        'aBoolean', '0',
        'anArray', 'baz|qux|quux' ]])
    .mockResolvedValue(['3']);
}

export function mockClientSearchToReturnMultipleJsonStrings() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '3',
      'SimpleJsonEntity:1', [ '$', `{
        "aString": "foo",
        "aNumber": 42,
        "aBoolean": false,
        "anArray": [ "foo", "bar", "baz" ] }`],
      'SimpleJsonEntity:2', [ '$', `{
        "aString": "bar",
        "aNumber": 23,
        "aBoolean": true,
        "anArray": [ "bar", "baz", "qux" ] }`],
      'SimpleJsonEntity:3', [ '$', `{
        "aString": "baz",
        "aNumber": 13,
        "aBoolean": false,
        "anArray": [ "baz", "qux", "quux" ] }`]])
    .mockResolvedValue(['3']);
}

export function mockClientSearchToReturnPaginatedHashes() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:1', [
        'aString', 'foo',
        'aNumber', '42',
        'aBoolean', '0',
        'anArray', 'foo|bar|baz' ],
      'SimpleHashEntity:2', [
        'aString', 'bar',
        'aNumber', '23',
        'aBoolean', '1',
        'anArray', 'bar|baz|qux' ]])
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:3', [
        'aString', 'baz',
        'aNumber', '13',
        'aBoolean', '0',
        'anArray', 'baz|qux|quux' ],
      'SimpleHashEntity:4', [
        'aString', 'qux',
        'aNumber', '7',
        'aBoolean', '1',
        'anArray', 'qux|quux|quuux' ]])
    .mockResolvedValueOnce([
      '5',
      'SimpleHashEntity:5', [
        'aString', 'quux',
        'aNumber', '37',
        'aBoolean', '0',
        'anArray', 'quux|quuux|quuuux' ]])
    .mockResolvedValue(['5']);
}

export function mockClientSearchToReturnPaginatedJsonStrings() {
  mocked(Client.prototype.search)
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:1', [ '$', `{
        "aString": "foo",
        "aNumber": 42,
        "aBoolean": false,
        "anArray": [ "foo", "bar", "baz" ] }`],
      'SimpleJsonEntity:2', [ '$', `{
        "aString": "bar",
        "aNumber": 23,
        "aBoolean": true,
        "anArray": [ "bar", "baz", "qux" ] }`]])
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:3', [ '$', `{
        "aString": "baz",
        "aNumber": 13,
        "aBoolean": false,
        "anArray": [ "baz", "qux", "quux" ] }`],
      'SimpleJsonEntity:4', [ '$', `{
        "aString": "qux",
        "aNumber": 7,
        "aBoolean": true,
        "anArray": [ "qux", "quux", "quuux" ] }`]])
    .mockResolvedValueOnce([
      '5',
      'SimpleJsonEntity:5', [ '$', `{
        "aString": "quux",
        "aNumber": 37,
        "aBoolean": false,
        "anArray": [ "quux", "quuux", "quuuux" ] }`]])
    .mockResolvedValue(['5']);
}
