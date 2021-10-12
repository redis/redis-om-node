import { saveHash } from './redis-helper';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from '../../lib/schema/schema';

import { EntityId, EntityKey, EntityConstructor, EntityPrefix } from '../../lib/entity/entity-types';
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
  aString?: string;
  anotherString?: string;
  aFullTextString?: string;
  anotherFullTextString?: string;
  aNumber?: number;
  anotherNumber?: number;
  aBoolean?: boolean;
  anotherBoolean?: boolean;
  anArray?: string[];
  anotherArray?: string[];  
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
  aFullTextString: 'The quick brown fox jumped over the lazy dog.',
  aNumber: 42,
  aBoolean: true,
  anArray: [ 'alfa', 'bravo', 'charlie'],
};

export const AN_EMPTY_ENTITY: CommonEntityData = {};

export const AN_ESCAPED_ENTITY: CommonEntityData = {
  aString: "K ,.<>{}[]\"':;!@#$%^*()-+=~| Y",
  aFullTextString: "Big ,.<>{}[]\"':;!@#$%^&*()-+=~| foot",
  anArray: [ 'riv ,.<>{}[]"\':;!@#$%^&*()-+=~ er', 'ken  tucky' ]
};

export async function loadTestData(client: Client, key: string, data: CommonEntityData) {

  let command: string[] = [];

  for (let field in data) {
    let value = (data as any)[field];
    if (typeof value === 'boolean') {
      command.push(field, value ? '1' : '0');
    } else if (typeof value === 'number') {
      command.push(field, value.toString());
    } else if (Array.isArray(value)) {
      command.push(field, value.join('|'));
    } else {
      command.push(field, value);
    }
  };

  if (command.length > 0) await saveHash(client, key, command);
}









export interface Bigfoot {
  title?: string | null;
  county?: string | null;
  state?: string | null;
  eyewitness?: boolean | null;
  temperature?: number | null;
  tags?: string[] | null;
  moreTags?: string[] | null;
}

export class Bigfoot extends Entity {}

export function createBigfootSchema(): Schema<Bigfoot> {
  return new Schema<Bigfoot>(
    Bigfoot, {
      title: { type: 'string', textSearch: true },
      county: { type: 'string' },
      state: { type: 'string', separator: '&' },
      eyewitness: { type: 'boolean' },
      temperature: { type: 'number' },
      tags: { type: 'array' },
      moreTags: { type: 'array', separator: '&' }
    }, {
      dataStructure: 'HASH'
    });
  }
  
export interface BigfootJson {
  title?: string | null;
  county?: string | null;
  state?: string | null;
  eyewitness?: boolean | null;
  temperature?: number | null;
  tags?: string[] | null;
  moreTags?: string[] | null;
}

export class BigfootJson extends Entity {}

export function createBigfootJsonSchema(): Schema<Bigfoot> {
  return new Schema<BigfootJson>(
    BigfootJson, {
      title: { type: 'string', textSearch: true },
      county: { type: 'string' },
      state: { type: 'string', separator: '&' },
      eyewitness: { type: 'boolean' },
      temperature: { type: 'number' },
      tags: { type: 'array' },
      moreTags: { type: 'array', separator: '&' }
    }, {
      dataStructure: 'JSON'
    });
}

export function sortByEntityId(a: Bigfoot, b: Bigfoot): number {
  if (a.entityId < b.entityId) return -1
  if (a.entityId > b.entityId) return 1;
  return 0;
}

export function expectMatchesSighting(actualEntity: Bigfoot, expectedId: EntityId, expectedSighting: BigfootSightingData) {
  expect(actualEntity.entityId).toBe(expectedId);
  expect(actualEntity.title).toBe(expectedSighting.title ?? null);
  expect(actualEntity.county).toBe(expectedSighting.county ?? null);
  expect(actualEntity.state).toBe(expectedSighting.state ?? null);
  expect(actualEntity.eyewitness).toBe(expectedSighting.eyewitness ?? null);
  expect(actualEntity.temperature).toBe(expectedSighting.temperature ?? null);
  expect(actualEntity.tags).toEqual(expectedSighting.tags ?? null);
  expect(actualEntity.moreTags).toEqual(expectedSighting.moreTags ?? null);
}

