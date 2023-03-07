import '../helpers/mock-client'
import { Client } from "$lib/client"
import { Search, RawSearch } from "$lib/search"

import {
  simpleHashSchema, simpleSortableHashSchema,
  simpleJsonSchema, simpleSortableJsonSchema
} from "../helpers/test-entity-and-schema"
import {
  mockClientSearchToReturnMultipleHashes as hashMocker,
  mockClientSearchToReturnMultipleJsonStrings as jsonMocker
} from '../helpers/search-helpers'
import { RedisOmError } from '$lib/error'


const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})
const errorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => {})

beforeEach(() => {
  vi.mocked(client.search).mockReset()
})

const client = new Client()

describe.each([
  ["FluentSearch",
    new Search(simpleHashSchema, client),
    new Search(simpleSortableHashSchema, client),
    new Search(simpleJsonSchema, client),
    new Search(simpleSortableJsonSchema, client)],
  ["RawSearch",
    new RawSearch(simpleHashSchema, client),
    new RawSearch(simpleSortableHashSchema, client),
    new RawSearch(simpleJsonSchema, client),
    new RawSearch(simpleSortableJsonSchema, client)]
])("%s", (_, hashSearch, sortableHashSearch, jsonSearch, sortableJsonSearch) => {

  describe("on a Hash", () => {

    beforeEach(async () => { hashMocker() })

    describe("#sortAscending", () => {
      beforeEach(async () => {
        await sortableHashSearch.sortAscending('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' } })
      })
    })

    describe("#sortAsc", () => {
      beforeEach(async () => {
        await sortableHashSearch.sortAsc('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' } })
      })
    })

    describe("#sortDescending", () => {
      beforeEach(async () => {
        await sortableHashSearch.sortDescending('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' } })
      })
    })

    describe("#sortDesc", () => {
      beforeEach(async () => {
        await sortableHashSearch.sortDesc('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' } })
      })
    })
  })

  describe("on a JSON Document", () => {

    beforeEach(async () => { jsonMocker() })

    describe("#sortAscending", () => {
      beforeEach(async () => {
        await sortableJsonSearch.sortAscending('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })
    })

    describe("#sortAsc", () => {
      beforeEach(async () => {
        await sortableJsonSearch.sortAsc('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })
    })

    describe("#sortDescending", () => {
      beforeEach(async () => {
        await sortableJsonSearch.sortDescending('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: '$'
        })
      })
    })

    describe("#sortDesc", () => {
      beforeEach(async () => {
        await sortableJsonSearch.sortDesc('aNumber').return.first()
      })

      it("asks the client for the results with the expected sort options", () => {
        expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: '$'
        })
      })
    })
  })

  describe("#sortBy", () => {
    describe.each([

      ["on a number in a Hash", hashSearch, hashMocker,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aNumber' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable number in a Hash", sortableHashSearch, hashMocker,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
        }],
      ["on a number in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aNumber' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable number in a JSON Document", sortableJsonSearch, jsonMocker,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
        }],

      ["on a string in a Hash", hashSearch, hashMocker,
        {
          field: 'aString',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aString' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable string in a Hash", sortableHashSearch, hashMocker,
        {
          field: 'aString',
          sortOrder: 'ASC',
        }],
      ["on a string in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'aString',
          sortOrder: 'ASC',
        }],
      ["on a sortable string in a JSON Document", sortableJsonSearch, jsonMocker,
        {
          field: 'aString',
          sortOrder: 'ASC',
        }],

      ["on a boolean in a Hash", hashSearch, hashMocker,
        {
          field: 'aBoolean',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aBoolean' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable boolean in a Hash", sortableHashSearch, hashMocker,
        {
          field: 'aBoolean',
          sortOrder: 'ASC',
        }],
      ["on a boolean in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'aBoolean',
          sortOrder: 'ASC',
        }],
      ["on a sortable boolean in a JSON Document", sortableJsonSearch, jsonMocker,
        {
          field: 'aBoolean',
          sortOrder: 'ASC',
        }],

      ["on a text in a Hash", hashSearch, hashMocker,
        {
          field: 'someText',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'someText' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable text in a Hash", sortableHashSearch, hashMocker,
        {
          field: 'someText',
          sortOrder: 'ASC',
        }],
      ["on a text in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'someText',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'someText' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable text in a JSON Document", sortableJsonSearch, jsonMocker,
        {
          field: 'someText',
          sortOrder: 'ASC',
        }],

      ["on a point in a Hash", hashSearch, hashMocker,
        {
          field: 'aPoint',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'point' field 'aPoint' which cannot be sorted."
        }],
      ["on a point in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'aPoint',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'point' field 'aPoint' which cannot be sorted."
        }],

      ["on a date in a Hash", hashSearch, hashMocker,
        {
          field: 'aDate',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aDate' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable date in a Hash", sortableHashSearch, hashMocker,
        {
          field: 'aDate',
          sortOrder: 'ASC',
        }],
      ["on a date in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'aDate',
          sortOrder: 'ASC',
          expectedWarning: "'sortBy' was called on field 'aDate' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }],
      ["on a sortable date in a JSON Document", sortableJsonSearch, jsonMocker,
        {
          field: 'aDate',
          sortOrder: 'ASC',
        }],

      ["on a array in a Hash", hashSearch, hashMocker,
        {
          field: 'someStrings',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'string[]' field 'someStrings' which cannot be sorted."
        }],
      ["on a array in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'someStrings',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'string[]' field 'someStrings' which cannot be sorted."
        }],

      ["on an invalid field in a Hash", hashSearch, hashMocker,
        {
          field: 'somethingMissing',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on field 'somethingMissing' which is not defined in the Schema."
        }],
      ["on an invalid field in a JSON Document", jsonSearch, jsonMocker,
        {
          field: 'somethingMissing',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on field 'somethingMissing' which is not defined in the Schema."
        }]

    ])("%s", (_, search, clientMocker, data: any) => {

      let field = data.field
      let order = data.sortOrder
      let expectedWarning = data.expectedWarning
      let expectedError = data.expectedError
      let actualError: RedisOmError

      beforeEach(async () => {
        clientMocker()
        try {
          await search.sortBy(field, order).return.first()
        } catch (error) {
          actualError = error as RedisOmError
        }
      })

      if (expectedError) {
        it("logs and throws an error", () => {
          expect(actualError!.message).toBe(expectedError)
          expect(errorSpy).toHaveBeenCalledWith(expectedError)
        })
        return
      }

      it("does not generate an error", () => {
        if (actualError) console.log(actualError)
        expect(actualError).toBeUndefined()
        expect(errorSpy).not.toHaveBeenCalled()
      })

      it("asks the client for the results with the expected sort options", () => {
        // ya, this is a little jank
        if (clientMocker === jsonMocker) {
          expect(client.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
            LIMIT: { from: 0, size: 1 },
            SORTBY: { BY: field, DIRECTION: order },
            RETURN: '$'
          })
        } else {
          expect(client.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
            LIMIT: { from: 0, size: 1 },
            SORTBY: { BY: field, DIRECTION: order }
          })
        }
      })

      if (expectedWarning) {
        it("generates the expected warning", () => {
          expect(warnSpy).toHaveBeenCalledWith(expectedWarning)
        })
      } else {
        it("does not generate a warning", () => {
          expect(warnSpy).not.toHaveBeenCalled()
        })
      }
    })
  })
})
