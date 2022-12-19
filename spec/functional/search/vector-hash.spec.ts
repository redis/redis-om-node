import { createClient } from 'redis';

import { products } from './products';
import { Client } from '$lib/client';
import { Schema } from '$lib/schema/schema';
import { Entity } from '$lib/entity/entity';
import { Repository } from '$lib/repository';
import { removeAll } from '../helpers/redis-helper';

describe("Vector HASH", () => {
  let redis: ReturnType<typeof createClient>
  let client: Client
  let repository: Repository<Product>
  let entityIDs: string[]

  // define the interface, just for TypeScript
  interface Product {
    name: string;
    price: number;
    image: Buffer;
  }

  // define the entity class and add any business logic to it
  class Product extends Entity {
  }

  beforeAll(async () => {
    // establish an existing connection to Redis
    redis = createClient();
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();

    // get a client use an existing Redis connection
    client = await new Client().use(redis);

    await removeAll(client, 'ProductHASH:')

    entityIDs = []
  })

  afterAll(async () => {
    await removeAll(client, 'ProductHASH:')

    await repository.dropIndex();

    // close the client
    await client.close()
  })

  it("demo", async () => {
    let schema = new Schema<Product>(
      Product, {
      name: { type: 'text' },
      price: { type: 'number' },
      image: { type: 'binary', vector: { algorithm: 'FLAT', dim: 512, distance_metric: 'COSINE', initial_cap: 5, block_size: 5 } },
    }, {
      prefix: 'ProductHASH',
      dataStructure: 'HASH',
    });

    repository = client.fetchRepository<Product>(schema);

    await repository.createIndex();

    async function loadProduct(product: { name: string, price: number, image: string }) {
      let entity = await repository.createEntity();
      entity.name = product.name
      entity.price = product.price
      entity.image = Buffer.from(product.image, 'hex')
      return await repository.save(entity);
    }

    for (const product of products) {
      const entityID = await loadProduct(product)
      entityIDs.push(entityID)
    }

    // TODO: figure out rawSearch / where query encoding is happening ...

    // execute a raw search for the first product image ...
    const results = await redis.sendCommand([
      'FT.SEARCH', 'ProductHASH:index', '*=>[KNN 2 @image $query_vector]', 'PARAMS', '2',
      'query_vector', Buffer.from(products[0].image, 'hex'),
      'RETURN', '3', '__image_score", "name", "price',
      'SORTBY', '__image_score',
      'DIALECT', '2'
    ]) as any[]

    // ... and we should get the first 2 products back in order
    expect(results).toBeDefined()
    expect(results).toBeInstanceOf(Array)
    expect(results.length).toBe(5)
    expect(results[1]).toBe('ProductHASH:' + entityIDs[0])
    expect(parseFloat(results[2][1])).toBeLessThan(1e-4)
    expect(results[3]).toBe('ProductHASH:' + entityIDs[1])
    expect(parseFloat(results[4][1])).toBeGreaterThan(0.2)
  });
});
