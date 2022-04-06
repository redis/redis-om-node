import EntityField from "./entity-field";
import EntityValue from "../entity-value";

class EntityPointField extends EntityField {
  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isPoint(value))
      throw Error(`Expected value with type of 'point' but received '${value}'.`);
  }

  private isPoint(value: any) {
    return this.isNumber(value.longitude) && this.isNumber(value.latitude);
  }
}

export default EntityPointField;
