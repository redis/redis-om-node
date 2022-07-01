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
  BinaryFieldDefinition,
} from "../definition";
import { Schema } from "../schema";

export abstract class SchemaBuilder<TEntity extends Entity> {

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

  protected buildVector(field: BinaryFieldDefinition) {
    // assume that indexed: false takes precedence
    if (!(field.indexed ?? this.schema.indexedDefault) || !field.vector) {
      return ['NOINDEX']
    }

    const results = [
      'TYPE', field.vector.vector_type ?? 'FLOAT32',
      'DIM', field.vector.dim.toString(),
      'DISTANCE_METRIC', field.vector.distance_metric,
    ]

    if (field.vector.initial_cap) {
      results.push('INITIAL_CAP', field.vector.initial_cap.toString())
    }

    switch (field.vector.algorithm) {
      case 'FLAT':
        if (field.vector.block_size) {
          results.push('BLOCK_SIZE', field.vector.block_size.toString())
        }
        break

      case 'HNSW':
        if (field.vector.m) {
          results.push('M', field.vector.m.toString())
        }
        if (field.vector.ef_construction) {
          results.push('EF_CONSTRUCTION', field.vector.ef_construction.toString())
        }
        if (field.vector.ef_runtime) {
          results.push('EF_RUNTIME', field.vector.ef_runtime.toString())
        }
        break
    }

    return [
      'VECTOR',
      field.vector.algorithm,
      results.length.toString(),
      ...results,
    ]
  }
}
