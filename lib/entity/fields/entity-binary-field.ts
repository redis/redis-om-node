import { EntityField } from "./entity-field";
import { RedisHashData, RedisJsonData } from "../../client";
import { EntityValue } from "../entity-value";

export class EntityBinaryField extends EntityField {
  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = [...this.valueAsBuffer]
    return data;
  }

  fromRedisJson(value: any) {
    if (!this.isBuffer(value)) {
      throw Error(`Non-binary value of '${value}' read from Redis for binary field.`)
    }
    this.value = Buffer.from([...value]);
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsBuffer
    return data;
  }

  fromRedisHash(value: string | Buffer) {
    if (!this.isBuffer(value)) {
      throw Error(`Non-binary value of '${value}' read from Redis for binary field.`)
    }
    this.value = value as Buffer
  }

  protected validateValue(value: EntityValue) {
    super.validateValue(value);
    if (value !== null && !this.isBuffer(value))
      throw Error(`Expected value with type of 'binary' but received '${value}'.`);
  }

  private get valueAsBuffer(): Buffer {
    return this.value as Buffer
  }
}
