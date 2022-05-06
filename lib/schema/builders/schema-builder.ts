import Entity from "../../entity/entity";
import CaseSensitiveFieldDefinition from "../definition/casesensitive-field-definition";
import NoIndexFieldDefinition from "../definition/noindex-field-definition";
import NoStemFieldDefinition from "../definition/nostem-field-definition";
import PhoneticFieldDefinition from "../definition/phonetic-field-definition";
import SeparableFieldDefinition from "../definition/separable-field-definition";
import SortableFieldDefinition from "../definition/sortable-field-definition";
import UnNormalizedFieldDefinition from "../definition/unnormalized-field-definition";
import WeightFieldDefinition from "../definition/weight-field-definition";
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

  protected buildCaseInsensitive(field: CaseSensitiveFieldDefinition) {
    return field.casesensitive ? ['CASEINSENSITIVE'] : []
  }

  protected buildNoIndex(field: NoIndexFieldDefinition) {
    return field.noindex ? ['NOINDEX'] : []
  }

  protected buildNoStem(field: NoStemFieldDefinition) {
    return field.nostem ? ['NOSTEM'] : []
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

  protected buildUnNormalized(field: UnNormalizedFieldDefinition) {
    return field.unf ? ['UNF'] : []
  }

  protected buildWeight(field: WeightFieldDefinition) {
    return field.weight ? ['WEIGHT', field.weight.toString()] : []
  }
}
