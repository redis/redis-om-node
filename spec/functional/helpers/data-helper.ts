import { saveJson } from './redis-helper'

import { EntityData, RedisConnection, Schema } from "$lib/index"

export function createHashEntitySchema(prefix: string): Schema {
  return new Schema(prefix, {
    aString: { type: 'string', field: 'root_aString' },
    someText: { type: 'text', field: 'root_someText', sortable: true },
    aNumber: { type: 'number', field: 'root_aNumber', sortable: true },
    aBoolean: { type: 'boolean', field: 'root_aBoolean' },
    aPoint: { type: 'point', field: 'root_aPoint' },
    aDate: { type: 'date', field: 'root_aDate', sortable: true },
    someStrings: { type: 'string[]', field: 'root_someStrings', }
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
