import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';
import { EntityId } from '../../lib/entity/entity-types';

import TestEntity from '../helpers/test-entity';
import { testSchema } from '../helpers/test-schema';

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<TestEntity>;
  let entity: TestEntity;
  let entityId: EntityId;
  let expectedKey: string;

  describe("#save", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(testSchema, client);
      entity = repository.createEntity();
    });

    describe("when saving a simple entity", () => {
      beforeEach(async () => {
        entity.aString = 'foo';
        entity.aNumber = 42;
        entity.aBoolean = false;
        entity.anArray = [ 'bar', 'baz', 'qux' ];
        entityId = await repository.save(entity);
        expectedKey = `TestEntity:${entityId}`;
      });

      it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
      it("saves the entity data to the key", () =>
        expect(Client.prototype.hsetall).toHaveBeenCalledWith(expectedKey, entity.entityData));
    });
  
    describe("when saving a partially populated entity", () => {
      beforeEach(async () => {
        entity.aString = 'foo';
        entity.aNumber = 42;
        entity.aBoolean = null;
        entity.anArray = null;
        entityId = await repository.save(entity);
        expectedKey = `TestEntity:${entityId}`;
      });

      it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
      it("saves the entity data to the key", () =>
        expect(Client.prototype.hsetall).toHaveBeenCalledWith(expectedKey, entity.entityData));
    });

    describe("when saving an unpopulated entity", () => {
      beforeEach(async () => {
        entity.aString = null;
        entity.aNumber = null;
        entity.aBoolean = null;
        entity.anArray = null;
        entityId = await repository.save(entity);
        expectedKey = `TestEntity:${entityId}`;
      });

      it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
      it("unlinks the key", () =>
        expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey));
    });
  });
});
