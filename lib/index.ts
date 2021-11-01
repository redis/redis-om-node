import Client, { SearchDataStructure, HashData, JsonData } from "./client";
import Entity, { EntityConstructor, EntityData } from "./entity/entity";
import RedisError from "./errors";
import Repository from "./repository/repository";
import Schema from "./schema/schema";
import { SchemaDefinition, FieldDefinition, Field, NumericField, StringField, BooleanField, ArrayField,
  IdStrategy } from "./schema/schema-definitions";
import { SchemaOptions } from "./schema/schema-options";
import Search, { SubSearchFunction } from "./search/search";
import Where from "./search/where";
import WhereField from "./search/where-field";
import WhereArray from './search/where-array';
import { WhereBoolean, WhereHashBoolean, WhereJsonBoolean } from './search/where-boolean';
import WhereNumber from './search/where-number';
import WhereString from './search/where-string';
import WhereText from './search/where-text';


export {
  Client, SearchDataStructure, HashData, JsonData, 
  Entity, EntityConstructor, EntityData,
  RedisError,
  Repository,
  Schema, SchemaDefinition, SchemaOptions,
  FieldDefinition, Field, NumericField, StringField, BooleanField, ArrayField, IdStrategy,
  Search, SubSearchFunction,
  Where, WhereField,
  // WhereArray,
  // WhereBoolean, WhereHashBoolean, WhereJsonBoolean,
  // WhereNumber, WhereString, WhereText
};
