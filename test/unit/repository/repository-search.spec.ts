import { mocked } from 'ts-jest/utils';

import Client from '../../../src/client';
import Repository from '../../../src/repository/repository';
import Search from '../../../src/search/search';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../src/client');
jest.mock('../../../src/search/search');


beforeEach(() => {
  mocked(Client).mockReset();
  mocked(Search).mockReset();
});

describe("Repository", () => {

  let client: Client;
  let repository: Repository<SimpleEntity>;
  let search: Search<SimpleEntity>;

  describe("#search", () => {

    beforeAll(() => client = new Client());

    beforeEach(async () => {
      repository = new Repository(simpleSchema, client);
      search = repository.search();
    });

    it("creates a new Search with the schema and client", () => {
      expect(Search).toHaveBeenCalledWith(simpleSchema, client);
    });

    it("returns the search", () => {
      expect(search).toBeInstanceOf(Search);
    });
  });
});
