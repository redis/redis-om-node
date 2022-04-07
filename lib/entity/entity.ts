import EntityData from "./entity-data";
import EntityValue from "./entity-value";
import EntityField from "./fields/entity-field";
import EntityBooleanField from "./fields/entity-boolean-field";
import EntityDateField from "./fields/entity-date-field";
import EntityNumberField from "./fields/entity-number-field";
import EntityPointField from "./fields/entity-point-field";
import EntityStringArrayField from "./fields/entity-string-array-field";
import EntityStringField from "./fields/entity-string-field";
import EntityTextField from "./fields/entity-text-field";
import EntityFieldConstructor from "./fields/entity-field-constructor";
import Schema from "../schema/schema";
import SchemaDefinition from "../schema/definition/schema-definition";
import FieldDefinition from "../schema/definition/field-definition";
import SchemaFieldType from "../schema/definition/schema-field-type";

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
    this.createFields(data);
  }

  /**
   * Create the fields on the Entity.
   * @internal
   */
  private createFields(data: EntityData) {
    for (const field in this.schemaDef) {
      const fieldDef: FieldDefinition = this.schemaDef[field];
      const fieldType = fieldDef.type;
      const fieldAlias = fieldDef.alias ?? field;
      const fieldValue = data[fieldAlias] ?? null

      const entityField = new ENTITY_FIELD_CONSTRUCTORS[fieldType](fieldAlias, fieldValue);
      this.entityFields[field] = entityField;
    }
  }

  /**
   * @returns The keyname this {@link Entity} is stored with in Redis.
   */
  get keyName(): string {
    return `${this.prefix}:${this.entityId}`;
  }

  /**
   * The underlying data to be written to Redis.
   * @internal
   */
  get entityData(): Record<string, EntityValue> {
    const data: Record<string, EntityValue> = {};
    for (const field in this.entityFields) {
      const entityField: EntityField = this.entityFields[field];
      if (entityField.value !== null) data[entityField.alias] = entityField.value;
    }

    return data;
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for stringification.
   * @returns a JavaScript object.
   */
  toJSON() {
    const json: Record<string, any> = { entityId: this.entityId }
    for (const field in this.schemaDef) {
      json[field] = (this as Record<string, any>)[field];
    }
    return json;
  }
}
