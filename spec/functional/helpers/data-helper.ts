import { saveHash, saveJson } from './redis-helper';

import Client, { SearchDataStructure } from "../../../lib/client";
import Entity, { EntityConstructor } from "../../../lib/entity/entity";
import Schema from '../../../lib/schema/schema';
import { GeoPoint } from '../../../lib';

import { SampleEntityData } from "../../helpers/example-data";

interface SampleEntity {
  aString?: string | null;
  anotherString?: string | null;
  aFullTextString?: string | null;
  anotherFullTextString?: string | null;
  aNumber?: number | null;
  anotherNumber?: number | null;
  aBoolean?: boolean | null;
  anotherBoolean?: boolean | null;
  aGeoPoint?: GeoPoint | null;
  anotherGeoPoint?: GeoPoint | null;
  aDate?: Date | null;
  anotherDate?: Date | null;
  anArray?: string[] | null;
  anotherArray?: string[] | null;
}

export interface SampleHashEntity extends SampleEntity {}
export interface SampleJsonEntity extends SampleEntity {}

class SampleEntity extends Entity {}
export class SampleHashEntity extends SampleEntity {}
export class SampleJsonEntity extends SampleEntity {}

export function createHashEntitySchema() : Schema<SampleHashEntity> {
  return createSchemaOfType<SampleHashEntity>(SampleHashEntity, 'HASH');
}

export function createJsonEntitySchema() : Schema<SampleJsonEntity> {
  return createSchemaOfType<SampleJsonEntity>(SampleJsonEntity, 'JSON');
}

function createSchemaOfType<TEntity extends Entity>(ctor: EntityConstructor<TEntity>, dataStructure: SearchDataStructure) : Schema<TEntity> {
  return new Schema<TEntity>(
    ctor, {
      aString: { type: 'string' },
      anotherString: { type: 'string' },
      aFullTextString: { type: 'string', textSearch: true },
      anotherFullTextString: { type: 'string', textSearch: true },
      aNumber: { type: 'number' },
      anotherNumber: { type: 'number' },
      aBoolean: { type: 'boolean' },
      anotherBoolean: { type: 'boolean' },
      aGeoPoint: { type: 'geopoint' },
      anotherGeoPoint: { type: 'geopoint' },
      aDate: { type: 'date' },
      anotherDate: { type: 'date' },
      anArray: { type: 'array' },
      anotherArray: { type: 'array' }
    }, {
      dataStructure
    });
}

export async function loadTestHash(client: Client, key: string, data: SampleEntityData) {

  let command: string[] = [];

  for (let field in data) {
    let value = (data as any)[field];
    if (value !== null) {
      if (typeof value === 'boolean') command.push(field, value ? '1' : '0');
      else if (typeof value === 'number') command.push(field, value.toString());
      else if (typeof value === 'string') command.push(field, value);
      else if (Array.isArray(value)) command.push(field, value.join('|'));
      else if (value instanceof Date) command.push(field, value.getTime().toString());
      else if (typeof value === 'object') command.push(field, `${value.longitude},${value.latitude}`)
    }
  }

  if (command.length > 0) await saveHash(client, key, command);
}

export async function loadTestJson(client: Client, key: string, data: SampleEntityData) {

  let json: any = {};

  for (let field in data) {
    let value = (data as any)[field];
    if (value !== null) {
      if (value instanceof Date) json[field] = value.getTime();
      else if (typeof value === 'object' && !Array.isArray(value)) json[field] = `${value.longitude},${value.latitude}`;
      else json[field] = value;
    }
  }

  await saveJson(client, key, JSON.stringify(json));
}
