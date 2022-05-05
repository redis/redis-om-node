import { saveHash, saveJson } from './redis-helper';

import Client, { SearchDataStructure } from "../../../lib/client";
import Entity from "../../../lib/entity/entity";
import EntityConstructor from '../../../lib/entity/entity-constructor';
import Schema from '../../../lib/schema/schema';
import { Point } from '../../../lib';

import { SampleEntityData } from "../../helpers/example-data";

interface SampleEntity {
  aString?: string | null;
  anotherString?: string | null;
  someText?: string | null;
  someOtherText?: string | null;
  aNumber?: number | null;
  anotherNumber?: number | null;
  aBoolean?: boolean | null;
  anotherBoolean?: boolean | null;
  aPoint?: Point | null;
  anotherPoint?: Point | null;
  aDate?: Date | null;
  anotherDate?: Date | null;
  someStrings?: Array<string> | null;
  someOtherStrings?: Array<string> | null;
}

export interface SampleHashEntity extends SampleEntity { }
export interface SampleJsonEntity extends SampleEntity { }

class SampleEntity extends Entity { }
export class SampleHashEntity extends SampleEntity { }
export class SampleJsonEntity extends SampleEntity { }

export function createHashEntitySchema(): Schema<SampleHashEntity> {
  return createSchemaOfType<SampleHashEntity>(SampleHashEntity, 'HASH');
}

export function createChangedHashEntitySchema(): Schema<SampleHashEntity> {
  return createSchemaOfType<SampleHashEntity>(SampleHashEntity, 'HASH', 'sample-hash-entity');
}

export function createJsonEntitySchema(): Schema<SampleJsonEntity> {
  return createSchemaOfType<SampleJsonEntity>(SampleJsonEntity, 'JSON');
}

export function createChangedJsonEntitySchema(): Schema<SampleJsonEntity> {
  return createSchemaOfType<SampleJsonEntity>(SampleJsonEntity, 'JSON', 'sample-json-entity');
}

function createSchemaOfType<TEntity extends Entity>(ctor: EntityConstructor<TEntity>, dataStructure: SearchDataStructure, prefix?: string): Schema<TEntity> {
  return new Schema<TEntity>(
    ctor, {
    aString: { type: 'string' },
    anotherString: { type: 'string' },
    someText: { type: 'text', sortable: true },
    someOtherText: { type: 'text', sortable: true },
    aNumber: { type: 'number', sortable: true },
    anotherNumber: { type: 'number', sortable: true },
    aBoolean: { type: 'boolean' },
    anotherBoolean: { type: 'boolean' },
    aPoint: { type: 'point' },
    anotherPoint: { type: 'point' },
    aDate: { type: 'date', sortable: true },
    anotherDate: { type: 'date', sortable: true },
    someStrings: { type: 'string[]' },
    someOtherStrings: { type: 'string[]' }
  }, {
    prefix,
    dataStructure
  });
}

export async function loadTestHash(client: Client, key: string, data: SampleEntityData) {

  const command: Array<string> = [];

  Object.keys(data).forEach(field => {
    const value = (data as any)[field];
    if (value !== null) {
      if (typeof value === 'boolean') command.push(field, value ? '1' : '0');
      else if (typeof value === 'number') command.push(field, value.toString());
      else if (typeof value === 'string') command.push(field, value);
      else if (Array.isArray(value)) command.push(field, value.join('|'));
      else if (value instanceof Date) command.push(field, (value.getTime() / 1000).toString());
      else if (typeof value === 'object') command.push(field, `${value.longitude},${value.latitude}`)
    }
  })

  if (command.length > 0) await saveHash(client, key, command);
}

export async function loadTestJson(client: Client, key: string, data: SampleEntityData) {

  const json: any = {};

  Object.keys(data).forEach(field => {
    const value = (data as any)[field];
    if (value !== null) {
      if (value instanceof Date) json[field] = value.getTime() / 1000;
      else if (typeof value === 'object' && !Array.isArray(value)) json[field] = `${value.longitude},${value.latitude}`;
      else json[field] = value;
    }
  })

  await saveJson(client, key, JSON.stringify(json));
}
