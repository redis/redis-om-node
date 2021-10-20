import Client from "../../../src/client";

export async function saveHash(client: Client, key: string, fields: string[]) {
  await client.execute(['HSET', key, ...fields]);
}
1
export async function saveJson(client: Client, key: string, json: string) {
  await client.execute(['JSON.SET', key, '.', json]);
}

export async function keyExists(client: Client, key: string): Promise<boolean> {
  let exists = await client.execute<number>(['EXISTS', key]);
  return !!exists;
}

export async function fetchJson(client: Client, key: string): Promise<string> {
  return await client.execute<string>(['JSON.GET', key, '.']);
}

export async function fetchHashKeys(client: Client, key: string): Promise<string[]> {
  return await client.execute(['HKEYS', key]);
}

export async function fetchHashFields(client: Client, key: string, ...fields: string[]): Promise<string[]> {
  return await client.execute(['HMGET', key, ...fields]);
}

export async function fetchIndexInfo(client: Client, indexName: string): Promise<string[]> {
  return await client.execute<string[]>(['FT.INFO', indexName]);
}
