import { EntityField } from "./entity-field";
import { RedisHashData, RedisJsonData } from "../../client";

export class EntityBinaryField extends EntityField {
  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.valueAsBuffer.toString('base64')
    return data;
  }

  fromRedisJson(value: any) {
    if (value === null) this.value = Buffer.from(value, 'base64');
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsBuffer
    return data;
  }

  fromRedisHash(value: string | Buffer) {
    this.value = Buffer.from(value.toString(), 'binary');
  }

  private get valueAsBuffer(): Buffer {
    return this.value as Buffer
  }
}
