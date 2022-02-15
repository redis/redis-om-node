import Client, { SearchDataStructure, HashData, JsonData } from "./client";
import Entity, { EntityConstructor, EntityData } from "./entity/entity";
import RedisError from "./errors";
import Repository from "./repository/repository";
import { EntityCreationData } from "./repository/repository";
import Schema from "./schema/schema";
import { Point, SchemaDefinition, FieldDefinition, Field, NumericField, StringField, BooleanField, GeoField, ArrayField,
  IdStrategy, StopWordOptions } from "./schema/schema-definitions";
import { SchemaOptions } from "./schema/schema-options";
import Search, { SubSearchFunction } from "./search/search";
import Where from "./search/where";
import WhereField from "./search/where-field";
import { Circle, CircleFunction } from "./search/where-geo";


export {
  Client, SearchDataStructure, HashData, JsonData, 
  Entity, EntityConstructor, EntityData,
  RedisError,
  Repository, EntityCreationData,
  Schema, SchemaDefinition, SchemaOptions, Point,
  FieldDefinition, Field, NumericField, StringField, BooleanField, GeoField, ArrayField, IdStrategy, StopWordOptions,
  Search, SubSearchFunction,
  Where, WhereField, Circle, CircleFunction
};
