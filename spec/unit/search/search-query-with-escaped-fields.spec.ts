import '../../helpers/custom-matchers'
import { RedisConnection } from '$lib/client'

import { mockRedis } from '../helpers/mock-redis'
import { Search } from '$lib/search'

import { escapedFieldsSchema } from '../helpers/test-entity-and-schema'

import { A_STRING } from '../../helpers/example-data'

describe('Search', () => {
  describe('#query', () => {
    let redis: RedisConnection

    beforeAll(() => {
      redis = mockRedis()
    })

    let search: Search

    beforeEach(() => {
      search = new Search(escapedFieldsSchema, redis)
    })

    it.each([
      ["generates a query escaping ','", 'a,field', `(@a\\,field:{${A_STRING}})`],
      ["generates a query escaping '.'", 'a.field', `(@a\\.field:{${A_STRING}})`],
      ["generates a query escaping '<'", 'a<field', `(@a\\<field:{${A_STRING}})`],
      ["generates a query escaping '>'", 'a>field', `(@a\\>field:{${A_STRING}})`],
      ["generates a query escaping '{'", 'a{field', `(@a\\{field:{${A_STRING}})`],
      ["generates a query escaping '}'", 'a}field', `(@a\\}field:{${A_STRING}})`],
      ["generates a query escaping '['", 'a[field', `(@a\\[field:{${A_STRING}})`],
      ["generates a query escaping ']'", 'a]field', `(@a\\]field:{${A_STRING}})`],
      ["generates a query escaping '\"'", 'a"field', `(@a\\"field:{${A_STRING}})`],
      ["generates a query escaping '''", "a'field", `(@a\\'field:{${A_STRING}})`],
      ["generates a query escaping ':'", 'a:field', `(@a\\:field:{${A_STRING}})`],
      ["generates a query escaping ';'", 'a;field', `(@a\\;field:{${A_STRING}})`],
      ["generates a query escaping '!'", 'a!field', `(@a\\!field:{${A_STRING}})`],
      ["generates a query escaping '@'", 'a@field', `(@a\\@field:{${A_STRING}})`],
      ["generates a query escaping '#'", 'a#field', `(@a\\#field:{${A_STRING}})`],
      ["generates a query escaping '$'", 'a$field', `(@a\\$field:{${A_STRING}})`],
      ["generates a query escaping '%'", 'a%field', `(@a\\%field:{${A_STRING}})`],
      ["generates a query escaping '^'", 'a^field', `(@a\\^field:{${A_STRING}})`],
      ["generates a query escaping '&'", 'a&field', `(@a\\&field:{${A_STRING}})`],
      ["generates a query escaping '('", 'a(field', `(@a\\(field:{${A_STRING}})`],
      ["generates a query escaping ')'", 'a)field', `(@a\\)field:{${A_STRING}})`],
      ["generates a query escaping '-'", 'a-field', `(@a\\-field:{${A_STRING}})`],
      ["generates a query escaping '+'", 'a+field', `(@a\\+field:{${A_STRING}})`],
      ["generates a query escaping '='", 'a=field', `(@a\\=field:{${A_STRING}})`],
      ["generates a query escaping '~'", 'a~field', `(@a\\~field:{${A_STRING}})`],
      ["generates a query escaping '|'", 'a|field', `(@a\\|field:{${A_STRING}})`],
      ["generates a query escaping '/'", 'a/field', `(@a\\/field:{${A_STRING}})`],
      ["generates a query escaping '\\'", 'a\\field', `(@a\\\\field:{${A_STRING}})`],
      ["generates a query escaping ' '", 'a field', `(@a\\ field:{${A_STRING}})`]
    ])('%s', (_, field, expectedQuery) => {
      let query = search.where(field).eq(A_STRING).query
      expect(query).toBe(expectedQuery)
    })
  })
})
