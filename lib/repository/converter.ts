import { EntityData } from '../entity/entity';
import { JsonData, HashData } from '../client';
import { ArrayField, SchemaDefinition, GeoPoint } from "../schema/schema-definitions";

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

    for (let field in this.schemaDef) {
      let value = entityData[field];
      if (value !== undefined) {
        let fieldDef = this.schemaDef[field];
        if (fieldDef.type === 'number') hashData[field] = value.toString();
        if (fieldDef.type === 'boolean') hashData[field] = value ? '1': '0';
        if (fieldDef.type === 'array') hashData[field] = (value as string[]).join(fieldDef.separator ?? '|');
        if (fieldDef.type === 'string') hashData[field] = value;
        if (fieldDef.type === 'date') hashData[field] = (value as Date).getTime().toString();
        if (fieldDef.type === 'geopoint') {
          let { longitude, latitude } = value as GeoPoint;
          hashData[field] = `${longitude},${latitude}`;
        }
      }
    }
    return hashData;
  }

  toEntityData(hashData: HashData): EntityData{

    let entityData: EntityData = {};

    for (let field in this.schemaDef) {
      let value = hashData[field];
      if (value !== undefined) {
        let fieldDef = this.schemaDef[field]
        if (fieldDef.type === 'number') this.addNumber(field, entityData, value);
        if (fieldDef.type === 'boolean') this.addBoolean(field, entityData, value);
        if (fieldDef.type === 'array') this.addArray(field, fieldDef as ArrayField, entityData, value);
        if (fieldDef.type === 'string') this.addString(field, entityData, value);
        if (fieldDef.type === 'date') this.addDate(field, entityData, value);
        if (fieldDef.type === 'geopoint') this.addGeoPoint(field, entityData, value);
      }
    }

    return entityData;
  }

  private addNumber(field: string, entityData: EntityData, value: string) {
    let parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) throw Error(`Non-numeric value of '${value}' read from Redis for number field '${field}'`);
    entityData[field] = Number.parseFloat(value);
  }

  private addBoolean(field: string, entityData: EntityData, value: string) {
    if (value === '0') {
      entityData[field] = false;
    } else if (value === '1') {
      entityData[field] = true;
    } else {
      throw Error(`Non-boolean value of '${value}' read from Redis for boolean field '${field}'`);
    }
  }

  private addArray(field: string, fieldDef: ArrayField, entityData: EntityData, value: string) {
    entityData[field] = value.split(fieldDef.separator ?? '|');
  }

  private addString(field: string, entityData: EntityData, value: string) {
    entityData[field] = value;
  }

  private addDate(field: string, entityData: EntityData, value: string) {
    let parsed = Number.parseInt(value);
    if (Number.isNaN(parsed)) throw Error(`Non-numeric value of '${value}' read from Redis for date field '${field}'`);
    let date = new Date();
    date.setTime(parsed);
    entityData[field] = date;
  }

  private addGeoPoint(field: string, entityData: EntityData, value: string) {
    let [ longitude, latitude ] = value.split(',').map(Number.parseFloat);
    entityData[field] = { longitude, latitude };
  }
}

/** @internal */
export class JsonConverter extends AbstractConverter {

  toJsonData(entityData: EntityData): JsonData {

    let jsonData: JsonData = {};

    for (let field in this.schemaDef) {
      let value = entityData[field];
      if (value !== undefined) {
        let fieldDef = this.schemaDef[field];
        if (fieldDef.type === 'geopoint') {
          let { longitude, latitude } = value as GeoPoint;
          jsonData[field] = `${longitude},${latitude}`;
        } else if (fieldDef.type === 'date' ) {
          jsonData[field] = (value as Date).getTime();
        } else {
          jsonData[field] = value
        }
      }
    }

    return jsonData;
  }

  toEntityData(jsonData: JsonData): EntityData {
    let entityData: EntityData = {};

    if (jsonData === null) return entityData;
    for (let field in this.schemaDef) {
      let value = jsonData[field];
      if (value !== undefined && value !== null) {
        if (this.schemaDef[field].type === 'geopoint') {
          let [ longitude, latitude ] = value.split(',').map(Number.parseFloat);
          value = { longitude, latitude };
        } else if (this.schemaDef[field].type === 'date') {
          let parsed = Number.parseInt(value);
          if (Number.isNaN(parsed)) throw Error(`Non-numeric value of '${value}' read from Redis for date field '${field}'`);
          value = new Date();
          value.setTime(parsed);
        }
        entityData[field] = value;
      }
    }

    return entityData;
  }
}
