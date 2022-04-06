import EntityField from "./entity-field";
import EntityValue from "../entity-value";

class EntityStringArrayField extends EntityField {
  protected convertValue(value: EntityValue): EntityValue {
    if (this.isArray(value)) {
      return (value as string[]).map((v: any) => v.toString());
    }

    return super.convertValue(value);
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isArray(value))
      throw Error(`Expected value with type of 'string[]' but received '${value}'.`);
  }

  private isArray(value: any) {
    return Array.isArray(value);
  }
}

export default EntityStringArrayField;
