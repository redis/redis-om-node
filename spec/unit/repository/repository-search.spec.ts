import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import { Search, RawSearch } from '../../../lib/search/search';
import Repository from '../../../lib/repository/repository';
import { HashRepository } from '../../../lib/repository/repository';

import { simpleSchema, SimpleEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');
jest.mock('../../../lib/search/search');


beforeEach(() => {
  mocked(Client).mockReset();
  mocked(Search).mockReset();
});

describe("Repository", () => {
  
  let repository: Repository<SimpleEntity>;
  let client: Client;
  
  beforeAll(() => client = new Client());

  describe("#searchRaw", () => {
    let search: RawSearch<SimpleEntity>;

    beforeEach(async () => {
      repository = new HashRepository(simpleSchema, client);
      search = repository.searchRaw("NOT A VALID QUERY BUT HEY WHATEVER");
    });

    it("creates a new Search with the schema and client", () => {
      expect(RawSearch).toHaveBeenCalledWith(simpleSchema, client, "NOT A VALID QUERY BUT HEY WHATEVER");
    });

    it("returns the search", () => {
      expect(search).toBeInstanceOf(RawSearch);
    });
  });

  describe("#search", () => {
    let search: Search<SimpleEntity>;

    beforeEach(async () => {
      repository = new HashRepository(simpleSchema, client);
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
