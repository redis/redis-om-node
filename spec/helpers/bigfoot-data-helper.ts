import { saveHash } from './redis-helper';

import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from '../../lib/schema/schema';

import { EntityId, EntityKey } from '../../lib/entity/entity-types';

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
      title: { path: '$.title', type: 'string', textSearch: true },
      county: { path: '$.county', type: 'string' },
      state: { path: '$.state', type: 'string', separator: '&' },
      eyewitness: { path: '$.eyewitness', type: 'boolean' },
      temperature: { path: '$.temperature', type: 'number' },
      tags: { path: '$.tags', type: 'array' },
      moreTags: { path: '$.moreTags', type: 'array', separator: '&' }
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
