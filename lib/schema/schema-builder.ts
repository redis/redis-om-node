import Entity from "../entity/entity";
import Schema from "./schema";
import { Sortable, FieldDefinition, Separable } from './definition/schema-definitions';

import * as logger from '../shims/logger'
import RedisError from "../errors";

export default class SchemaBuilder<TEntity extends Entity> {

  private schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>) {
    this.schema = schema;
  }

  get redisSchema(): string[] {
    if (this.schema.dataStructure === 'JSON') return this.buildJsonSchema()
    if (this.schema.dataStructure === 'HASH') return this.buildHashSchema();
    throw new RedisError(`'${this.schema.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);
  }

  private buildHashSchema() : string[] {
    let redisSchema: string[] = [];
    for (let field in this.schema.definition) {
      redisSchema.push(...this.buildHashSchemaEntry(field));
    }
    return redisSchema;
  }

  private buildJsonSchema(): string[] {
    let redisSchema: string[] = [];
    for (let field in this.schema.definition) {
      redisSchema.push(...this.buildJsonSchemaEntry(field));
    }
    return redisSchema;
  }

  private buildHashSchemaEntry(field: string) : string[] {
    let fieldDef: FieldDefinition = this.schema.definition[field];
    let fieldType = fieldDef.type;
    let fieldAlias = fieldDef.alias ?? field
    let fieldDetails: string[];

    switch (fieldType) {
      case 'date':
        fieldDetails = this.buildSortableNumeric(fieldDef as Sortable);
        break;
      case 'boolean':
        fieldDetails = this.buildSortableTag(fieldDef as Sortable);
        break;
      case 'number':
        fieldDetails = this.buildSortableNumeric(fieldDef as Sortable);
        break;
      case 'point':
        fieldDetails = this.buildGeo();
        break;
      case 'string[]':
        fieldDetails = this.buildSeparableTag(fieldDef as Separable);
        break;
      case 'string':
        fieldDetails = this.buildSeparableAndSortableTag(fieldDef as Sortable & Separable);
        break;
      case 'text':
        fieldDetails = this.buildSortableText(fieldDef as Sortable);
        break;
    };

    return [ fieldAlias, ...fieldDetails ];
  }

  private buildJsonSchemaEntry(field: string): string[] {
    let fieldDef: FieldDefinition = this.schema.definition[field];
    let fieldType = fieldDef.type;
    let fieldAlias = fieldDef.alias ?? field;
    let fieldPath = `\$.${fieldAlias}${fieldType === 'string[]' ? '[*]' : ''}`;
    let fieldDetails: string[];

    switch (fieldType) {
      case 'date':
        fieldDetails = this.buildSortableNumeric(fieldDef as Sortable);
        break;
      case 'boolean':
        if ((fieldDef as Sortable).sortable)
          logger.warn(`You have marked the boolean field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildTag();
        break;
      case 'number':
        fieldDetails = this.buildSortableNumeric(fieldDef as Sortable);
        break;
      case 'point':
        fieldDetails = this.buildGeo();
        break;
      case 'string[]':
        fieldDetails = this.buildTag();
        break;
      case 'string':
        if ((fieldDef as Sortable).sortable)
          logger.warn(`You have marked the string field '${field}' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored.`);
        fieldDetails = this.buildSeparableTag(fieldDef as Separable)
        break;
      case 'text':
        fieldDetails = this.buildSortableText(fieldDef as Sortable)
        break;
    }

    return [ fieldPath, 'AS', fieldAlias, ...fieldDetails ];
  }

  private buildSortableNumeric(fieldDef: Sortable): string[] {
    return this.buildSortableField('NUMERIC', fieldDef.sortable);
  }

  private buildTag(): string[] {
    return this.buildField('TAG');
  }

  private buildSortableTag(fieldDef: Sortable): string[] {
    return this.buildSortableField('TAG', fieldDef.sortable);
  }

  private buildSeparableTag(fieldDef: Separable): string[] {
    return this.buildSeparableField('TAG', fieldDef.separator);
  }

  private buildSeparableAndSortableTag(fieldDef: Separable & Sortable): string[] {
    return this.buildSeparableAndSortableField('TAG', fieldDef.separator, fieldDef.sortable);
  }

  private buildSortableText(fieldDef: Sortable): string[] {
    return this.buildSortableField('TEXT', fieldDef.sortable);
  }

  private buildGeo(): string[] {
    return this.buildField('GEO');
  }

  private buildField(type: 'TEXT' | 'NUMERIC' | 'TAG' | 'GEO'): string[] {
    return [type];
  }

  private buildSeparableField(type: 'TAG', separator?: string): string[] {
    return [type, 'SEPARATOR', separator ?? '|'];
  }

  private buildSortableField(type: 'TEXT' | 'NUMERIC' | 'TAG', sortable?: boolean): string[] {
    return sortable ? [type, 'SORTABLE'] : [type];
  }

  private buildSeparableAndSortableField(type: 'TAG', separator?: string, sortable?: boolean): string[] {
    let result = [type, 'SEPARATOR', separator ?? '|'];
    if (sortable) result.push('SORTABLE');
    return result;
  }
}
