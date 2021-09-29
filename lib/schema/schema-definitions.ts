export interface Field {
  alias?: string;
}

export interface NumericField extends Field {
  type: 'number';
}

export interface StringField extends Field {
  type: 'string';
  textSearch?: boolean;
  separator?: string;
}

export interface BooleanField extends Field {
  type: 'boolean';
}

export interface ArrayField extends Field {
  type: 'array';
  separator?: string;
}

export type FieldDefinition = NumericField | StringField | BooleanField | ArrayField;

export type SchemaDefinition = {
  [key: string]: FieldDefinition
}
