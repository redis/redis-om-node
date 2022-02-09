import { JsonData } from "../client";
import { EntityData } from '../entity/entity';
import { SchemaDefinition, GeoPoint } from "../schema/schema-definitions";

export default class JsonConverter {

  private schemaDef: SchemaDefinition

  constructor(schemaDef: SchemaDefinition) {
    this.schemaDef = schemaDef;
  }

  toJsonData(entityData: EntityData): JsonData {

    let jsonData: JsonData = {};

    for (let field in this.schemaDef) {
      let value = entityData[field];
      if (value !== undefined) {
        let fieldDef = this.schemaDef[field];
        if (fieldDef.type === 'geopoint') {
          let { longitude, latitude } = value as GeoPoint;
          jsonData[field] = `${longitude},${latitude}`;
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
        }  
        entityData[field] = value;
      }
    }

    return entityData;
  }
}
