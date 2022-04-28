import Entity from "../../entity/entity";
import Schema from "../schema";
import SeparableFieldDefinition from "../definition/separable-field-definition";
import SortableFieldDefinition from "../definition/sortable-field-definition";

export default abstract class SchemaBuilder<TEntity extends Entity> {

  protected schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>) {
    this.schema = schema;
  }

  get redisSchema(): Array<string> {
    const redisSchema: Array<string> = [];
    Object.keys(this.schema.definition).forEach(field => {
      redisSchema.push(...this.buildEntry(field));
    })
    return redisSchema;
  }

  protected abstract buildEntry(field: string): Array<string>;

  protected buildSortableNumeric(fieldDef: SortableFieldDefinition): Array<string> {
    return this.buildSortableField('NUMERIC', fieldDef.sortable);
  }

  protected buildTag(): Array<string> {
    return this.buildField('TAG');
  }

  protected buildSeparableTag(fieldDef: SeparableFieldDefinition): Array<string> {
    return this.buildSeparableField('TAG', fieldDef.separator);
  }

  protected buildSortableTag(fieldDef: SortableFieldDefinition): Array<string> {
    return this.buildSortableField('TAG', fieldDef.sortable);
  }

  protected buildSeparableAndSortableTag(fieldDef: SeparableFieldDefinition & SortableFieldDefinition): Array<string> {
    return this.buildSeparableAndSortableField('TAG', fieldDef.separator, fieldDef.sortable);
  }

  protected buildSortableText(fieldDef: SortableFieldDefinition): Array<string> {
    return this.buildSortableField('TEXT', fieldDef.sortable);
  }

  protected buildGeo(): Array<string> {
    return this.buildField('GEO');
  }

  private buildField(type: 'TEXT' | 'NUMERIC' | 'TAG' | 'GEO'): Array<string> {
    return [type];
  }

  private buildSeparableField(type: 'TAG', separator?: string): Array<string> {
    return [type, 'SEPARATOR', separator ?? '|'];
  }

  private buildSortableField(type: 'TEXT' | 'NUMERIC' | 'TAG', sortable?: boolean): Array<string> {
    return sortable ? [type, 'SORTABLE'] : [type];
  }

  private buildSeparableAndSortableField(type: 'TAG', separator?: string, sortable?: boolean): Array<string> {
    const result = [type, 'SEPARATOR', separator ?? '|'];
    if (sortable) result.push('SORTABLE');
    return result;
  }
}
