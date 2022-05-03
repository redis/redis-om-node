import Entity from "../../entity/entity";
import Schema from "../schema";

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

  protected buildField(
    type: 'TEXT' | 'NUMERIC' | 'TAG' | 'GEO',
    separator?: string,
    sortable?: boolean,
  ): Array<string> {
    const result: Array<string> = [type]
    if (separator) {
      result.push('SEPARATOR', separator)
    }
    if (sortable) {
      result.push('SORTABLE')
    }
    return result
  }
}
