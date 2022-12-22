import { saveJson } from './redis-helper'

import { EntityData, RedisConnection, Schema } from "$lib/index"

export function createHashEntitySchema(prefix: string): Schema {
  // TODO: make this have some custom fields
  return new Schema(prefix, {
    aString: { type: 'string' },
    someText: { type: 'text', sortable: true },
    aNumber: { type: 'number', sortable: true },
    aBoolean: { type: 'boolean' },
    aPoint: { type: 'point' },
    aDate: { type: 'date', sortable: true },
    someStrings: { type: 'string[]' }
  }, {
    dataStructure: 'HASH'
  })
}

export function createJsonEntitySchema(prefix: string): Schema {
  return new Schema(prefix, {
    aString: { type: 'string', path: '$.root.aString' },
    someText: { type: 'text', path: '$.root.someText', sortable: true },
    aNumber: { type: 'number', path: '$.root.aNumber', sortable: true },
    aBoolean: { type: 'boolean', path: '$.root.aBoolean' },
    aPoint: { type: 'point', path: '$.root.aPoint' },
    aDate: { type: 'date', path: '$.root.aDate', sortable: true },
    someStrings: { type: 'string[]', path: '$.root.someStrings[*]' }
  }, {
    dataStructure: 'JSON'
  })
}

export async function loadTestJson(redis: RedisConnection, key: string, data: EntityData) {

  const json: any = {}

  Object.keys(data).forEach(field => {
    const value = (data as any)[field]
    if (value !== null) {
      if (value instanceof Date) json[field] = value.getTime() / 1000
      else if (typeof value === 'object' && !Array.isArray(value)) json[field] = `${value.longitude},${value.latitude}`
      else json[field] = value
    }
  })

  await saveJson(redis, key, json)
}
