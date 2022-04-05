import EntityValue from "./entity-value";

abstract class EntityField {

  private _alias: string;
  private _value: EntityValue;

  constructor(alias: string, value?: EntityValue) {
    this._alias = alias;
    this._value = value ?? null;
  }

  get alias() {
    return this._alias;
  }

  get value(): EntityValue {
    return this._value;
  }

  set value(value: EntityValue) {
    this.valdiateValue(value);
    this._value = this.convertValue(value);
  };

  protected convertValue(value: EntityValue): EntityValue{
    return value;
  }

  protected valdiateValue(value: EntityValue) {
    if (value === undefined) throw Error(`Property cannot be set to undefined. Use null instead.`);
  }

  protected isStringable(value: EntityValue) {
    return this.isString(value) || this.isNumber(value) || this.isBoolean(value);
  }

  protected isString(value: EntityValue) {
    return typeof(value) === 'string';
  }

  protected isNumber(value: EntityValue) {
    return typeof(value) === 'number';
  }

  protected isBoolean(value: EntityValue) {
    return typeof(value) === 'boolean';
  }
}

export default EntityField;
