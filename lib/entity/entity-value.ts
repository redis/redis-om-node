import { Point } from "../schema/schema-definitions";

/**
 * Valid types for properties on an {@link Entity}.
 */
type EntityValue = string | number | boolean | Point | Date | any[] | null;

export default EntityValue;
