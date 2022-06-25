import { client } from '../helpers/mock-client'
import { Client } from '../../../lib/client';
import { JsonRepository, HashRepository } from '../../../lib/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';


describe("Repository", () => {

  // let client: Client;

  describe("#remove", () => {

    let hashRepository: HashRepository<SimpleHashEntity>;
    let jsonRepository: JsonRepository<SimpleJsonEntity>;

    beforeAll(() => {
      // client = new Client()
    });

    beforeEach(() => {
      const client = new Client()
      hashRepository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
      jsonRepository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
    })

    it("removes no hashes", async () => {
      await hashRepository.remove();
      expect(client.unlink).not.toHaveBeenCalled();
    });

    it("removes a single hash", async () => {
      await hashRepository.remove('foo');
      expect(client.unlink).toHaveBeenCalledWith('SimpleHashEntity:foo');
    });

    it("removes multiple hashes", async () => {
      await hashRepository.remove('foo', 'bar', 'baz');
      expect(client.unlink).toHaveBeenCalledWith(
        'SimpleHashEntity:foo', 'SimpleHashEntity:bar', 'SimpleHashEntity:baz'
      );
    });

    it("removes no JSON", async () => {
      await jsonRepository.remove();
      expect(client.unlink).not.toHaveBeenCalled();
    });

    it("removes a single JSON", async () => {
      await jsonRepository.remove('foo');
      expect(client.unlink).toHaveBeenCalledWith('SimpleJsonEntity:foo');
    });

    it("removes multiple JSONs", async () => {
      await jsonRepository.remove('foo', 'bar', 'baz');
      expect(client.unlink).toHaveBeenCalledWith(
        'SimpleJsonEntity:foo', 'SimpleJsonEntity:bar', 'SimpleJsonEntity:baz'
      );
    })
  });
});
