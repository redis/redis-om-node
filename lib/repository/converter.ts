import { EntityData, EntityValue } from '../entity/entity';
import { JsonData, HashData } from '../client';
import { ArrayField, SchemaDefinition, FieldDefinition, GeoPoint } from "../schema/schema-definitions";

class AbstractConverter {
  protected schemaDef: SchemaDefinition

  constructor(schemaDef: SchemaDefinition) {
    this.schemaDef = schemaDef;
  }
}

/** @internal */
export class HashConverter extends AbstractConverter {

  toHashData(entityData: EntityData): HashData {
    let hashData: HashData = {};
    for (let fieldName in this.schemaDef) {
      let entityValue = entityData[fieldName];
      let fieldDef = this.schemaDef[fieldName];
      let fieldType = fieldDef.type;
      if (entityValue !== undefined) hashData[fieldName] = toHashConverters[fieldType](entityValue, fieldDef);
    }
    return hashData;
  }

  toEntityData(hashData: HashData): EntityData{
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

  toJsonData(entityData: EntityData): JsonData {
    let jsonData: JsonData = {};
    for (let fieldName in this.schemaDef) {
      let fieldValue = entityData[fieldName];
      let fieldDef = this.schemaDef[fieldName];
      let fieldType = fieldDef.type;
      if (fieldValue !== undefined) jsonData[fieldName] = toJsonConverters[fieldType](fieldValue);
    }
    return jsonData;
  }

  toEntityData(jsonData: JsonData): EntityData {
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

let toHashConverters = {
  'number': (value: EntityValue) => (value as number).toString(),
  'boolean': (value: EntityValue) => (value as boolean) ? '1' : '0',
  'string': (value: EntityValue) => (value as string).toString(),
  'geopoint': (value: EntityValue) => geoPointToString(value as GeoPoint),
  'date': (value: EntityValue) => dateToString(value as Date),
  'array': (value: EntityValue, fieldDef: FieldDefinition) => stringArrayToString(value as string[], fieldDef as ArrayField)
};

let fromHashConverters = {
  'number': stringToNumber,
  'boolean': stringToBoolean,
  'string': (value: string) => value,
  'geopoint': stringToGeoPoint,
  'date': stringToDate,
  'array': (value: string, fieldDef: FieldDefinition) => stringToStringArray(value, fieldDef as ArrayField)
};

let toJsonConverters = {
  'number': (value: EntityValue) => value,
  'boolean': (value: EntityValue) => value,
  'string': (value: EntityValue) => value,
  'geopoint': (value: EntityValue) => geoPointToString(value as GeoPoint),
  'date': (value: EntityValue) => dateToNumber(value as Date),
  'array': (value: EntityValue) => value
};

let fromJsonConverters = {
  'number': (value: any) => (value as number),
  'boolean': (value: any) => (value as boolean),
  'string': (value: any) => (value as string),
  'geopoint': (value: any) => stringToGeoPoint(value as string),
  'date': (value: any) => numberToDate(value as number),
  'array': (value: any) => (value as string[])
}

function geoPointToString(value: GeoPoint): string {
  let {longitude, latitude} = value;
  return `${longitude},${latitude}`;
}

function dateToString(value: Date): string {
  return value.getTime().toString();
}

function dateToNumber(value: Date): number {
  return value.getTime();
}

function stringArrayToString(value: string[], fieldDef: ArrayField): string {
  return value.join(fieldDef.separator ?? '|');
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

function stringToGeoPoint(value: string): GeoPoint {
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

function stringToStringArray(value: string, fieldDef: ArrayField) {
  return value.split(fieldDef.separator ?? '|');
}

function numberToDate(value: number): Date {
  let date = new Date();
  date.setTime(value);
  return date;
}
