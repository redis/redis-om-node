import Entity from "../../entity/entity";
import Schema from "../schema";
import SeparableFieldDefinition from "../definition/separable-field-definition";
import SortableFieldDefinition from "../definition/sortable-field-definition";


export default abstract class SchemaBuilder<TEntity extends Entity> {

  protected schema: Schema<TEntity>;

  constructor(schema: Schema<TEntity>) {
    this.schema = schema;
  }

  get redisSchema(): string[] {
    const redisSchema: string[] = [];
    for (const field in this.schema.definition) {
      redisSchema.push(...this.buildEntry(field));
    }
    return redisSchema;
  }

  protected abstract buildEntry(field: string): string[];

  protected buildSortableNumeric(fieldDef: SortableFieldDefinition): string[] {
    return this.buildSortableField('NUMERIC', fieldDef.sortable);
  }

  protected buildTag(): string[] {
    return this.buildField('TAG');
  }

  protected buildSeparableTag(fieldDef: SeparableFieldDefinition): string[] {
    return this.buildSeparableField('TAG', fieldDef.separator);
  }

  protected buildSortableTag(fieldDef: SortableFieldDefinition): string[] {
    return this.buildSortableField('TAG', fieldDef.sortable);
  }

  protected buildSeparableAndSortableTag(fieldDef: SeparableFieldDefinition & SortableFieldDefinition): string[] {
    return this.buildSeparableAndSortableField('TAG', fieldDef.separator, fieldDef.sortable);
  }

  protected buildSortableText(fieldDef: SortableFieldDefinition): string[] {
    return this.buildSortableField('TEXT', fieldDef.sortable);
  }

  protected buildGeo(): string[] {
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
    const result = [type, 'SEPARATOR', separator ?? '|'];
    if (sortable) result.push('SORTABLE');
    return result;
  }
}
