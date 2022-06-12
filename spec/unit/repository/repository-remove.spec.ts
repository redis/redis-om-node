import Client from '../../../lib/client';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => jest.clearAllMocks());

describe("Repository", () => {

  let client: Client;

  describe("#remove", () => {

    let hashRepository: HashRepository<SimpleHashEntity>;
    let jsonRepository: JsonRepository<SimpleJsonEntity>;

    beforeAll(() => client = new Client());

    beforeEach(() => {
      hashRepository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
      jsonRepository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
    })

    it("removes no hashes", async () => {
      await hashRepository.remove();
      expect(Client.prototype.unlink).not.toHaveBeenCalled();
    });

    it("removes a single hash", async () => {
      await hashRepository.remove('foo');
      expect(Client.prototype.unlink).toHaveBeenCalledWith('SimpleHashEntity:foo');
    });

    it("removes multiple hashes", async () => {
      await hashRepository.remove('foo', 'bar', 'baz');
      expect(Client.prototype.unlink).toHaveBeenCalledWith(
        'SimpleHashEntity:foo', 'SimpleHashEntity:bar', 'SimpleHashEntity:baz'
      );
    });

    it("removes no JSON", async () => {
      await jsonRepository.remove();
      expect(Client.prototype.unlink).not.toHaveBeenCalled();
    });

    it("removes a single JSON", async () => {
      await jsonRepository.remove('foo');
      expect(Client.prototype.unlink).toHaveBeenCalledWith('SimpleJsonEntity:foo');
    });

    it("removes multiple JSONs", async () => {
      await jsonRepository.remove('foo', 'bar', 'baz');
      expect(Client.prototype.unlink).toHaveBeenCalledWith(
        'SimpleJsonEntity:foo', 'SimpleJsonEntity:bar', 'SimpleJsonEntity:baz'
      );
    })
  });
});
