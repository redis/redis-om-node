import EntityField from "./entity-field";
import EntityValue from "./entity-value";

class EntityTextField extends EntityField {
  protected convertValue(value: EntityValue): EntityValue {
    if (value !== null && this.isStringable(value)) {
      return value.toString()
    }

    return super.convertValue(value);
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isStringable(value))
      throw Error(`Expected value with type of 'text' but received '${value}'.`);
  }
}

export default EntityTextField;
