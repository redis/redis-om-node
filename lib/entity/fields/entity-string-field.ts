import EntityValue from "../entity-value";
import EntityStringishField from "./entity-stringish-field";

class EntityStringField extends EntityStringishField {
  protected validateValue(value: EntityValue) {
    super.validateValue(value);
    if (value !== null && !this.isStringable(value))
      throw Error(`Expected value with type of 'string' but received '${value}'.`);
  }
}

export default EntityStringField;
