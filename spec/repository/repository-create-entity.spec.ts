import Globals from '../helpers/globals';
import { fetchHashKeys, fetchHashFields, keyExists } from '../helpers/redis-helper';
import { Bigfoot, createBigfootSchema, A_BIGFOOT_SIGHTING, } from '../helpers/bigfoot-data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { EntityId } from '../../lib/entity/entity-types';

const globals: Globals = (globalThis as unknown) as Globals;

describe("Repository", () => {

  let client: Client;
  let repository: Repository<Bigfoot>;
  let schema: Schema<Bigfoot>;
  let entity: Bigfoot;

  beforeAll(() => {
    client = globals.client;
    schema = createBigfootSchema();
  });

  beforeEach(async () => {
    repository = client.fetchRepository<Bigfoot>(schema);
  });

  describe('#createEntity', () => {
    let entity: Bigfoot;

    beforeEach(() => entity = repository.createEntity());

    it("has a generated entity id", () => {
      let id = entity.entityId;
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });
});
