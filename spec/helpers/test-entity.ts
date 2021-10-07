import Entity from '../../lib/entity/entity';

export default interface TestEntity {
  aString: string | null;
  aNumber: number | null;
  aBoolean: boolean | null;
  anArray: string[] | null;
}

export default class TestEntity extends Entity {}
