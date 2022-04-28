import { RedisHashData, RedisJsonData } from "../../client";
import FieldDefinition from "../../schema/definition/field-definition";
import EntityValue from "../entity-value";

abstract class EntityField {

  private _name: string;
  private _value: EntityValue = null;

  protected fieldDef: FieldDefinition;

  constructor(name: string, fieldDef: FieldDefinition, value?: EntityValue) {
    this.fieldDef = fieldDef;
    this.value = value ?? null;
    this._name = name;
  }

  get name(): string {
    return this.fieldDef.alias ?? this._name;
  }

  get value(): EntityValue {
    return this._value;
  }

  set value(value: EntityValue) {
    this.valdiateValue(value);
    this._value = this.convertValue(value);
  }

  toRedisJson(): RedisJsonData {
    const data: RedisJsonData = {};
    if (this.value !== null) data[this.name] = this.value;
    return data;
  }

  fromRedisJson(value: any) {
    this.value = value;
  }

  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = this.value.toString();
    return data;
  }

  fromRedisHash(value: string) {
    this.value = value;
  }

  protected valdiateValue(value: EntityValue) {
    if (value === undefined) throw Error(`Property cannot be set to undefined. Use null instead.`);
  }

  protected convertValue(value: EntityValue): EntityValue {
    return value;
  }

  protected isString(value: EntityValue) {
    return typeof value === 'string';
  }

  protected isNumber(value: EntityValue) {
    return typeof value === 'number';
  }

  protected isBoolean(value: EntityValue) {
    return typeof value === 'boolean';
  }
}

export default EntityField;
