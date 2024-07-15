import { RedisHashData, RedisJsonData, SearchDocument, SearchResults } from "../client"
import { Entity, EntityData, EntityId, EntityKeyName } from "../entity"
import { Schema } from "../schema"
import { fromRedisHash, fromRedisJson } from "../transformer"

export function extractCountFromSearchResults(results: SearchResults): number {
  return results.total
}

export function extractKeyNamesFromSearchResults(results: SearchResults): string[] {
  return results.documents.map(document => document.id)
}

export function extractEntityIdsFromSearchResults<T extends Entity>(schema: Schema<T>, results: SearchResults): string[] {
  const keyNames = extractKeyNamesFromSearchResults(results)
  return keyNamesToEntityIds(schema.schemaName, keyNames)
}

export function extractEntitiesFromSearchResults<T extends Entity>(schema: Schema<T>, results: SearchResults): T[] {
  if (schema.dataStructure === 'HASH') {
    return results.documents.map(document => hashDocumentToEntity(schema, document))
  } else {
    return results.documents.map(document => jsonDocumentToEntity(schema, document))
  }
}

function hashDocumentToEntity<T extends Entity>(schema: Schema<T>, document: SearchDocument): T {
  const keyName: string = document.id
  const hashData: RedisHashData = document.value

  const entityData = fromRedisHash(schema, hashData)
  return enrichEntityData(schema.schemaName, keyName, entityData)
}

function jsonDocumentToEntity<T extends Entity>(schema: Schema<T>, document: SearchDocument): T {
  const keyName: string = document.id
  const jsonData: RedisJsonData = document.value['$'] ?? false ? JSON.parse(document.value['$']) : document.value

  const entityData = fromRedisJson(schema, jsonData)
  return enrichEntityData(schema.schemaName, keyName, entityData)
}

function enrichEntityData<T extends Entity>(keyPrefix: string, keyName: string, entityData: EntityData): T {
  const entityId = keyNameToEntityId(keyPrefix, keyName)
  return {...entityData, [EntityId]: entityId, [EntityKeyName]: keyName} as T
}

function keyNamesToEntityIds(keyPrefix: string, keyNames: string[]): string[] {
  return keyNames.map(keyName => keyNameToEntityId(keyPrefix, keyName))
}

function keyNameToEntityId(keyPrefix: string, keyName: string): string {
  const escapedPrefix = keyPrefix.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`^${escapedPrefix}:`)
  return keyName.replace(regex, "")
}
