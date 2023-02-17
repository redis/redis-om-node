import { RedisConnection, RedisHashData, RedisJsonData } from "$lib/client"

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function removeKeys(redis: RedisConnection, ...keys: string[]) {
  for (const key of keys) await redis.del(key)
}

export async function saveHash(redis: RedisConnection, key: string, fieldsAndValues: RedisHashData) {
  await redis.hSet(key, fieldsAndValues)
}

export async function saveJson(redis: RedisConnection, key: string, json: RedisJsonData) {
  await redis.json.set(key, '$', json)
}

export async function keyExists(redis: RedisConnection, key: string): Promise<boolean> {
  const exists = await redis.exists(key)
  return !!exists
}

export async function fetchJsonData(redis: RedisConnection, key: string): Promise<RedisJsonData | null> {
  const results = await redis.json.get(key, { path: '$' })
  return results === null ? null : (results as RedisJsonData)[0]
}

export async function fetchHashKeys(redis: RedisConnection, key: string): Promise<string[]> {
  return await redis.hKeys(key)
}

export async function fetchHashFields(redis: RedisConnection, key: string, ...fields: string[]): Promise<string[]> {
  return await redis.hmGet(key, fields)
}

export async function fetchHashData(redis: RedisConnection, key: string): Promise<RedisHashData> {
  return await redis.hGetAll(key)
}

export async function fetchIndexInfo(redis: RedisConnection, indexName: string): Promise<any> {
  return await redis.ft.info(indexName)
}

export async function fetchIndexHash(redis: RedisConnection, indexHashName: string): Promise<string | null> {
  return await redis.get(indexHashName)
}
