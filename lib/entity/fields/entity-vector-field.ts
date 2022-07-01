import { EntityField } from "./entity-field";
import { RedisHashData, RedisJsonData } from "../../client";

export class EntityVectorField extends EntityField {
  toRedisJson(): RedisJsonData {
    throw Error(`Vector field not supported for JSON`);
  }

  fromRedisJson(value: any) {
    throw Error(`Vector field not supported for JSON`);
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
