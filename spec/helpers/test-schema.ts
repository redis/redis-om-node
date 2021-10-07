import TestEntity from './test-entity';
import Schema from '../../lib/schema/schema';

export const testSchema = new Schema(TestEntity, {
  aString: { type: 'string' },
  aNumber: { type: 'number' },
  aBoolean: { type: 'boolean' },
  anArray: { type: 'array' }
});
