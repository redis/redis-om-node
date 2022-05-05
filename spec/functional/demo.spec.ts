import { createClient } from 'redis';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Entity from '../../lib/entity/entity';
import Repository from '../../lib/repository/repository';

import { Point } from '../../lib';

describe("Demo", () => {

  it("demos", async () => {

    // establish an existing connection to Redis
    let redis = createClient();
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();

    // define the interface, just for TypeScript
    interface BigfootSighting {
      id: string;
      date: Date;
      title: string;
      observed: string;
      classification: Array<string>;
      county: string;
      state: string;
      location: Point;
      highTemp: number;
      lowTemp: number;
      fullMoon: boolean;
    }

    // define the entity class and add any business logic to it
    class BigfootSighting extends Entity {
      get highTempF() { return this.highTemp; }
      get highTempC() { return this.f2c(this.highTemp); }
      get lowTempF() { return this.lowTemp }
      get lowTempC() { return this.f2c(this.lowTemp); }

      private f2c(f: number): number { return (f - 32) * 5 / 9; }
    }

    // get a client use an existing Redis connection
    let client = await new Client().use(redis);
    await client.execute(['FLUSHALL']);
    await client.execute(['PING']);

    let schema = new Schema<BigfootSighting>(
      BigfootSighting, {
      id: { type: 'string' },
      date: { type: 'date' },
      title: { type: 'text' },
      observed: { type: 'text' },
      classification: { type: 'string[]' },
      county: { type: 'string' },
      state: { type: 'string' },
      location: { type: 'point' },
      highTemp: { type: 'number' },
      lowTemp: { type: 'number' },
      fullMoon: { type: 'boolean' }
    }, {
      useStopWords: 'OFF'
    });

    let repository: Repository<BigfootSighting> = client.fetchRepository<BigfootSighting>(schema);

    await repository.createIndex();

    // create an entity
    let entity = await repository.createEntity();
    entity.id = '8086';
    entity.date = new Date('1978-10-09T00:00:00.000Z');
    entity.title = "Bigfoot by the Walmart";
    entity.classification = ['Class A', 'Class B'];
    entity.location = { longitude: 12.34, latitude: 56.78 },
      entity.highTemp = 53;
    entity.fullMoon = false;

    let entityId = await repository.save(entity);
    await repository.expire(entityId, 60);

    // create an entity (#2)
    entity = await repository.createEntity({
      id: '8086',
      date: new Date('1978-10-09T00:00:00.000Z'),
      title: "Bigfoot by the Walmart",
      classification: ['Class A', 'Class B'],
      location: { longitude: 12.34, latitude: 56.78 },
      highTemp: 53,
      fullMoon: false
    });

    entityId = await repository.save(entity);

    // create an entity (#3)
    entity = await repository.createAndSave({
      id: '8086',
      date: new Date('1978-10-09T00:00:00.000Z'),
      title: "Bigfoot by the Walmart",
      classification: ['Class A', 'Class B'],
      location: { longitude: 12.34, latitude: 56.78 },
      highTemp: 53,
      fullMoon: false
    });

    // fetch an entity
    entity = await repository.fetch(entityId);

    // update an entity
    entity.date = new Date('1978-10-09T00:00:00.000Z');
    entity.lowTemp = 29;
    entity.county = "Athens";
    entity.state = "Ohio";
    entity.location = { longitude: 23.45, latitude: 67.89 },
      await repository.save(entity);

    // remove an entity
    await repository.remove(entityId);

    // search for all entities
    let allEntities = await repository.search().all();

    // search for some entities
    let someEntities = repository.search()
      .where(s => s
        .where('state').equals('OH')
        .or('state').equals('KY')
      )
      .and('classification').contains('Class A')
      .and('location').inCircle(circle => circle.origin(23.45, 67.89).radius(50).miles)
      .and('date').before(new Date('2000-01-01T00:00:00.000Z'))
      .and('title').matchesExactly('the walmart')
      .and('fullMoon').is.true().returnAll();

    // execute a raw search
    someEntities = repository.searchRaw('@fullMoon:{true} @location:[23.45 67.89 50 mi]').returnAll();

    // close the client
    client.close();
  });
});
