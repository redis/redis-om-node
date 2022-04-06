import EntityField from "./entity-field";
import EntityValue from "../entity-value";

class EntityBooleanField extends EntityField {
  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isBoolean(value))
      throw Error(`Expected value with type of 'boolean' but received '${value}'.`);
  }
}

export default EntityBooleanField;
