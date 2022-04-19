import Client from "../../../lib/client";

export async function flushAll(client: Client) {
  await client.execute(['FLUSHALL']);
}

export async function saveHash(client: Client, key: string, fields: Array<string>) {
  await client.execute(['HSET', key, ...fields]);
}

export async function saveJson(client: Client, key: string, json: string) {
  await client.execute(['JSON.SET', key, '.', json]);
}

export async function keyExists(client: Client, key: string): Promise<boolean> {
  const exists = await client.execute(['EXISTS', key]);
  return !!exists;
}

export async function fetchJson(client: Client, key: string): Promise<string> {
  return <string>await client.execute(['JSON.GET', key, '.']);
}

export async function fetchHashKeys(client: Client, key: string): Promise<Array<string>> {
  return <Array<string>>await client.execute(['HKEYS', key]);
}

export async function fetchHashFields(client: Client, key: string, ...fields: Array<string>): Promise<Array<string>> {
  return <Array<string>>await client.execute(['HMGET', key, ...fields]);
}

export async function fetchIndexInfo(client: Client, indexName: string): Promise<Array<string>> {
  return <Array<string>>await client.execute(['FT.INFO', indexName]);
}

export async function fetchIndexHash(client: Client, indexHashName: string): Promise<string> {
  return <string>await client.execute(['GET', indexHashName]);
}
