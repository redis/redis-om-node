import Entity from '../../lib/entity/entity';
import Schema from '../../lib/schema/schema';

export class SimpleEntity extends Entity {}
export class FullTextEntity extends Entity {}
export class AliasedEntity extends Entity {}

export interface SimpleEntity {
  aString?: string | null;
  aNumber?: number | null;
  aBoolean?: boolean | null;
  anArray?: string[] | null;
}  

export interface FullTextEntity {
  aString?: string | null;
}  

export interface AliasedEntity {
  aString?: string | null;
  aNumber?: number | null;
  aBoolean?: boolean | null;
  anArray?: string[] | null;
}  

export const simpleSchema = new Schema(SimpleEntity, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  anArray: { type: 'array' }
});

export const fullTextSchema = new Schema(FullTextEntity, {
  aString: { type: 'string', textSearch: true },
});

export const aliasedSchema = new Schema(AliasedEntity, {
  aString: { type: 'string', alias: 'anotherString' },
  aNumber: { type: 'number', alias: 'anotherNumber' },
  aBoolean: { type: 'boolean', alias: 'anotherBoolean' },
  anArray: { type: 'array', alias: 'anotherArray' }
});
