import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import Point from "../point";
import { RedisHashData, RedisJsonData } from "../../client";

class EntityPointField extends EntityField {
  toRedisJson(): RedisJsonData {
    let data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.valueAsString;
    return data;
  };

  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.valueAsString;
    return data;
  };

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isPoint(value))
      throw Error(`Expected value with type of 'point' but received '${value}'.`);
  }

  private isPoint(value: any) {
    return this.isNumber(value.longitude) && this.isNumber(value.latitude);
  }

  private get valueAsString(): string {
    let { longitude, latitude } = this.value as Point;
    return `${longitude},${latitude}`;
  }
}

export default EntityPointField;
