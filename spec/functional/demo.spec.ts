import { createClient } from 'redis'

import { Entity, EntityData, EntityId, Point, Repository, Schema } from '$lib/index'

type BigfootSighting = Entity & {
  date?: Date,
  title?: string,
  classification?: string[],
  location?: EntityData & {
    county?: string,
    state?: string,
    latlng?: Point
  },
  temperature?: EntityData & {
    high?: number,
    low?: number
  },
  fullMoon?: boolean
}

describe("Demo", () => {

  it("demos", async () => {

    let entity: BigfootSighting
    let entityId: string | undefined

    // establish a connection to Redis
    const redis = createClient()
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()

    // define a schema
    const schema: Schema = new Schema(
      'BigfootSighting', {
        date: { type: 'date' },
        title: { type: 'text' },
        classification: { type: 'string[]' },
        county: { type: 'string', path: '$.location.county' },
        state: { type: 'string', path: '$.location.state' },
        latlng: { type: 'point', path: '$.location.latlng'  },
        highTemp: { type: 'number', path: '$.temperature.high' },
        lowTemp: { type: 'number', path: '$.temperature.low' },
        fullMoon: { type: 'boolean' }
      }, {
        useStopWords: 'OFF'
      })

    /* NOTE: Just because a field is on the Schema doesn't mean it's
       required. And just because it's *not* in the Schema, doesn't
       mean you can't provide it. The Schema defines what is indexed
       and how fields are mapped to and from Redis. */

    // create a repository & create the index for it
    const repository = new Repository(schema, redis)
    await repository.createIndex()

    // write an entity and generate an entityId that is a ULID
    entity = {
      date: new Date('1978-10-09T00:00:00.000Z'),
      title: "Bigfoot by the Walmart",
      observed: "I saw Bigfoot at Walmart buying flip flops. He wears a size 17.",
      classification: [ 'Class A', 'Class B' ],
      location: {
        latlong: { longitude: 12.34, latitude: 56.78 },
      },
      temperature: {
        high: 53,
        average: 47,
        low: 42
      },
      fullMoon: false,
    }

    entity = await repository.save(entity)
    entityId = entity[EntityId]

    expect(entityId).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/)

    // write an entity that already has an entityId
    entity = {
      [EntityId]: '8086', // the provided id
      date: new Date('1978-10-09T00:00:00.000Z'),
      title: "Bigfoot by the Walmart",
      observed: "I saw Bigfoot at Walmart buying flip flops. He wears a size 17.",
      classification: [ 'Class A', 'Class B' ],
      location: {
        latlong: { longitude: 12.34, latitude: 56.78 },
      },
      temperature: {
        high: 53,
        average: 47,
        low: 42
      },
      fullMoon: false,
    }

    entity = await repository.save(entity)
    entityId = entity[EntityId]

    expect(entityId).toBe('8086')

    // write an entity with a provided entityId
    entity = {
      date: new Date('1978-10-09T00:00:00.000Z'),
      title: "Bigfoot by the Walmart",
      observed: "I saw Bigfoot at Walmart buying flip flops. He wears a size 17.",
      classification: [ 'Class A', 'Class B' ],
      location: {
        latlong: { longitude: 12.34, latitude: 56.78 },
      },
      temperature: {
        high: 53,
        average: 47,
        low: 42
      },
      fullMoon: false,
    }

    entity = await repository.save('8087', entity)
    entityId = entity[EntityId]

    expect(entityId).toBe('8087')

    // fetch an entity
    entity = await repository.fetch('8086')

    // update an entity
    entity.date = new Date('1978-10-09T00:00:00.000Z')
    entity.temperature!.low = 29
    entity.location!.county = "Athens"
    entity.location!.state = "Ohio"
    entity.location!.latlng = { longitude: 23.45, latitude: 67.89 }

    await repository.save(entity)

    // remove a couple of entities
    await repository.remove('8086', '8087')

    // search for all entities
    const allEntities = await repository.search().all()

    // search for some entities
    const someEntities = await repository.search()
      .where(s => s
        .where('state').equals('OH')
        .or('state').equals('KY')
      )
      .and('classification').contains('Class A')
      .and('latlng').inCircle(circle => circle.origin(23.45, 67.89).radius(50).miles)
      .and('date').before(new Date('2000-01-01T00:00:00.000Z'))
      .and('title').matchesExactly('the walmart')
      .and('fullMoon').is.true().returnAll()


    // execute a raw search
    const someOtherEntities = await repository.searchRaw('@fullMoon:{true} @latlng:[23.45 67.89 50 mi]').returnAll()

    // clean up
    await repository.dropIndex()
    const allIds: string[] = allEntities.map(entity => entity.entityId ?? '') as string[]
    await repository.remove(allIds)

    // close Redis
    await redis.quit()
  })
})
