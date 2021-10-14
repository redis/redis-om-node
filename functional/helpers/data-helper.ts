import { saveHash, saveJson } from './redis-helper';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from '../../lib/schema/schema';

import { EntityConstructor } from '../../lib/entity/entity-types';
import { EntityDataStructure } from '../../lib/schema/schema-options';

interface CommonEntity {
  aString?: string | null;
  anotherString?: string | null;
  aFullTextString?: string | null;
  anotherFullTextString?: string | null;
  aNumber?: number | null;
  anotherNumber?: number | null;
  aBoolean?: boolean | null;
  anotherBoolean?: boolean | null;
  anArray?: string[] | null;
  anotherArray?: string[] | null;
}

export interface HashEntity extends CommonEntity {}
export interface JsonEntity extends CommonEntity {}

class CommonEntity extends Entity {}
export class HashEntity extends CommonEntity {}
export class JsonEntity extends CommonEntity {}

export function createHashEntitySchema() : Schema<HashEntity> {
  return createSchemaOfType<HashEntity>(HashEntity, 'HASH');
}

export function createJsonEntitySchema() : Schema<JsonEntity> {
  return createSchemaOfType<JsonEntity>(JsonEntity, 'JSON');
}

function createSchemaOfType<TEntity extends Entity>(ctor: EntityConstructor<TEntity>, dataStructure: EntityDataStructure) : Schema<TEntity> {
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
      anArray: { type: 'array' },
      anotherArray: { type: 'array' }
    }, {
      dataStructure
    });
}

type CommonEntityData = {
  aString: string | null;
  anotherString: string | null;
  aFullTextString: string | null;
  anotherFullTextString: string | null;
  aNumber: number | null;
  anotherNumber: number | null;
  aBoolean: boolean | null;
  anotherBoolean: boolean | null;
  anArray: string[] | null;
  anotherArray: string[] | null;  
};

export const AN_ENTITY: CommonEntityData = {
  aString: 'foo',
  anotherString: 'bar',
  aFullTextString: 'The quick brown fox jumped over the lazy dog.',
  anotherFullTextString: 'The five boxing wizards jump quickly.',
  aNumber: 42,
  anotherNumber: 23,
  aBoolean: true,
  anotherBoolean: false,
  anArray: [ 'alfa', 'bravo', 'charlie'],
  anotherArray: [ 'bravo', 'charlie', 'delta' ]
};

export const ANOTHER_ENTITY: CommonEntityData = {
  aString: 'bar',
  anotherString: 'baz',
  aFullTextString: 'How vexingly quick daft zebras jump!',
  anotherFullTextString: 'Pack my box with five dozen liquor jugs.',
  aNumber: 23,
  anotherNumber: 13,
  aBoolean: true,
  anotherBoolean: true,
  anArray: [ 'bravo', 'charlie', 'delta' ],
  anotherArray: [ 'charlie', 'delta', 'echo' ]
};

export const A_THIRD_ENTITY: CommonEntityData = {
  aString: 'baz',
  anotherString: 'qux',
  aFullTextString: 'Sphinx of black quartz, judge my vow.',
  anotherFullTextString: 'Mr. Jock, TV quiz Ph.D., bags few lynx.',
  aNumber: 13,
  anotherNumber: 7,
  aBoolean: false,
  anotherBoolean: false,
  anArray: [ 'charlie', 'delta', 'echo' ],
  anotherArray: [ 'delta', 'echo', 'foxtrot' ]
};

export const A_PARTIAL_ENTITY: CommonEntityData = {
  aString: 'foo',
  anotherString: null,
  aFullTextString: 'The quick brown fox jumped over the lazy dog.',
  anotherFullTextString: null,
  aNumber: 42,
  anotherNumber: null,
  aBoolean: true,
  anotherBoolean: null,
  anArray: [ 'alfa', 'bravo', 'charlie'],
  anotherArray: null
};

export const AN_EMPTY_ENTITY: CommonEntityData = {
  aString: null,
  anotherString: null,
  aFullTextString: null,
  anotherFullTextString: null,
  aNumber: null,
  anotherNumber: null,
  aBoolean: null,
  anotherBoolean: null,
  anArray: null,
  anotherArray: null
};

export const AN_ESCAPED_ENTITY: CommonEntityData = {
  aString: "foo ,.<>{}[]\"':;!@#$%^*()-+=~& bar",
  anotherString: null,
  aFullTextString: "zany ,.<>{}[]\"':;!@#$%^&*()-+=~| fox",
  anotherFullTextString: null,
  aNumber: null,
  anotherNumber: null,
  aBoolean: null,
  anotherBoolean: null,
  anArray: [ 'alfa ,.<>{}[]"\':;!@#$%^&*()-+=~ bravo', 'charlie delta' ],
  anotherArray: null
};

export async function loadTestHash(client: Client, key: string, data: CommonEntityData) {

  let command: string[] = [];

  for (let field in data) {
    let value = (data as any)[field];
    if (value !== null) {
      if (typeof value === 'boolean') command.push(field, value ? '1' : '0');
      if (typeof value === 'number') command.push(field, value.toString());
      if (typeof value === 'string') command.push(field, value);
      if (Array.isArray(value)) command.push(field, value.join('|'));
    }
  }

  if (command.length > 0) await saveHash(client, key, command);
}

export async function loadTestJson(client: Client, key: string, data: CommonEntityData) {

  let json: any = {};

  for (let field in data) {
    let value = (data as any)[field];
    if (value !== null) json[field] = value;
  }

  await saveJson(client, key, JSON.stringify(json));
}

export function expectEntityMatches(entity: CommonEntity, data: CommonEntityData ) {
  expect(entity.aString).toBe(data.aString ?? null);
  expect(entity.anotherString).toBe(data.anotherString ?? null);
  expect(entity.aFullTextString).toBe(data.aFullTextString ?? null);
  expect(entity.anotherFullTextString).toBe(data.anotherFullTextString ?? null);
  expect(entity.aNumber).toBe(data.aNumber ?? null);
  expect(entity.anotherNumber).toBe(data.anotherNumber ?? null);
  expect(entity.aBoolean).toBe(data.aBoolean ?? null);
  expect(entity.anotherBoolean).toBe(data.anotherBoolean ?? null);
  expect(entity.anArray).toEqual(data.anArray ?? null);
  expect(entity.anotherArray).toEqual(data.anotherArray ?? null);
}

export function sortByEntityId(a: Entity, b: Entity): number {
  if (a.entityId < b.entityId) return -1
  if (a.entityId > b.entityId) return 1;
  return 0;
}
