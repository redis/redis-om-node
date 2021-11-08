import { createHashEntitySchema, HashEntity } from '../helpers/data-helper';
import { fetchIndexInfo  } from '../helpers/redis-helper';

import Client from '../../../lib/client';
import Schema from '../../../lib/schema/schema';
import Repository from '../../../lib/repository/repository';

describe("drop missing index on hash", () => {

  let client: Client;
  let repository: Repository<HashEntity>;
  let schema: Schema<HashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema();
    repository = client.fetchRepository<HashEntity>(schema);
  });

  afterAll(async () => await client.close());
  
  describe("when the index is dropped", () => {
    beforeEach(async () => {
      await repository.dropIndex();
    });
    
    it("the index still doesn't exists", () => {
      expect(async () => await fetchIndexInfo(client, 'HashEntity:index'))
        .rejects.toThrow("Unknown Index name");
    });  
  });
});
