import EntityData from "./entity-data";
import EntityField from "./entity-field";
import EntityBooleanField from "./entity-boolean-field";
import EntityDateField from "./entity-date-field";
import EntityNumberField from "./entity-number-field";
import EntityPointField from "./entity-point-field";
import EntityStringArrayField from "./entity-string-array-field";
import EntityStringField from "./entity-string-field";
import EntityTextField from "./entity-text-field";
import EntityFieldConstructor from "./entity-field-constructor";
import { FieldDefinition, SchemaDefinition } from "../schema/schema-definitions";
import Schema from "../schema/schema";
import SchemaFieldType from "../schema/schema-field-type";

const ENTITY_FIELD_CONSTRUCTORS: Record<SchemaFieldType, EntityFieldConstructor> = {
  'string': EntityStringField,
  'number': EntityNumberField,
  'boolean': EntityBooleanField,
  'text': EntityTextField,
  'date': EntityDateField,
  'point': EntityPointField,
  'string[]': EntityStringArrayField
}

/**
 * An Entity is the class from which objects that Redis OM maps to are made. You need
 * to subclass Entity in your application:
 * 
 * ```typescript
 * class Foo extends Entity {}
 * ```
 */
export default abstract class Entity {
  /** The generated entity ID. */
  readonly entityId: string;

  /** 
   * The underlying data to be written to Redis.
   * @internal
   */

  private schemaDef: SchemaDefinition;
  private prefix: string;
  private entityFields: Record<string, EntityField> = {};

  /** 
   * Creates an new Entity.
   * @internal
   */
  constructor(schema: Schema<any>, id: string, data: EntityData = {}) {
    this.schemaDef = schema.definition;
    this.prefix = schema.prefix;
    this.entityId = id;

    // loop through the schema, adding fields and setting data as we go
    for (let field in this.schemaDef) {
      let fieldDef: FieldDefinition = this.schemaDef[field];
      let fieldType = fieldDef.type;
      let fieldAlias = fieldDef.alias ?? field;
      let fieldValue = data[fieldAlias] ?? null

      let entityField = new ENTITY_FIELD_CONSTRUCTORS[fieldType](fieldAlias, fieldValue);
      this.entityFields[field] = entityField;
    }
  }

  get keyName(): string {
    return `${this.prefix}:${this.entityId}`;
  }

  get entityData() : Record<string, any> {

    let data: Record<string, any> = {};
    for (let field in this.entityFields) {
      let entityField: EntityField = this.entityFields[field];
      if (entityField.value !== null) data[entityField.alias] = entityField.value;
    }

    return data;
  }

  toJSON() {
    let json: Record<string, any> = { entityId: this.entityId }
    for (let field in this.schemaDef) {
      json[field] = (this as Record<string, any>)[field];
    }
    return json;
  }
}
