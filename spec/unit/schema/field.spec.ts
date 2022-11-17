import { Field } from '$lib/schema/field'

describe("Field", () => {

  let field: Field

  describe("that is simply configured", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the name as the Hash field", () => expect(field.hashField).toBe('foo'))
    it("has the name as a root JSON path", () => expect(field.jsonPath).toBe('$.foo'))
  })

  describe("that has an alias defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', alias: 'bar' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the alias as the Hash field", () => expect(field.hashField).toBe('bar'))
    it("has the alais as a root JSON path", () => expect(field.jsonPath).toBe('$.bar'))
  })

  describe("that has a field defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', field: 'bar' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the field as the Hash field", () => expect(field.hashField).toBe('bar'))
    it("has the name as a root JSON path", () => expect(field.jsonPath).toBe('$.foo'))
  })

  describe("that has a field and an alias defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', alias: 'bar', field: 'baz' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the field as the Hash field", () => expect(field.hashField).toBe('baz'))
    it("has the alais as a root JSON path", () => expect(field.jsonPath).toBe('$.bar'))
  })

  describe("that has a path defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', path: '$.foo.bar' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the name as the Hash field", () => expect(field.hashField).toBe('foo'))
    it("has the path as the JSON path", () => expect(field.jsonPath).toBe('$.foo.bar'))
  })

  describe("that has a path and an alias defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', alias: 'bar', path: '$.baz.qux' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the alais as the Hash field", () => expect(field.hashField).toBe('bar'))
    it("has the path as the JSON path", () => expect(field.jsonPath).toBe('$.baz.qux'))
  })

  describe("that has a field, a path, and an alias defined", () => {
    beforeEach(() => {
      field = new Field('foo', { type: 'string', alias: 'bar', field: 'baz', path: '$.baz.qux' })
    })

    it("has the expected name", () => expect(field.name).toBe('foo'))
    it("has the expected type", () => expect(field.type).toBe('string'))
    it("has the field as the Hash field", () => expect(field.hashField).toBe('baz'))
    it("has the path as the JSON path", () => expect(field.jsonPath).toBe('$.baz.qux'))
  })
})
