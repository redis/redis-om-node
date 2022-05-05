import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { RedisHashData, RedisJsonData } from "../../client";

class EntityDateField extends EntityField {
  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.valueAsNumber;
    return data;
  }

  fromRedisJson(value: any) {
    if (this.isNumber(value) || value === null) this.value = value;
    else throw Error(`Non-numeric value of '${value}' read from Redis for date field.`);
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsNumber.toString();
    return data;
  }

  fromRedisHash(value: string) {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) throw Error(`Non-numeric value of '${value}' read from Redis for date field.`);
    const date = new Date();
    date.setTime(parsed * 1000);
    this.value = date;
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isDateable(value))
      throw Error(`Expected value with type of 'date' but received '${value}'.`);
  }

  protected convertValue(value: EntityValue): EntityValue {
    if (this.isString(value)) {
      return new Date(value as string);
    }

    if (this.isNumber(value)) {
      const newValue = new Date();
      newValue.setTime(value as number * 1000);
      return newValue;
    }

    return super.convertValue(value);
  }

  private isDateable(value: EntityValue) {
    return this.isDate(value) || this.isNumber(value) || this.isString(value);
  }

  private isDate(value: EntityValue) {
    return value instanceof Date;
  }

  private get valueAsNumber(): number {
    return (this.value as Date).getTime() / 1000;
  }
}

export default EntityDateField;
