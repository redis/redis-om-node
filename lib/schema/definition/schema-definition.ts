import BaseFieldDefinition from "./base-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

import FieldDefinition from "./field-definition";

/**
* Group of {@link FieldDefinition}s that define the schema for an {@link Entity}.
 */
type SchemaDefinition = Record<string, FieldDefinition>;

export default SchemaDefinition;
