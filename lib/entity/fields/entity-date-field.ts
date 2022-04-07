import EntityField from "./entity-field";
import EntityValue from "../entity-value";

class EntityDateField extends EntityField {
  protected convertValue(value: EntityValue): EntityValue {
    if (this.isString(value)) {
      return new Date(value as string);
    }

    if (this.isNumber(value)) {
      const newValue = new Date();
      newValue.setTime(value as number);
      return newValue;
    }

    return super.convertValue(value);
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isDateable(value))
      throw Error(`Expected value with type of 'date' but received '${value}'.`);
  }

  private isDateable(value: EntityValue) {
    return this.isDate(value) || this.isNumber(value) || this.isString(value);
  }

  private isDate(value: EntityValue) {
    return value instanceof Date;
  }
}

export default EntityDateField;
