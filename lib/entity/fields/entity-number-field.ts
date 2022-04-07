import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { JsonData } from "../..";

class EntityNumberField extends EntityField {
  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isNumber(value))
      throw Error(`Expected value with type of 'number' but received '${value}'.`);
  }
}

export default EntityNumberField;
