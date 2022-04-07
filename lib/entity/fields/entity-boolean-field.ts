import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { RedisHashData } from "../../client";

class EntityBooleanField extends EntityField {
  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.value ? '1' : '0'.toString();
    return data;
  };

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isBoolean(value))
      throw Error(`Expected value with type of 'boolean' but received '${value}'.`);
  }
}

export default EntityBooleanField;
