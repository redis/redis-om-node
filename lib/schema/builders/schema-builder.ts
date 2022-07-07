import { Entity } from "../../entity/entity";
import {
  BaseFieldDefinition,
  CaseSensitiveFieldDefinition,
  StemmingFieldDefinition,
  PhoneticFieldDefinition,
  SeparableFieldDefinition,
  SortableFieldDefinition,
  NormalizedFieldDefinition,
  WeightFieldDefinition,
} from "../definition";
import { EmbeddedSchema, Schema } from "../schema";

export abstract class SchemaBuilder<TEntity extends Entity> {

  protected schema: Schema<TEntity> | EmbeddedSchema<TEntity>;
  protected parentField?: string;


  constructor(schema: Schema<TEntity> | EmbeddedSchema<TEntity>, parentField?: string) {
    this.schema = schema;
    this.parentField = parentField;
  }

  get redisSchema(): Array<string> {
    const redisSchema: Array<string> = [];
    Object.keys(this.schema.definition).forEach(field => {
      redisSchema.push(...this.buildEntry(field));
    })
    return redisSchema;
  }

  protected abstract buildEntry(field: string, parentField?: string): Array<string>;

  protected buildCaseInsensitive(field: CaseSensitiveFieldDefinition) {
    return field.caseSensitive ? ['CASESENSITIVE'] : []
  }

  protected buildIndexed(field: BaseFieldDefinition) {
    return field.indexed ?? this.schema.indexedDefault ? [] : ['NOINDEX']
  }

  protected buildStemming(field: StemmingFieldDefinition) {
    return field.stemming ?? true ? [] : ['NOSTEM']
  }

  protected buildPhonetic(field: PhoneticFieldDefinition) {
    return field.matcher ? ['PHONETIC', field.matcher] : []
  }

  protected buildSeparable(field: SeparableFieldDefinition) {
    return ['SEPARATOR', field.separator || '|']
  }

  protected buildSortable(field: SortableFieldDefinition) {
    return field.sortable ? ['SORTABLE'] : []
  }

  protected buildNormalized(field: NormalizedFieldDefinition) {
    return field.normalized ?? true ? [] : ['UNF']
  }

  protected buildWeight(field: WeightFieldDefinition) {
    return field.weight ? ['WEIGHT', field.weight.toString()] : []
  }
}
