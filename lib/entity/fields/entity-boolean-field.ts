import { EntityField } from "./entity-field";
import { EntityValue } from "../entity-value";
import { RedisHashData } from "../../client";

export class EntityBooleanField extends EntityField {
  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.value ? '1' : '0'.toString();
    return data;
  };

  fromRedisHash(value: string | Buffer) {
    const str = value.toString()
    if (str === '0') {
      this.value = false;
    } else if (str === '1') {
      this.value = true;
    } else {
      throw Error(`Non-boolean value of '${value}' read from Redis for boolean field.`);
    }
  }

  protected validateValue(value: EntityValue) {
    super.validateValue(value);
    if (value !== null && !this.isBoolean(value))
      throw Error(`Expected value with type of 'boolean' but received '${value}'.`);
  }
}
