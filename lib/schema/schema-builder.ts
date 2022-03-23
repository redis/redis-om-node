import Entity from "../entity/entity";
import Schema from "./schema";
import { Sortable, FieldDefinition, Separable } from './schema-definitions';

export default class SchemaBuilder<TEntity extends Entity> {

  private schema: Schema<TEntity>;

  private hashSchemaEntryBuilders = {
    'date': (fieldDef: FieldDefinition) => this.buildSortableNumeric(fieldDef as Sortable),
    'boolean': (fieldDef: FieldDefinition) => this.buildSortableTag(fieldDef as Sortable),
    'number': (fieldDef: FieldDefinition) => this.buildSortableNumeric(fieldDef as Sortable),
    'point': () => this.buildGeo(),
    'string[]': (fieldDef: FieldDefinition) => this.buildSeparableTag(fieldDef as Separable),
    'string': (fieldDef: FieldDefinition) => this.buildSeparableAndSortableTag(fieldDef as Sortable),
    'text': (fieldDef: FieldDefinition) => this.buildSortableText(fieldDef as Sortable),
  };

  private jsonSchemaEntryBuilders = {
    'date': (fieldDef: FieldDefinition) => this.buildSortableNumeric(fieldDef as Sortable),
    'boolean': () => this.buildTag(),
    'number': (fieldDef: FieldDefinition) => this.buildSortableNumeric(fieldDef as Sortable),
    'point': () => this.buildGeo(),
    'string[]': () => this.buildTag(),
    'string': (fieldDef: FieldDefinition) => this.buildSeparableTag(fieldDef as Separable),
    'text': (fieldDef: FieldDefinition) => this.buildSortableText(fieldDef as Sortable),
  };

  constructor(schema: Schema<TEntity>) {
    this.schema = schema;
  }

  get redisSchema(): string[] {
    if (this.schema.dataStructure === 'JSON') return this.buildJsonSchema()
    if (this.schema.dataStructure === 'HASH') return this.buildHashSchema();
    throw Error(`'${this.schema.dataStructure}' in an invalid data structure. Valid data structures are 'HASH' and 'JSON'.`);
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
    return [ fieldAlias, ...this.hashSchemaEntryBuilders[fieldType](fieldDef) ];
  }

  private buildJsonSchemaEntry(field: string): string[] {
    let fieldDef: FieldDefinition = this.schema.definition[field];
    let fieldType = fieldDef.type;
    let fieldAlias = fieldDef.alias ?? field;
    let fieldPath = `\$.${fieldAlias}${fieldType === 'string[]' ? '[*]' : ''}`;
    return [ fieldPath, 'AS', fieldAlias, ...this.jsonSchemaEntryBuilders[fieldType](fieldDef) ];
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
