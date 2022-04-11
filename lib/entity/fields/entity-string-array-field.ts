import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { RedisHashData } from "../../client";
import StringArrayFieldDefinition from "../../schema/definition/string-array-field-definition";

class EntityStringArrayField extends EntityField {
  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    let separator = (this.fieldDef as StringArrayFieldDefinition).separator ?? '|';
    if (this.value !== null) data[this.name] = (this.value as string[]).join(separator);
    return data;
  };

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isArray(value))
      throw Error(`Expected value with type of 'string[]' but received '${value}'.`);
  }

  protected convertValue(value: EntityValue): EntityValue {
    if (this.isArray(value)) {
      return (value as string[]).map((v: any) => v.toString());
    }

    return super.convertValue(value);
  }

  private isArray(value: any) {
    return Array.isArray(value);
  }
}

export default EntityStringArrayField;
