import { Client } from '$lib/client';
import { Schema } from '$lib/schema/schema';
import { Repository } from '$lib/repository';

import { createHashEntitySchema, SampleHashEntity } from '../helpers/data-helper';
import { fetchIndexInfo  } from '../helpers/redis-helper';

describe("drop missing index on hash", () => {

  let client: Client;
  let repository: Repository<SampleHashEntity>;
  let schema: Schema<SampleHashEntity>;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createHashEntitySchema('drop-missing');
    repository = client.fetchRepository<SampleHashEntity>(schema);
  });

  afterAll(async () => await client.close());

  describe("when the index is dropped", () => {
    beforeEach(async () => {
      await repository.dropIndex();
    });

    it("the index still doesn't exists", () => {
      expect(async () => await fetchIndexInfo(client, 'drop-missing:index'))
        .rejects.toThrow("Unknown Index name");
    });
  });
});
