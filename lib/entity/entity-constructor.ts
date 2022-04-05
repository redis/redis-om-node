import Schema from "../schema/schema";
import EntityData from "./entity-data";

/**
 * A constructor that creates an {@link Entity} of type TEntity.
 * @template TEntity The {@link Entity} type.
 */
 type EntityConstructor<TEntity> = new (
  schema: Schema<any>,
  id: string,
  data?: EntityData) => TEntity;

export default EntityConstructor;
