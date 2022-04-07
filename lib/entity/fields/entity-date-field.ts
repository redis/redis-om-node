import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { RedisHashData, RedisJsonData } from "../../client";

class EntityDateField extends EntityField {
  toRedisJson(): RedisJsonData {
    let data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.valueAsNumber;
    return data;
  };

  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsNumber.toString();
    return data;
  };

  protected convertValue(value: EntityValue): EntityValue {
    if (this.isString(value)) {
      return new Date(value as string);
    }

    if (this.isNumber(value)) {
      let newValue = new Date();
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

  private get valueAsNumber(): number {
    return (this.value as Date).getTime();
  }
}

export default EntityDateField;
