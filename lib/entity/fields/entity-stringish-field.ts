import EntityField from "./entity-field";
import EntityValue from "../entity-value";

class EntityStringishField extends EntityField {
  protected convertValue(value: EntityValue): EntityValue {
    if (value !== null && this.isStringable(value)) {
      return value.toString()
    }

    return super.convertValue(value);
  }

  protected isStringable(value: EntityValue) {
    return this.isString(value) || this.isNumber(value) || this.isBoolean(value);
  }
}

export default EntityStringishField;