export type BigfootSightingData = {
  title?: string;
  county?: string;
  state?: string;
  eyewitness?: boolean;
  temperature?: number;
  tags?: string[];
  moreTags?: string[];
};

export async function addBigfootSighting(client: Client, key: string, sighting: BigfootSightingData) {
  let command: string[] = [];
  if (sighting.title !== undefined) command.push('title', sighting.title);
  if (sighting.county !== undefined) command.push('county', sighting.county);
  if (sighting.state !== undefined) command.push('state', sighting.state);
  if (sighting.eyewitness !== undefined) command.push('eyewitness', sighting.eyewitness ? '1' : '0');
  if (sighting.temperature !== undefined) command.push('temperature', sighting.temperature.toString());
  if (sighting.tags !== undefined) command.push('tags', sighting.tags.join('|'));
  if (sighting.moreTags !== undefined) command.push('moreTags', sighting.moreTags.join('&'));
  await saveHash(client, key, command);
};

export const AN_ENTITY_ID: EntityId = '1';
export const AN_ENTITY_KEY: EntityKey = `Bigfoot:${AN_ENTITY_ID}`;
export const A_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen out by the Walmart",
  county: "Athens",
  state: "OH",
  eyewitness: true,
  temperature: 75,
  tags: [ 'walmart', 'ohio' ],
  moreTags: [ 'walmart', 'ohio' ]
};

export const ANOTHER_ENTITY_ID: EntityId = '2';
export const ANOTHER_ENTITY_KEY: EntityKey = `Bigfoot:${ANOTHER_ENTITY_ID}`;
export const ANOTHER_BIGFOOT_SIGHTING : BigfootSightingData= {
  title: "Bigfoot was seen out by the Piggly Wiggly",
  county: "Ashland",
  state: "OH",
  eyewitness: false,
  temperature: 87,
  tags: [ 'piggly', 'wiggly', 'ohio' ],
  moreTags: [ 'piggly', 'wiggly', 'ohio' ]
};

export const A_THIRD_ENTITY_ID: EntityId = '3';
export const A_THIRD_ENTITY_KEY: EntityKey = `Bigfoot:${A_THIRD_ENTITY_ID}`;
export const A_THIRD_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen swimming in the river",
  county: "Ashland",
  state: "KY",
  eyewitness: true,
  temperature: 93,
  tags: [ 'river', 'kentucky' ],
  moreTags: [ 'river', 'kentucky' ]
};

export const A_PARTIAL_ENTITY_ID: EntityId = '4';
export const A_PARTIAL_ENTITY_KEY: EntityKey = `Bigfoot:${A_PARTIAL_ENTITY_ID}`;
export const A_PARTIAL_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen lounging in the pond"
};

export const AN_EMPTY_ENTITY_ID: EntityId = '5';
export const AN_EMPTY_ENTITY_KEY: EntityKey = `Bigfoot:${AN_EMPTY_ENTITY_ID}`;
export const AN_EMPTY_BIGFOOT_SIGHTING: BigfootSightingData = {};

export const AN_ESCAPED_ENTITY_ID: EntityId = '6';
export const AN_ESCAPED_ENTITY_KEY: EntityKey = `Bigfoot:${AN_ESCAPED_ENTITY_ID}`;
export const AN_ESCAPED_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Big ,.<>{}[]\"':;!@#$%^&*()-+=~| foot",
  county: "Ash ,.<>{}[]\"':;!@#$%^&*()-+=~ land",
  state: "K ,.<>{}[]\"':;!@#$%^*()-+=~| Y",
  eyewitness: true,
  temperature: 93,
  tags: [ 'riv ,.<>{}[]"\':;!@#$%^&*()-+=~ er', 'ken  tucky' ],
  moreTags: [ 'riv ,.<>{}[]"\':;!@#$%^*()-+=~| er', 'ken  tucky' ]
};
