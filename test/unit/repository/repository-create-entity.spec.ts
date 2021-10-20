import { mocked } from 'ts-jest/utils';

import Client from '../../../src/client';
import Repository from '../../../src/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../src/client');


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

    it("has a generated entity id", () => expect(entity.entityId).toBeUlid());
    it("is of the expected type", () => expect(entity).toBeInstanceOf(SimpleEntity));
  });
});
