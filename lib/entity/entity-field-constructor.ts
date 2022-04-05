import EntityField from "./entity-field";
import EntityValue from "./entity-value";

type EntityFieldConstructor = new (alias: string, value?: EntityValue) => EntityField;

export default EntityFieldConstructor;
