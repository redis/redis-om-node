import FieldDefinition from "./field-definition";

/**
* Group of {@link FieldDefinition}s that define the schema for an {@link Entity}.
 */
type SchemaDefinition = Record<string, FieldDefinition>;

export default SchemaDefinition;
