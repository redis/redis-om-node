import { EntityField } from "./entity-field";
import { EntityValue } from "../entity-value";
import { RedisHashData, RedisJsonData } from "../../client";

export class EntityVectorField extends EntityField {
  // TODO: is vector index supported with JSON? what format do we send binary data in?
  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = data[this.name] = this.value as Buffer
    return data;
  }

  fromRedisJson(value: any) {
    this.value = Buffer.from(value.toString(), 'binary');
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.value as Buffer
    return data;
  }

  fromRedisHash(value: string | Buffer) {
    this.value = Buffer.from(value.toString(), 'binary');
  }
}
