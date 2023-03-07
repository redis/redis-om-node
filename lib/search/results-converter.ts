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

export function extractEntityIdsFromSearchResults(schema: Schema, results: SearchResults): string[] {
  const keyNames = extractKeyNamesFromSearchResults(results)
  const entityIds = keyNamesToEntityIds(schema.schemaName, keyNames)
  return entityIds
}

export function extractEntitiesFromSearchResults(schema: Schema, results: SearchResults): Entity[] {
  if (schema.dataStructure === 'HASH') {
    return results.documents.map(document => hashDocumentToEntity(schema, document))
  } else {
    return results.documents.map(document => jsonDocumentToEntity(schema, document))
  }
}

function hashDocumentToEntity(schema: Schema, document: SearchDocument): Entity {
  const keyName: string = document.id
  const hashData: RedisHashData = document.value

  const entityData = fromRedisHash(schema, hashData)
  const entity = enrichEntityData(schema.schemaName, keyName, entityData)
  return entity
}

function jsonDocumentToEntity(schema: Schema, document: SearchDocument): Entity {
  const keyName: string = document.id
  const jsonData: RedisJsonData = document.value['$'] ?? false ? JSON.parse(document.value['$']) : document.value

  const entityData = fromRedisJson(schema, jsonData)
  const entity = enrichEntityData(schema.schemaName, keyName, entityData)
  return entity
}

function enrichEntityData(keyPrefix: string, keyName: string, entityData: EntityData) {
  const entityId = keyNameToEntityId(keyPrefix, keyName)
  const entity = { ...entityData, [EntityId]: entityId, [EntityKeyName]: keyName}
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
