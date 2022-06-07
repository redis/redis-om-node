import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import Point from "../point";
import { RedisHashData, RedisJsonData } from "../../client";

const IS_COORD_PAIR = /^-?\d+(\.\d*)?,-?\d+(\.\d*)?$/;

class EntityPointField extends EntityField {
  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.valueAsString;
    return data;
  };

  fromRedisJson(value: any) {
    if (value === null) {
      this.value = null;
    } else if (value.toString().match(IS_COORD_PAIR)) {
      const [longitude, latitude] = value.split(',').map(Number.parseFloat);
      this.value = { longitude, latitude };
    } else {
      throw Error(`Non-point value of '${value}' read from Redis for point field.`);
    }
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsString;
    return data;
  };

  fromRedisHash(value: string) {
    if (value.match(IS_COORD_PAIR)) {
      const [longitude, latitude] = value.split(',').map(Number.parseFloat);
      this.value = { longitude, latitude };
    } else {
      throw Error(`Non-point value of '${value}' read from Redis for point field.`);
    }
  }

  protected validateValue(value: EntityValue) {
    super.validateValue(value);
    if (value !== null) {
      if (!this.isPoint(value))
        throw Error(`Expected value with type of 'point' but received '${value}'.`);
      // As per https://redis.io/commands/geoadd/ and local testing
      // Valid latitudes are from -85.05112878 to 85.05112878 degrees (*NOT* -90 to +90)
      const { longitude, latitude } = value as Point;
      if (Math.abs(latitude) > 85.05112878 || Math.abs(longitude) > 180)
        throw Error(`Expected value with valid 'point' but received '${longitude},${latitude}'.`);
    }
  }

  private isPoint(value: any) {
    return this.isNumber(value.longitude) && this.isNumber(value.latitude);
  }

  private get valueAsString(): string {
    const { longitude, latitude } = this.value as Point;
    return `${longitude},${latitude}`;
  }
}

export default EntityPointField;
