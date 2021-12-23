import Client from '../../lib/client';
import Schema from '../../lib/schema/schema';
import Entity from '../../lib/entity/entity';
import Repository from '../../lib/repository/repository';

describe("Demo", () => {

  it("demos", async () => {

    // define the interface, just for TypeScript
    interface BigfootSighting {
      id: string;
      date: number;
      title: string;
      observed: string;
      classification: string[];
      county: string;
      state: string;
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

      private f2c(f: number): number { return ( f - 32 ) * 5 / 9; }
    }

    // get a client and open it
    let client = new Client();
    await client.open();
    await client.execute<void>(['FLUSHALL']);
    await client.execute<string>(['PING']);

    let schema = new Schema<BigfootSighting>(
      BigfootSighting, {
        id: { type: 'string' },
        date: { type: 'number' },
        title: { type: 'string', textSearch: true },
        observed: { type: 'string', textSearch: true },
        classification: { type: 'array' },
        county: { type: 'string' },
        state: { type: 'string' },
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
    entity.title = "Bigfoot by the Walmart";
    entity.classification = [ 'Class A', 'Class B' ];
    entity.highTemp = 78;
    entity.fullMoon = false;

    let entityId = await repository.save(entity);

    // create an entity (#2)
    entity = await repository.createEntity({
      id: '8086',
      title: "Bigfoot by the Walmart",
      classification: [ 'Class A', 'Class B' ],
      highTemp: 78,
      fullMoon: false
    });

    entityId = await repository.save(entity);

    // create an entity (#3)
    entity = await repository.createAndSave({
      id: '8086',
      title: "Bigfoot by the Walmart",
      classification: [ 'Class A', 'Class B' ],
      highTemp: 78,
      fullMoon: false
    });

    // fetch an entity
    entity = await repository.fetch(entityId);

    // update an entity
    entity.lowTemp = 54;
    entity.county = "Athens";
    entity.state = "Ohio";
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
      .and('title').matchesExactly('the walmart')
      .and('fullMoon').is.true().returnAll();

    // close the client
    client.close();
  });
});
