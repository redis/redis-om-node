import { Field } from '$lib/schema'

describe("Field", () => {

  let field: Field

  const expectedName = 'foo'
  const expectedType = 'string'

  describe("that is unconfigured", () => {

    beforeEach(() => { field = new Field('foo', { type: 'string' }) })

    it("has the expected name", () => expect(field.name).toBe(expectedName))
    it("has the expected type", () => expect(field.type).toBe(expectedType))
    it("has the default sortable property",  () => expect(field.sortable).toBe(false))
    it("has the default caseSensitive property",  () => expect(field.caseSensitive).toBe(false))
    it("has the default indexed property",  () => expect(field.indexed).toBe(true))
    it("has the default stemming property",  () => expect(field.stemming).toBe(true))
    it("has the default normalized property",  () => expect(field.normalized).toBe(true))
    it("has the default weight property of null",  () => expect(field.weight).toBeNull())
    it("has the default phonetic match property of null",  () => expect(field.matcher).toBeNull())
  })

  describe.each([

    /* just the type */
    ['configured as a boolean', { type: 'boolean' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a number', { type: 'number' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a date', { type: 'date' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a point', { type: 'point' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a text', { type: 'text' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a string', { type: 'string' }, { expectedField: 'foo', expectedPath: '$.foo' }],
    ['configured as a string[]', { type: 'string[]' }, { expectedField: 'foo', expectedPath: '$.foo[*]' }],

    /* aliased string */
    ['configured as a string with an alias', { type: 'string', alias: 'bar' }, { expectedField: 'bar', expectedPath: '$.bar' }],
    ['configured as a string with a field', { type: 'string', field: 'bar' }, { expectedField: 'bar', expectedPath: '$.foo' }],
    ['configured as a string with a field and an alias', { type: 'string', alias: 'bar', field: 'baz' }, { expectedField: 'baz', expectedPath: '$.bar' }],
    ['configured as a string with a path', { type: 'string', path: '$.bar.baz' }, { expectedField: 'foo', expectedPath: '$.bar.baz' }],
    ['configured as a string with a path and an alias', { type: 'string', alias: 'bar', path: '$.baz.qux' }, { expectedField: 'bar', expectedPath: '$.baz.qux' }],

    /* aliased string[] */
    ['configured as a string[] with an alias', { type: 'string[]', alias: 'bar' }, { expectedField: 'bar', expectedPath: '$.bar[*]' }],
    ['configured as a string[] with a field', { type: 'string[]', field: 'bar' }, { expectedField: 'bar', expectedPath: '$.foo[*]' }],
    ['configured as a string[] with a field and an alias', { type: 'string[]', field: 'bar' }, { expectedField: 'bar', expectedPath: '$.foo[*]' }],
    ['configured as a string[] with a path', { type: 'string[]', path: '$.bar.baz' }, { expectedField: 'foo', expectedPath: '$.bar.baz' }],
    ['configured as a string[] with a path and an alias', { type: 'string[]', alias: 'bar', path: '$.baz.qux' }, { expectedField: 'bar', expectedPath: '$.baz.qux' }]

  ])('%s', (_, fieldDef: any, { expectedField, expectedPath } ) => {

    beforeEach(() => { field = new Field('foo', fieldDef) })

    it("has the expected name", () => expect(field.name).toBe(expectedName))
    it("has the expected type", () => expect(field.type).toBe(fieldDef.type))
    it("has the name as the Hash field", () => expect(field.hashField).toBe(expectedField))
    it("has the name as a root JSON path", () => expect(field.jsonPath).toBe(expectedPath))
  })

  describe.each([
    ['sortable', true],
    ['sortable', false],
    ['caseSensitive', true],
    ['caseSensitive', false],
    ['indexed', true],
    ['indexed', false],
    ['stemming', true],
    ['stemming', false],
    ['normalized', true],
    ['normalized', false],
    ['weight', 2.5],
    ['matcher', 'dm:en'],
  ])('that has %s defined', (propertyName, value) => {
    describe(`as ${value}`, () => {

      beforeEach(() => {
        const fieldDef: any = {}
        fieldDef.type = 'string'
        fieldDef[propertyName] = value
        field = new Field('foo', fieldDef)
      })

      it(`has the expected ${propertyName} property`, () => {
        expect((field as any)[propertyName]).toBe(value)
      })
    })
  })
})
