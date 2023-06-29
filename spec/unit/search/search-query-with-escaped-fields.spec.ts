import '../../helpers/custom-matchers'

import { Client } from "$lib/client"
import { Search } from "$lib/search"

import { escapedFieldsSchema } from "../helpers/test-entity-and-schema"
import { FieldNotInSchema } from "$lib/error"

import { A_STRING } from '../../helpers/example-data'


const EXPECTED_STRING_QUERY_1 = `@aString:{${A_STRING}}`

describe("Search", () => {
  describe("#query", () => {

    let client: Client

    beforeAll(() => {
      client = new Client()
    })

    let search: Search

    beforeEach(() => {
      search = new Search(escapedFieldsSchema, client)
    })

    it.each([
      [ "generates a query escaping ','", "a,field", `(@a\\,field:{${A_STRING}})` ],
      [ "generates a query escaping '.'", "a.field", `(@a\\.field:{${A_STRING}})` ],
      [ "generates a query escaping '<'", "a<field", `(@a\\<field:{${A_STRING}})` ],
      [ "generates a query escaping '>'", "a>field", `(@a\\>field:{${A_STRING}})` ],
      [ "generates a query escaping '{'", "a{field", `(@a\\{field:{${A_STRING}})` ],
      [ "generates a query escaping '}'", "a}field", `(@a\\}field:{${A_STRING}})` ],
      [ "generates a query escaping '['", "a[field", `(@a\\[field:{${A_STRING}})` ],
      [ "generates a query escaping ']'", "a]field", `(@a\\]field:{${A_STRING}})` ],
      [ "generates a query escaping '\"'", "a\"field", `(@a\\"field:{${A_STRING}})` ],
      [ "generates a query escaping '''", "a'field", `(@a\\'field:{${A_STRING}})` ],
      [ "generates a query escaping ':'", "a:field", `(@a\\:field:{${A_STRING}})` ],
      [ "generates a query escaping ';'", "a;field", `(@a\\;field:{${A_STRING}})` ],
      [ "generates a query escaping '!'", "a!field", `(@a\\!field:{${A_STRING}})` ],
      [ "generates a query escaping '@'", "a@field", `(@a\\@field:{${A_STRING}})` ],
      [ "generates a query escaping '#'", "a#field", `(@a\\#field:{${A_STRING}})` ],
      [ "generates a query escaping '$'", "a$field", `(@a\\$field:{${A_STRING}})` ],
      [ "generates a query escaping '%'", "a%field", `(@a\\%field:{${A_STRING}})` ],
      [ "generates a query escaping '^'", "a^field", `(@a\\^field:{${A_STRING}})` ],
      [ "generates a query escaping '&'", "a&field", `(@a\\&field:{${A_STRING}})` ],
      [ "generates a query escaping '('", "a(field", `(@a\\(field:{${A_STRING}})` ],
      [ "generates a query escaping ')'", "a)field", `(@a\\)field:{${A_STRING}})` ],
      [ "generates a query escaping '-'", "a-field", `(@a\\-field:{${A_STRING}})` ],
      [ "generates a query escaping '+'", "a+field", `(@a\\+field:{${A_STRING}})` ],
      [ "generates a query escaping '='", "a=field", `(@a\\=field:{${A_STRING}})` ],
      [ "generates a query escaping '~'", "a~field", `(@a\\~field:{${A_STRING}})` ],
      [ "generates a query escaping '|'", "a|field", `(@a\\|field:{${A_STRING}})` ],
      [ "generates a query escaping '/'", "a/field", `(@a\\/field:{${A_STRING}})` ],
      [ "generates a query escaping '\\'", "a\\field", `(@a\\\\field:{${A_STRING}})` ],
      [ "generates a query escaping ' '", "a field", `(@a\\ field:{${A_STRING}})` ]
    ])('%s', (_, field, expectedQuery) => {
      let query = search.where(field).eq(A_STRING).query
      expect(query).toBe(expectedQuery)
    })
  })
})
