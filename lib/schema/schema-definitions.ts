export interface Field {
  alias?: string;
}

export interface NumericField extends Field {
  type: 'number';
}

export interface StringField extends Field {
  type: 'string';
  textSearch?: boolean;
}

export interface BooleanField extends Field {
  type: 'boolean';
}

export interface ArrayField extends Field {
  type: 'array';
}

export type FieldDefinition = NumericField | StringField | BooleanField | ArrayField;

export type SchemaDefinition = {
  [key: string]: FieldDefinition
}
