import Client from "../../lib/client";

export async function saveHash(client: Client, key: string, fields: string[]) {
  await client.execute(['HSET', key, ...fields]);
}

export async function keyExists(client: Client, key: string): Promise<boolean> {
  let exists = await client.execute<number>(['EXISTS', key]);
  return !!exists;
}

export async function fetchHashKeys(client: Client, key: string): Promise<string[]> {
  return await client.execute(['HKEYS', key]);
}

export async function fetchHashFields(client: Client, key: string, ...fields: string[]): Promise<string[]> {
  return await client.execute(['HMGET', key, ...fields]);
}
