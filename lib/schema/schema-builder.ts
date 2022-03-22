import Entity from "../entity/entity";
import Schema from "./schema";
import { StringArrayField, FieldDefinition, NumericField, StringField } from './schema-definitions';

export default class SchemaBuilder<TEntity extends Entity> {

  private schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>) {
    this.schema = schema;
  }

  get redisSchema(): string[] {
    if (this.schema.dataStructure === 'JSON') return this.buildJsonSchema()
    if (this.schema.dataStructure === 'HASH') return this.buildHashSchema();
    throw Error("'FOO' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.");
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
    let schemaEntry: string[] = [];

    let fieldDef: FieldDefinition = this.schema.definition[field];
    let fieldType = fieldDef.type;
    let fieldAlias = fieldDef.alias ?? field;

    schemaEntry.push(fieldAlias)

    if (fieldType === 'date') {
      schemaEntry.push('NUMERIC');
      if ((fieldDef as StringField).sortable) schemaEntry.push('SORTABLE');
    }
    
    if (fieldType === 'boolean') {
      schemaEntry.push('TAG');
      if ((fieldDef as StringField).sortable) schemaEntry.push('SORTABLE');
    }
    
    if (fieldType === 'number') {
      schemaEntry.push('NUMERIC');
      if ((fieldDef as NumericField).sortable) schemaEntry.push('SORTABLE');
    }
    
    if (fieldType === 'point') {
      schemaEntry.push('GEO');
    }
    
    if (fieldType === 'string[]') {
      schemaEntry.push('TAG', 'SEPARATOR', (fieldDef as StringArrayField).separator ?? '|');
      if ((fieldDef as StringField).sortable) schemaEntry.push('SORTABLE');
    }

    if (fieldType === 'string') {
      schemaEntry.push('TAG', 'SEPARATOR', (fieldDef as StringField).separator ?? '|');
      if ((fieldDef as StringField).sortable) schemaEntry.push('SORTABLE');
    }
    
    if (fieldType === 'text') {
      schemaEntry.push('TEXT');
      if ((fieldDef as StringField).sortable) schemaEntry.push('SORTABLE');
    }

    return schemaEntry;
  }

  private buildJsonSchemaEntry(field: string): string[] {
    let schemaEntry: string[] = [];
  
    let fieldDef: FieldDefinition = this.schema.definition[field];
    let fieldType = fieldDef.type;
    let fieldAlias = fieldDef.alias ?? field;
    let fieldPath = `\$.${fieldAlias}${fieldType === 'string[]' ? '[*]' : ''}`;

    schemaEntry.push(fieldPath, 'AS', fieldAlias);
    
    // TODO: add sortable here too

    if (fieldType === 'boolean') schemaEntry.push('TAG');
    if (fieldType === 'number') schemaEntry.push('NUMERIC');
    if (fieldType === 'point') schemaEntry.push('GEO');
    if (fieldType === 'date') schemaEntry.push('NUMERIC');
    if (fieldType === 'string[]') schemaEntry.push('TAG');
    if (fieldType === 'string') schemaEntry.push('TAG', 'SEPARATOR', (fieldDef as StringField).separator ?? '|');
    if (fieldType === 'text') schemaEntry.push('TEXT');

    return schemaEntry;
  }
}

