import BaseFieldDefinition from "./base-field-definition";

/** A field representing a point on the globe. */
interface PointFieldDefinition extends BaseFieldDefinition {
  /** Yep. It's a point. */
  type: 'point';
}

export default PointFieldDefinition;
