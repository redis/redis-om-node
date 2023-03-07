import { Schema } from '$lib/schema/schema';

export const simpleSchema = new Schema("SimpleEntity", {
  aString: { type: 'string' },
  someText: { type: 'text' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aPoint: { type: 'point' },
  aDate: { type: 'date' },
  someStrings: { type: 'string[]' }
});

export const simpleHashSchema = new Schema("SimpleHashEntity", {
  aString: { type: 'string' },
  someText: { type: 'text' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aPoint: { type: 'point' },
  aDate: { type: 'date' },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'HASH'
});

export const simpleSortableHashSchema = new Schema("SimpleHashEntity", {
  aString: { type: 'string', sortable: true },
  someText: { type: 'text', sortable: true },
  aNumber: { type: 'number', sortable: true },
  aBoolean: { type: 'boolean', sortable: true },
  aPoint: { type: 'point' },
  aDate: { type: 'date', sortable: true },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'HASH'
});

export const simpleJsonSchema = new Schema("SimpleJsonEntity", {
  aString: { type: 'string' },
  someText: { type: 'text' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  aPoint: { type: 'point' },
  aDate: { type: 'date' },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'JSON'
});

export const simpleSortableJsonSchema = new Schema("SimpleJsonEntity", {
  aString: { type: 'string', sortable: true },
  someText: { type: 'text', sortable: true },
  aNumber: { type: 'number', sortable: true },
  aBoolean: { type: 'boolean', sortable: true },
  aPoint: { type: 'point' },
  aDate: { type: 'date', sortable: true },
  someStrings: { type: 'string[]' }
}, {
  dataStructure: 'JSON'
});

export const aliasedSchema = new Schema("AliasedEntity", {
  aString: { type: 'string', alias: 'anotherString' },
  someText: { type: 'text', alias: 'someOtherText' },
  aNumber: { type: 'number', alias: 'anotherNumber' },
  aBoolean: { type: 'boolean', alias: 'anotherBoolean' },
  aPoint: { type: 'point', alias: 'anotherPoint' },
  aDate: { type: 'date', alias: 'anotherDate' },
  someStrings: { type: 'string[]', alias: 'someOtherStrings' }
});

export const stopWordsOffSchema = new Schema("StopWordsOffEntity", {
  someText: { type: 'text' }
}, {
  useStopWords: 'OFF'
});

export const customStopWordsSchema = new Schema("CustomStopWordsEntity", {
  someText: { type: 'text' }
}, {
  useStopWords: 'CUSTOM',
  stopWords: ['foo', 'bar', 'baz']
});
