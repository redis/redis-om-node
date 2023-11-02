import type { SchemaDefinition } from "./schema-and-fields-definition";
import type { Schema } from "../schema";
import type { Model } from "../model";

export type MethodsDefinition<T extends SchemaDefinition = SchemaDefinition> =
    Record<string, (this: Model<Schema<T>>, ...args: Array<any>) => unknown>;