import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';
import { EntityId } from '../../lib/entity/entity-types';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let entity: SimpleEntity;
  let entityId: EntityId;

  describe("#fetch", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      entityId = 'foo';
    });

    describe("when fetching a fully populated entity", () => {
      beforeEach(async () => {
        mocked(Client.prototype.hgetall).mockResolvedValue({
          aString: 'foo', aNumber: '42', aBoolean: '0', anArray: 'bar|baz|qux'
        })
        entity = await repository.fetch(entityId);
      });

      it("returns and entity with the expected id", () => expect(entity.entityId).toBe(entityId));
      it("returns and entity with the expected properties", () => {
        expect(entity.aString).toBe('foo');
        expect(entity.aNumber).toBe(42);
        expect(entity.aBoolean).toBe(false);
        expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
      });
    });
  
    describe("when fetching a partialy populated entity", () => {
      beforeEach(async () => {
        mocked(Client.prototype.hgetall).mockResolvedValue({
          aString: 'foo', aNumber: '42'
        })
        entity = await repository.fetch(entityId);
      });

      it("returns and entity with the expected id", () => expect(entity.entityId).toBe(entityId));
      it("returns and entity with some of the properties set to null", () => {
        expect(entity.aString).toBe('foo');
        expect(entity.aNumber).toBe(42);
        expect(entity.aBoolean).toBeNull();
        expect(entity.anArray).toBeNull();
      });
    });
  
    describe("when fetching an unpopulated entity", () => {
      beforeEach(async () => {
        mocked(Client.prototype.hgetall).mockResolvedValue({})
        entity = await repository.fetch(entityId);
      });

      it("returns and entity with the expected id", () => expect(entity.entityId).toBe(entityId));
      it("returns and entity with the expected properties", () => {
        expect(entity.aString).toBeNull();
        expect(entity.aNumber).toBeNull();
        expect(entity.aBoolean).toBeNull();
        expect(entity.anArray).toBeNull();
      });
    });
  });
});
