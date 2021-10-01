export interface Field {
  alias?: string;
}

export interface HashField extends Field {}

export interface NumericField extends HashField {
  type: 'number';
}

export interface StringField extends HashField {
  type: 'string';
  textSearch?: boolean;
  separator?: string;
}

export interface BooleanField extends HashField {
  type: 'boolean';
}

export interface ArrayField extends HashField {
  type: 'array';
  separator?: string;
}

export interface JsonField extends Field{
  path: string;
}

export interface JsonNumericField extends JsonField {
  type: 'number';
}  

export interface JsonStringField extends JsonField {
  type: 'string';
  textSearch?: boolean;
  separator?: string;
}

export interface JsonBooleanField extends JsonField {
  type: 'boolean';
}

export interface JsonArrayField extends JsonField {
  type: 'array';
  separator?: string;
}

export type FieldDefinition = NumericField | StringField | BooleanField | ArrayField | JsonNumericField | JsonStringField | JsonBooleanField | JsonArrayField;

export type SchemaDefinition = {
  [key: string]: FieldDefinition
}
