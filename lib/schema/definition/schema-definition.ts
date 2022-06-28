import { FieldDefinition } from "./field-definition";

/**
* Group of {@link FieldDefinition}s that define the schema for an {@link Entity}.
 */
export type SchemaDefinition = Record<string, FieldDefinition>;
