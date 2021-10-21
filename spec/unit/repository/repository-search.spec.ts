import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import Search from '../../../lib/search/search';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');
jest.mock('../../../lib/search/search');


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
