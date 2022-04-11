import EntityData from "../entity/entity-data";
import { RedisJsonData, RedisHashData } from '../client';
import SchemaDefinition from "../schema/definition/schema-definition";
import FieldDefinition from "../schema/definition/field-definition";
import StringArrayFieldDefinition from "../schema/definition/string-array-field-definition";
import Point from "../entity/point";

class AbstractConverter {
  protected schemaDef: SchemaDefinition

  constructor(schemaDef: SchemaDefinition) {
    this.schemaDef = schemaDef;
  }
}

/** @internal */
export class HashConverter extends AbstractConverter {

  toEntityData(hashData: RedisHashData): EntityData {
    let entityData: EntityData = {};
    for (let fieldName in this.schemaDef) {
      let hashValue = hashData[fieldName];
      let fieldDef = this.schemaDef[fieldName]
      let fieldType = fieldDef.type;
      if (hashValue !== undefined) entityData[fieldName] = fromHashConverters[fieldType](hashValue, fieldDef)
    }
    return entityData;
  }
}

/** @internal */
export class JsonConverter extends AbstractConverter {

  toEntityData(jsonData: RedisJsonData): EntityData {
    let entityData: EntityData = {};
    if (jsonData === null) return entityData;
    for (let fieldName in this.schemaDef) {
      let jsonValue = jsonData[fieldName];
      let fieldDef = this.schemaDef[fieldName]
      let fieldType = fieldDef.type;
      if (jsonValue !== undefined && jsonValue !== null)
        entityData[fieldName] = fromJsonConverters[fieldType](jsonValue);
    }
    return entityData;
  }
}

let fromHashConverters = {
  'number': stringToNumber,
  'boolean': stringToBoolean,
  'string': (value: string) => value,
  'text': (value: string) => value,
  'point': stringToPoint,
  'date': stringToDate,
  'string[]': (value: string, fieldDef: FieldDefinition) => stringToStringArray(value, fieldDef as StringArrayFieldDefinition)
};

let fromJsonConverters = {
  'number': (value: any) => (value as number),
  'boolean': (value: any) => (value as boolean),
  'string': (value: any) => (value as string),
  'text': (value: any) => (value as string),
  'point': (value: any) => stringToPoint(value as string),
  'date': (value: any) => numberToDate(value as number),
  'string[]': (value: any) => (value as string[])
}

function stringToNumber(value: string): number {
  let number = Number.parseFloat(value);
  if (Number.isNaN(number) === false) return number;
  throw Error(`Non-numeric value of '${value}' read from Redis for number field.`);
}

function stringToBoolean(value: string): boolean {
  if (value === '0') return false;
  if (value === '1') return true;
  throw Error(`Non-boolean value of '${value}' read from Redis for boolean field.`);
}

function stringToPoint(value: string): Point {
  let [ longitude, latitude ] = value.split(',').map(Number.parseFloat);
  return { longitude, latitude };
}

function stringToDate(value: string): Date {
  let parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) throw Error(`Non-numeric value of '${value}' read from Redis for date field.`);
  let date = new Date();
  date.setTime(parsed);
  return date;
}

function stringToStringArray(value: string, fieldDef: StringArrayFieldDefinition) {
  return value.split(fieldDef.separator ?? '|');
}

function numberToDate(value: number): Date {
  let date = new Date();
  date.setTime(value);
  return date;
}
