import Entity from "../entity/entity";
import Search from "./search";

export abstract class Where {
  abstract toString(): string;
}

export default Where;
