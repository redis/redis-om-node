import { fetchHashData, fetchJsonData, saveHash, saveJson } from './redis-helper'

import { Client, EntityData, Schema } from "$lib/index"
import { RedisHashData, RedisJsonData } from '$lib/client'

export function createHashEntitySchema(prefix: string): Schema {
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

export async function loadHash(client: Client, key: string, data: RedisHashData) {
  const command: Array<string> = []

  Object.keys(data).forEach(field => {
    const value = data[field]
    command.push(field, value)
  })

  if (command.length > 0) await saveHash(client, key, command)
}

export async function loadJson(client: Client, key: string, data: RedisJsonData) {
  const json = JSON.stringify(data)
  await saveJson(client, key, json)
}

export async function fetchHash(client: Client, key: string): Promise<RedisHashData> {
  const data = await fetchHashData(client, key)

  const fields = data.filter((_value, index) => index % 2 === 0)
  const values = data.filter((_value, index) => index % 2 !== 0)

  const hashData: RedisHashData = {}
  fields.forEach((field, index) =>  hashData[field] = values[index])
  return hashData
}

export async function fetchJson(client: Client, key: string): Promise<RedisJsonData> {
  const data = await fetchJsonData(client, key)
  return JSON.parse(data)
}

export async function loadTestJson(client: Client, key: string, data: EntityData) {

  const json: any = {}

  Object.keys(data).forEach(field => {
    const value = (data as any)[field]
    if (value !== null) {
      if (value instanceof Date) json[field] = value.getTime() / 1000
      else if (typeof value === 'object' && !Array.isArray(value)) json[field] = `${value.longitude},${value.latitude}`
      else json[field] = value
    }
  })

  await saveJson(client, key, JSON.stringify(json))
}
