import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let entity: SimpleEntity;

  describe('#createEntity', () => {

    beforeAll(() => client = new Client());

    beforeEach(() => {
      repository = new Repository(simpleSchema, client);
      entity = repository.createEntity();
    })

    it("has a generated entity id", () => expect(entity.entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/));
    it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
  });
});
