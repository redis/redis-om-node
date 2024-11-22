import { RedisConnection } from '$lib/client'
import { RedisOmError } from '$lib/error'
import { Search } from '$lib/search'

import { mockRedis } from '../helpers/mock-redis'
import {
  simpleHashSchema,
  simpleSortableHashSchema,
  simpleJsonSchema,
  simpleSortableJsonSchema
} from '../helpers/test-entity-and-schema'
import { mockSearchToReturnMultipleHashes, mockSearchToReturnMultipleJsonStrings } from '../helpers/search-helpers'

const warnSpy = vi.spyOn(global.console, 'warn').mockImplementation(() => {})
const errorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => {})

describe('Search', () => {
  let redis: RedisConnection
  let search: Search

  beforeEach(() => {
    redis = mockRedis()
  })

  describe('#sortBy', () => {
    describe.each([
      [
        'on a number in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aNumber' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable number in a Hash',
        simpleSortableHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aNumber',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a number in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aNumber',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aNumber' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable number in a JSON Document',
        simpleSortableJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aNumber',
          sortOrder: 'ASC'
        }
      ],

      [
        'on a string in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aString',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aString' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable string in a Hash',
        simpleSortableHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aString',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a string in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aString',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a sortable string in a JSON Document',
        simpleSortableJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aString',
          sortOrder: 'ASC'
        }
      ],

      [
        'on a boolean in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aBoolean',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aBoolean' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable boolean in a Hash',
        simpleSortableHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aBoolean',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a boolean in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aBoolean',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a sortable boolean in a JSON Document',
        simpleSortableJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aBoolean',
          sortOrder: 'ASC'
        }
      ],

      [
        'on a text in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'someText',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'someText' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable text in a Hash',
        simpleSortableHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'someText',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a text in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'someText',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'someText' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable text in a JSON Document',
        simpleSortableJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'someText',
          sortOrder: 'ASC'
        }
      ],

      [
        'on a point in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aPoint',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'point' field 'aPoint' which cannot be sorted."
        }
      ],
      [
        'on a point in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aPoint',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'point' field 'aPoint' which cannot be sorted."
        }
      ],

      [
        'on a date in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aDate',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aDate' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable date in a Hash',
        simpleSortableHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'aDate',
          sortOrder: 'ASC'
        }
      ],
      [
        'on a date in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aDate',
          sortOrder: 'ASC',
          expectedWarning:
            "'sortBy' was called on field 'aDate' which is not marked as sortable in the Schema. This may result is slower searches. If possible, mark the field as sortable in the Schema."
        }
      ],
      [
        'on a sortable date in a JSON Document',
        simpleSortableJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'aDate',
          sortOrder: 'ASC'
        }
      ],

      [
        'on a array in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'someStrings',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'string[]' field 'someStrings' which cannot be sorted."
        }
      ],
      [
        'on a array in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'someStrings',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on 'string[]' field 'someStrings' which cannot be sorted."
        }
      ],

      [
        'on an invalid field in a Hash',
        simpleHashSchema,
        mockSearchToReturnMultipleHashes,
        {
          field: 'somethingMissing',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on field 'somethingMissing' which is not defined in the Schema."
        }
      ],
      [
        'on an invalid field in a JSON Document',
        simpleJsonSchema,
        mockSearchToReturnMultipleJsonStrings,
        {
          field: 'somethingMissing',
          sortOrder: 'ASC',
          expectedError: "'sortBy' was called on field 'somethingMissing' which is not defined in the Schema."
        }
      ]
    ])('%s', (_, schema, mockSearch, data: any) => {
      let field = data.field
      let order = data.sortOrder
      let expectedWarning = data.expectedWarning
      let expectedError = data.expectedError
      let actualError: RedisOmError

      beforeEach(async () => {
        search = new Search(schema, redis)
        mockSearch(redis)
        try {
          await search.sortBy(field, order).return.first()
        } catch (error) {
          actualError = error as RedisOmError
        }
      })

      if (expectedError) {
        it('logs and throws an error', () => {
          expect(actualError!.message).toBe(expectedError)
          expect(errorSpy).toHaveBeenCalledWith(expectedError)
        })
        return
      }

      it('does not generate an error', () => {
        if (actualError) console.log(actualError)
        expect(actualError).toBeUndefined()
        expect(errorSpy).not.toHaveBeenCalled()
      })

      it('asks redis for the results with the expected sort options', () => {
        // ya, this is a little jank
        if (mockSearch === mockSearchToReturnMultipleJsonStrings) {
          expect(redis.ft.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
            LIMIT: { from: 0, size: 1 },
            SORTBY: { BY: field, DIRECTION: order },
            RETURN: '$'
          })
        } else {
          expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
            LIMIT: { from: 0, size: 1 },
            SORTBY: { BY: field, DIRECTION: order }
          })
        }
      })

      if (expectedWarning) {
        it('generates the expected warning', () => {
          expect(warnSpy).toHaveBeenCalledWith(expectedWarning)
        })
      } else {
        it('does not generate a warning', () => {
          expect(warnSpy).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe('when searching hashes', () => {
    beforeEach(async () => {
      search = new Search(simpleSortableHashSchema, redis)
      mockSearchToReturnMultipleHashes(redis)
    })

    describe('#sortAscending', () => {
      beforeEach(async () => {
        await search.sortAscending('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' }
        })
      })
    })

    describe('#sortAsc', () => {
      beforeEach(async () => {
        await search.sortAsc('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' }
        })
      })
    })

    describe('#sortDescending', () => {
      beforeEach(async () => {
        await search.sortDescending('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' }
        })
      })
    })

    describe('#sortDesc', () => {
      beforeEach(async () => {
        await search.sortDesc('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleHashEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' }
        })
      })
    })
  })

  describe('when searching JSON', () => {
    beforeEach(async () => {
      search = new Search(simpleSortableJsonSchema, redis)
      mockSearchToReturnMultipleJsonStrings(redis)
    })

    describe('#sortAscending', () => {
      beforeEach(async () => {
        await search.sortAscending('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })
    })

    describe('#sortAsc', () => {
      beforeEach(async () => {
        await search.sortAsc('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'ASC' },
          RETURN: '$'
        })
      })
    })

    describe('#sortDescending', () => {
      beforeEach(async () => {
        await search.sortDescending('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: '$'
        })
      })
    })

    describe('#sortDesc', () => {
      beforeEach(async () => {
        await search.sortDesc('aNumber').return.first()
      })

      it('asks redis for the results with the expected sort options', () => {
        expect(redis.ft.search).toHaveBeenCalledWith('SimpleJsonEntity:index', '*', {
          LIMIT: { from: 0, size: 1 },
          SORTBY: { BY: 'aNumber', DIRECTION: 'DESC' },
          RETURN: '$'
        })
      })
    })
  })
})
