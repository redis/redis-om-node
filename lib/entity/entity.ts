import { EntityData } from "./entity-data";
import {
  EntityField,
  EntityBooleanField,
  EntityDateField,
  EntityNumberField,
  EntityPointField,
  EntityStringArrayField,
  EntityStringField,
  EntityTextField,
  EntityFieldConstructor,
} from "./fields";
import { Schema } from "../schema/schema";
import { SchemaDefinition, FieldDefinition, SchemaFieldType } from "../schema/definition";
import { RedisJsonData, RedisHashData } from "../client";

const ENTITY_FIELD_CONSTRUCTORS: Record<SchemaFieldType, EntityFieldConstructor> = {
  'boolean': EntityBooleanField,
  'date': EntityDateField,
  'number': EntityNumberField,
  'point': EntityPointField,
  'string': EntityStringField,
  'string[]': EntityStringArrayField,
  'text': EntityTextField
}

/**
 * An Entity is the class from which objects that Redis OM maps to are made. You need
 * to subclass Entity in your application:
 *
 * ```typescript
 * class Foo extends Entity {}
 * ```
 */
export abstract class Entity {
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
    Object.keys(this.schemaDef).forEach(fieldName => {
      const fieldDef: FieldDefinition = this.schemaDef[fieldName];
      const fieldType = fieldDef.type;
      const fieldAlias = fieldDef.alias ?? fieldName;
      const fieldValue = data[fieldAlias] ?? null;

      const entityField = new ENTITY_FIELD_CONSTRUCTORS[fieldType](fieldName, fieldDef, fieldValue);
      this.entityFields[fieldAlias] = entityField;
    })
  };

  /**
   * @returns The keyname this {@link Entity} is stored with in Redis.
   */
  get keyName(): string {
    return `${this.prefix}:${this.entityId}`;
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for stringification.
   * @returns a JavaScript object.
   */
  toJSON() {
    const json: Record<string, any> = { entityId: this.entityId }
    Object.keys(this.schemaDef).forEach(field => {
      json[field] = (this as Record<string, any>)[field];
    })
    return json;
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for writing to RedisJSON.
   * @internal
   */
  toRedisJson(): RedisJsonData {
    let data: RedisJsonData = {};
    Object.keys(this.entityFields).forEach(field => {
      const entityField: EntityField = this.entityFields[field];
      data = { ...data, ...entityField.toRedisJson() };
    })
    return data;
  }

  /**
   * Loads this {@link Entity} from Redis JSON data.
   * @internal
   */
  fromRedisJson(data: RedisJsonData) {
    if (!data) return data;
    Object.keys(data).forEach(field => {
      this.entityFields[field].fromRedisJson(data[field]);
    })
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for writing to a Redis Hash.
   * @internal
   */
  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    Object.keys(this.entityFields).forEach(field => {
      const entityField: EntityField = this.entityFields[field];
      data = { ...data, ...entityField.toRedisHash() };
    })
    return data;
  }

  /**
   * Loads this {@link Entity} from Redis Hash data.
   * @internal
   */
  fromRedisHash(data: RedisHashData) {
    Object.keys(data).forEach(field => {
      this.entityFields[field].fromRedisHash(data[field]);
    })
  }
}
