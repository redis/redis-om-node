import { RedisHashData, RedisJsonData } from "../client"
import { Entity, EntityData } from "../entity"
import { Schema } from "../schema"
import { fromRedisHash, fromRedisJson } from "../transformer"

export function extractCountFromSearchResults(results: any[]): number {
  const [count] = results
  return Number.parseInt(count)
}

export function extractKeyNamesFromSearchResults(results: any[]): string[] {
  const [_count, ...keyNames] = results
  return keyNames
}

export function extractEntityIdsFromSearchResults(schema: Schema, results: any[]): string[] {
  const keyNames = extractKeyNamesFromSearchResults(results)
  const entityIds = keyNamesToEntityIds(schema.prefix, keyNames)
  return entityIds
}

export function extractEntitiesFromSearchResults(schema: Schema, results: any[]): Entity[] {
  const [_count, ...keysAndEntityArrays] = results
  const keyNames = keysAndEntityArrays.filter((_entry, index) => index % 2 === 0)
  const entityArrays = keysAndEntityArrays.filter((_entry, index) => index % 2 !== 0)

  if (schema.dataStructure === 'JSON') {
    return entityArrays.map((entityArray, index) => jsonArrayToEntity(schema, keyNames[index], entityArray))
  } else {
    return entityArrays.map((entityArray, index) => hashArrayToEntity(schema, keyNames[index], entityArray))
  }
}

function hashArrayToEntity(schema: Schema, keyName: string, array: Array<string>): Entity {
  const keys = array.filter((_entry, index) => index % 2 === 0)
  const values = array.filter((_entry, index) => index % 2 !== 0)

  const hashData: RedisHashData = keys.reduce((object: any, key, index) => {
    object[key] = values[index]
    return object
  }, {})

  const entityData = fromRedisHash(schema, hashData)

  const entity = enrichEntityData(schema.prefix, keyName, entityData)
  return entity
}

function jsonArrayToEntity(schema: Schema, keyName: string, array: Array<string>): Entity {
  const index = array.findIndex(value => value === '$') + 1
  const jsonString = array[index]

  const jsonData: RedisJsonData = JSON.parse(jsonString)

  const entityData = fromRedisJson(schema, jsonData)
  const entity = enrichEntityData(schema.prefix, keyName, entityData)
  return entity
}

function enrichEntityData(keyPrefix: string, keyName: string, entityData: EntityData) {
  const entityId = keyNameToEntityId(keyPrefix, keyName)
  const entity = { ...entityData, entityId, keyName}
  return entity
}

function keyNamesToEntityIds(keyPrefix: string, keyNames: string[]): string[] {
  return keyNames.map(keyName => keyNameToEntityId(keyPrefix, keyName))
}

function keyNameToEntityId(keyPrefix: string, keyName: string): string {
  const escapedPrefix = keyPrefix.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`^${escapedPrefix}:`)
  const entityId = keyName.replace(regex, "")
  return entityId
}
