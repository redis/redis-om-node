import { mocked } from 'ts-jest/utils';

import Client from '../../lib/client';
import Repository from '../../lib/repository/repository';

import TestEntity from '../helpers/test-entity';
import { testSchema } from '../helpers/test-schema';
import Search from '../../lib/search/search';

jest.mock('../../lib/client');
jest.mock('../../lib/search/search');


beforeEach(() => {
  mocked(Client).mockReset();
  mocked(Search).mockReset();
});

describe("Repository", () => {

  let client: Client;
  let repository: Repository<TestEntity>;
  let search: Search<TestEntity>;

  describe("#search", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(testSchema, client);
      search = repository.search();
    });

    it("creates a new Search with the schema and client", () => {
      expect(Search).toHaveBeenCalledWith(testSchema, client);
    });

    it("returns the search", () => {
      expect(search).toBeInstanceOf(Search);
    });
  });
});
