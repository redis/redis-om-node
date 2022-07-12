<div align="center">
  <br/>
  <br/>
  <img width="360" src="logo.svg" alt="Redis OM" />
  <br/>
  <br/>
</div>

<p align="center">
    <p align="center">
        Object mapping, and more, for Redis and Node.js. Written in TypeScript.
    </p>
</p>

---
[![Discord][discord-shield]][discord-url]
[![Twitch][twitch-shield]][twitch-url]
[![YouTube][youtube-shield]][youtube-url]
[![Twitter][twitter-shield]][twitter-url]

[![NPM][package-shield]][package-url]
[![Build][build-shield]][build-url]
[![License][license-shield]][license-url]

**Redis OM Node.js** makes it easy to model Redis data in your Node.js applications.

[Redis OM .NET][redis-om-dotnet] | **Redis OM Node.js** | [Redis OM Python][redis-om-python] | [Redis OM Spring][redis-om-spring]

<details>
  <summary><strong>Table of contents</strong></summary>

  - 💡 [Redis OM for Node.js](#-redis-om-for-nodejs)
  - 🏁 [Getting Started](#-getting-started)
  - 🔌 [Connect to Redis with a Client](#-connect-to-redis-with-a-client)
    - [Redis Connection Strings](#redis-connection-strings)
  - 📇 [Define an Entity and a Schema](#-define-an-entity-and-a-schema)
  - 🖋 [Reading, Writing, and Removing with Repository](#-reading-writing-and-removing-with-repository)
    - [Missing Entities and Null Values](#missing-entities-and-null-values)
    - [A Note for TypeScript Users](#a-note-for-typescript-users)
  - 🧮 [Embedding Your Own Logic into Entities](#-embedding-your-own-logic-into-entities)
  - 📄 [Using Hashes](#-using-hashes)
  - 🔎 [Using RediSearch](#-using-redisearch)
    - [Build the Index](#build-the-index)
    - [Finding All The Things (and Returning Them)](#finding-all-the-things-and-returning-them)
      - [Pagination](#pagination)
      - [First Things First](#first-things-first)
      - [Counting](#counting)
    - [Finding Specific Things](#finding-specific-things)
      - [Searching on Strings](#searching-on-strings)
      - [Searching on Numbers](#searching-on-numbers)
      - [Searching on Booleans](#searching-on-booleans)
      - [Searching on Dates](#searching-on-dates)
      - [Searching String Arrays](#searching-string-arrays)
      - [Full-Text Search](#full-text-search)
      - [Searching on Points](#searching-on-points)
      - [Chaining Searches](#chaining-searches)
      - [Running Raw Searches](#running-raw-searches)
    - [Sorting Search Results](#sorting-search-results)
  - 📚 [Documentation](#-documentation)
  - ⛏️ [Troubleshooting](#%EF%B8%8F-troubleshooting)
  - ❤️ [Contributing](#%EF%B8%8F-contributing)
</details>

## 💡 Redis OM for Node.js

Redis OM (pronounced _REDiss OHM_) makes it easy to add Redis to your Node.js application by mapping the Redis data structures you know and love to classes that you define. No more pesky, low-level commands, just pure code with a fluent interface.

Define an entity:

```javascript
class Album extends Entity {}

const schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'text' },
  year: { type: 'number' }
});
```

Create a new entity and save it:

```javascript
const album = repository.createEntity()
album.artist = "Mushroomhead"
album.title = "The Righteous & The Butterfly"
album.year = 2014
await repository.save(album)
```

Search for matching entities:

```javascript
const albums = await repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000).return.all()
```

Pretty cool, right? Read on for details.

## 🏁 Getting Started

First things first, get yourself a Node.js project. There are lots of ways to do this, but I'm gonna go with a classic:

    $ npm init

Once you have that sweet, sweet `package.json`, let's add our newest favorite package to it:

    $ npm install redis-om --save

Of course, you'll need some Redis, preferably [Redis Stack][redis-stack-url] as it comes with [RediSearch][redisearch-url] and [RedisJSON][redis-json-url] ready to go. The easiest way to do this is to set up a free [Redis Cloud][redis-cloud-url] instance. But, you can also use Docker:

    $ docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

Excellent. Setup done. Let's write some code!

## 🔌 Connect to Redis with a Client

You connect to Redis using a [*client*](docs/classes/Client.md). The `Client` class has methods to open, close, and execute raw commands against Redis.

```javascript
import { Client } from 'redis-om'

const client = new Client()
await client.open('redis://localhost:6379')

const aString = await client.execute(['PING'])
// 'PONG'

const aNumber = await client.execute(['HSET', 'foo', 'bar', 'baz', 'qux', 42])
// 2

const anArray = await client.execute(['HGETALL', 'foo'])
// [ 'bar', 'baz', 'qux', '42' ]

await client.close()
```

<details>
<summary>Or, in TypeScript:</summary>

In Typescript you should type cast the returning type.
Typecasts can be done in 2 ways, casting it before the returning value `client.execute(["PING"])` or after using the `as` keyword `client.execute(["PING"]) as string`.

```typescript
import { Client } from 'redis-om';

let client = await new Client().open('redis://localhost:6379');

let aString = await <string>client.execute(['PING']);
// 'PONG'

let aNumber = await <number>client.execute(['HSET', 'foo', 'bar', 'baz', 'qux', 42]);
// 2

let anArray = await <Array<string>>client.execute(['HGETALL', 'foo']);
// [ 'bar', 'baz', 'qux', '42' ]
await client.close();
```
</details>

Mostly you'll use `.open`, `.close`, and `.fetchRepository` (which we'll talk about soon enough). But, on occasion, you might need to talk to Redis directly. The `.execute` method allows you to do that.

If you find you need to talk to Redis directly a *lot* or you need more than just a basic connection to Redis, you'll want to take a look at the `.use` method on `Client`. It will allow you to bind an existing [Node Redis](https://github.com/redis/node-redis) connection to your Redis OM Client:

```javascript
import { createClient } from 'redis'
import { Client } from 'redis-om'

const redis = createClient('redis://localhost:6379')
await redis.connect()
const client = await new Client().use(redis)

await redis.set('foo', 'bar')
const value = await client.execute(['GET', 'foo'])
```

Use `.use` to take advantage of things like [clustering](https://github.com/redis/node-redis#clustering). Details on all that stuff are way beyond the scope of this README. You can read about it in the Node Redis [documentation](https://github.com/redis/node-redis).

### Redis Connection Strings

When you open a Redis client, you hand it a URL. The basic format for this URL is:

    redis://username:password@host:port

This is the bulk of what you will need, but if you want more, the full specification for the URL is [defined with the IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). And yes, there is a [TLS version](https://www.iana.org/assignments/uri-schemes/prov/rediss) as well.

If you don't provide a URL, it defaults to `redis://localhost:6379`.

## 📇 Define an Entity and a Schema

Ok. Let's start doing some object mapping. We'll start by defining an [*entity*](docs/classes/Entity.md) and a [*schema*](docs/classes/Schema.md).

```javascript
import { Entity, Schema } from 'redis-om'
```

[Entities](docs/classes/Entity.md) are the classes that you work with. The things being created, read, updated, and deleted. Any class that extends `Entity` is an entity. Usually, you'll define an entity with a single line of code:

```javascript
class Album extends Entity {}
class Studio extends Entity {}
```

[Schemas](docs/classes/Schema.md) define the fields on your entity, their types, and how they are mapped internally to Redis. By default, entities map to JSON documents using RedisJSON, but you can change it to use Hashes if want (more on that later):

```javascript
const albumSchema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'text' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
})

const studioSchema = new Schema(Studio, {
  name: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  location: { type: 'point' },
  established: { type: 'date' }
})
```

When you create a `Schema`, it modifies the entity you handed it, adding getters and setters for the properties you define. The type those getters and setters accept and return are defined with the type parameter above. Valid values are: `string`, `number`, `boolean`, `string[]`, `date`, `point`, or `text`.

The first three do exactly what you think—they define a property that is a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), a [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), or a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean). `string[]` does what you'd think as well, specifically defining an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of Strings.

`date` is a little different, but still more or less what you'd expect. It defines a property that returns a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) and can be set using not only a Date but also a String containing an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date or a number with the [UNIX epoch time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps) in *seconds* (NOTE: the JavaScript Date object is specified in *milliseconds*).

A `point` defines a point somewhere on the globe as a longitude and a latitude. It defines a property that returns and accepts a simple object with `longitude` and `latitude` properties. Like this:

```javascript
const point = { longitude: 12.34, latitude: 56.78 }
```

A `text` field is a lot like a `string`. If you're just reading and writing objects, they are identical. But if you want to *search* on them, they are very, very different. I'll cover that in detail when I talk about [using RediSearch](#-using-redisearch) but the tl;dr is that `string` fields can only be matched on their whole value—no partial matches—and are best for keys while `text` fields have full-text search enabled on them and are optimized for human-readable text.

Additional field options can be set depending on the field type. These correspond to the [Field Options](https://redis.io/commands/ft.create/#field-options) available when creating a RediSearch full-text index. Other than the `separator` option, these only affect how content is indexed and searched.

|  schema type   | RediSearch type | `indexed` | `sortable` | `normalized` | `stemming` | `phonetic` | `weight` | `separator` | `caseSensitive` |
| -------------- | :-------------: | :-------: | :--------: | :----------: | :--------: | :--------: | :------: | :---------: | :-------------: |
| `string`       |       TAG       |    yes    |  HASH Only |   HASH Only  |      -     |      -     |     -    |     yes     |        yes      |
| `number`       |     NUMERIC     |    yes    |    yes     |       -      |      -     |      -     |     -    |      -      |         -       |
| `boolean`      |       TAG       |    yes    |  HASH Only |       -      |      -     |      -     |     -    |      -      |         -       |
| `string[]`     |       TAG       |    yes    |  HASH Only |   HASH Only  |      -     |      -     |     -    |     yes     |        yes      |
| `date`         |     NUMERIC     |    yes    |    yes     |       -      |            |      -     |     -    |      -      |         -       |
| `point`        |       GEO       |    yes    |     -      |       -      |            |      -     |     -    |      -      |         -       |
| `text`         |       TEXT      |    yes    |    yes     |      yes     |     yes    |     yes    |    yes   |      -      |         -       |

* `indexed`: true | false, whether this field is indexed by RediSearch (default true)
* `sortable`: true | false, whether to create an additional index to optmize sorting (default false)
* `normalized`: true | false, whether to apply normalization for sorting (default true)
* `matcher`: string defining phonetic matcher which can be one of 'dm:en' for English | 'dm:fr' for French | 'dm:pt' for Portugese)| 'dm:es' for Spanish (default none)
* `stemming`: true | false, whether word stemming is applied to text fields (default true)
* `weight`: number, the importance weighting to use when ranking results (default 1)
* `separator`: string, the character to delimit multiple tags (default '|')
* `caseSensitive`: true | false, whether original letter casing is kept for search (default false)

Example showing additional options:

```javascript
const commentSchema = new Schema(Comment, {
  name: { type: 'text', stemming: false, matcher: 'dm:en' },
  email: { type: 'string', normalized: false, },
  posted: { type: 'date', sortable: true },
  title: { type: 'text', weight: 2 },
  comment: { type: 'text', weight: 1 },
  approved: { type: 'boolean', indexed: false },
  iphash: { type: 'string', caseSensitive: true },
  notes: { type: 'string', indexed: false },
})
```

There are several other options available when defining a schema for your entity. Check them out in the [detailed documentation](docs/classes/Schema.md) for the `Schema` class.

## 🖋 Reading, Writing, and Removing with Repository

Now that we have a client and a schema, we have what we need to make a [*repository*](docs/classes/Repository.md). A repository provides the means to read, write, and remove entities. Creating a repository is pretty straightforward—just ask the client for it:

```javascript
import { Repository } from 'redis-om'

const albumRepository = client.fetchRepository(albumSchema)
const studioRepository = client.fetchRepository(studioSchema)
```

Once we have a repository, we can use it to create entities:

```javascript
const album = albumRepository.createEntity()
album.entityId // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

Note that entities created by `.createEntity` are not saved to Redis (at least not yet). They've only been instantiated and populated with an entity ID. This ID is a [ULID](https://github.com/ulid/spec) and is a unique id representing that object. To create a new entity *and* save it to Redis, we need to set all the properties on the entity that we care about, and call `.save`:

```javascript
const album = albumRepository.createEntity()
album.artist = "Mushroomhead"
album.title = "The Righteous & The Butterfly"
album.year = 2014
album.genres = [ 'metal' ]
album.outOfPublication = true

const id = await albumRepository.save(album) // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

As a convenience, you can pass in the values for the entity in the constructor:

```javascript
const studio = studioRepository.createEntity({
  name: "Bad Racket Recording Studio",
  city: "Cleveland",
  state: "Ohio",
  location: { longitude: -81.6764187, latitude: 41.5080462 },
  established: new Date('2010-12-27')
})

const id = await studioRepository.save(studio) // '01FVDN241NGTPHSAV0DFDBXC90'
```

And for even *more* convenience, you can create and save in a single call:

```javascript
const studio = studioRepository.createAndSave({
  name: "Bad Racket Recording Studio",
  city: "Cleveland",
  state: "Ohio",
  location: { longitude: -81.6764187, latitude: 41.5080462 },
  established: new Date('2010-12-27')
})
```

You also use `.save` to update an existing entity:

```javascript
album.genres = [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication = false

const id = await albumRepository.save(album) // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

If you know an object's entity ID you can `.fetch` it:

```javascript
const album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.artist // "Mushroomhead"
album.title // "The Righteous & The Butterfly"
album.year // 2014
album.genres // [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication // false
```

Or `.remove` it:

```javascript
await studioRepository.remove('01FVDN241NGTPHSAV0DFDBXC90')
```

You can also set an entity to expire after a certain number of seconds. Redis will automatically remove that entity when the time's up. Use the `.expire` method to do this:

```javascript
const ttlInSeconds = 12 * 60 * 60  // 12 hours
await studioRepository.expire('01FVDN241NGTPHSAV0DFDBXC90', ttlInSeconds)
```

### Missing Entities and Null Values

Redis, and by extension Redis OM, doesn't differentiate between missing and null. Missing fields in Redis are returned as `null`, and missing keys return `null`. So, if you fetch an entity that doesn't exist, it will happily return you an entity full of nulls:

```javascript
const album = await albumRepository.fetch('DOES_NOT_EXIST')
album.artist // null
album.title // null
album.year // null
album.genres // null
album.outOfPublication // null
```

Conversely, if you set all the properties on an entity to `null` and then save it, it will remove the entity from Redis:

```javascript
const album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.artist = null
album.title = null
album.year = null
album.genres = null
album.outOfPublication = null

const id = await albumRepository.save(album)

const exists = await client.execute(['EXISTS', 'Album:01FJYWEYRHYFT8YTEGQBABJ43J']) // 0
```

It does this because Redis—particularly Redis Hashes—doesn't distinguish between missing and null. You could have an entity that is all nulls. Or you could not. Redis doesn't know which is your intention, and so always returns *something* when you call `.fetch`.

### A Note for TypeScript Users

When you define an entity and schema in TypeScript, all is well. But when you go to *use* that entity, you might have a problem. You'll get an error accessing the properties that the schema added to the entity. This code won't work:

```typescript
const album = albumRepository.createEntity()
album.artist = "Mushroomhead"                 // Property 'artist' does not exist on type 'Album'
album.title = "The Righteous & The Butterfly" // Property 'title' does not exist on type 'Album'
album.year = 2014                             // Property 'year' does not exist on type 'Album'
album.genres = [ 'metal' ]                    // Property 'genres' does not exist on type 'Album'
album.outOfPublication = true                 // Property 'outOfPublication' does not exist on type 'Album'
```

To fix this—without resorting to `// @ts-ignore`—add an interface with the same name as your entity. On that interface, add all the properties you provided to the schema:

```typescript
interface Album {
  artist: string;
  title: string;
  year: number;
  genres: string[];
  outOfPublication: boolean;
}

class Album extends Entity {}

const albumSchema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
})
```

## 🧮 Embedding Your Own Logic into Entities

You might be looking at how you define an entity and think it's a bit odd. Just an empty class? Really? Well, this class can contain additional logic that works with the data it retrieves from Redis. Which can be pretty useful.

You can use this to create computed fields and add domain logic:

```javascript
class Album extends Entity {
  get is70sRock() {
    return this.year >= 1970 && this.year < 1980 && this.genres.includes('rock')
  }

  makeItRock() {
    this.genres.push('rock');
  }
}
```

Or even use more Redis OM to find related entities:

```javascript
class Album extends Entity {
  async recordedAt() {
    return await studioRepository.fetch(this.studioId)
  }
}
```

## 📄 Using Hashes

By default, Redis OM stores your entities in JSON documents. But if you're not using [RedisJSON][redis-json-url], you can instead choose to store your entities as Hashes. It works exactly the same as using JSON, but when you define your schema, just pass in an option telling it to use Hashes:

```javascript
const albumSchema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'HASH'
})
```

Everything else is the same.

## 🔎 Using RediSearch

Using [RediSearch][redisearch-url] with Redis OM is where the power of this fully armed and operational battle station starts to become apparent. If you have RediSearch installed on your Redis server you can use the search capabilities of Redis OM. This enables commands like:

```javascript
const albums = await albumRepository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000)
    .return.all()
```

Let's explore this in full.

### Build the Index

To use search you have to build an index. If you don't, you'll get errors. To build an index, just call `.createIndex` on your repository:

```javascript
await albumRepository.createIndex();
```

If you change your schema, no worries. Redis OM will automatically rebuild the index for you. Just call `.createIndex` again. And don't worry if you call `.createIndex` when your schema *hasn't* changed. Redis OM will only rebuild your index if the schema has changed. So, you can safely use it in your startup code.

However, if you have a *lot* of data, rebuilding an index can take some time. So, you might want to explicitly manage the building and rebuilding of your indices in some sort of deployment code script thing. To support those devops sorts of things, Redis OM includes a `.dropIndex` method to explicit remove an index without rebuilding it:

```javascript
await albumRepository.dropIndex();
```

You probably won't use this in your application, but if you come up with a cool use for it, I'd love to hear about it!

### Finding All The Things (and Returning Them)

Once you have an index created (or recreated) you can search. The most basic search is to just return all the things. This will return all of the albums that you've put in Redis:

```javascript
const albums = await albumRepository.search().return.all()
```

#### Pagination

It's possible you have a *lot* of albums; I know I do. In that case, you can page through the results. Just pass in the zero-based offset and the number of results you want:

```javascript
const offset = 100
const count = 25
const albums = await albumRepository.search().return.page(offset, count)
```

Don't worry if your offset is greater than the number of entities. If it is, you just get an empty array back. No harm, no foul.

#### First Things First

Sometimes you only have one album. Or maybe you only care about the first album you find. You can easily grab the first result of your search with `.first`:

```javascript
const firstAlbum = await albumRepository.search().return.first();
```

Note: If you have *no* albums, this will return `null`.

#### Counting

Sometimes you just want to know how many albums you have. For that, you can call `.count`:

```javascript
const count = await albumRepository.search().return.count()
```

### Finding Specific Things

It's fine and dandy to return all the things. But that's not what you usually want to do. You want to find *specific* things. Redis OM will let you find those specific things by [strings](#searching-on-strings), [numbers](#searching-on-numbers), and [booleans](#searching-on-booleans). You can also search for strings that are in an [array](#searching-string-arrays), perform [full-text search](#full-text-search) within strings, search by [date](#searching-on-dates), and search for [points](#searching-on-points) on the globe within a particular area.

And it does it with a fluent interface that allows—but does not demand—code that reads like a sentence. See below for exhaustive examples of all the syntax available to you.

#### Searching on Strings

When you set the field type in your schema to `string`, you can search for a whole string. This syntax will not search for partial strings or words within a string. It only matches the *entire* string. If you want to search for words or partial words within text you need to use the `text` type and search it using the [Full-Text Search](#full-text-search) syntax.

```javascript
let albums

// find all albums where the artist is 'Mushroomhead'
albums = await albumRepository.search().where('artist').eq('Mushroomhead').return.all()

// find all albums where the artist is *not* 'Mushroomhead'
albums = await albumRepository.search().where('artist').not.eq('Mushroomhead').return.all()

// fluent alternatives that do the same thing
albums = await albumRepository.search().where('artist').equals('Mushroomhead').return.all()
albums = await albumRepository.search().where('artist').does.equal('Mushroomhead').return.all()
albums = await albumRepository.search().where('artist').is.equalTo('Mushroomhead').return.all()
albums = await albumRepository.search().where('artist').does.not.equal('Mushroomhead').return.all()
albums = await albumRepository.search().where('artist').is.not.equalTo('Mushroomhead').return.all()
```

#### Searching on Numbers

When you set the field type in your schema to `number`, you can store both integers and floating-point numbers. And you can search against it with all the comparisons you'd expect to see:

```javascript
let albums

// find all albums where the year is ===, >, >=, <, and <= 1984
albums = await albumRepository.search().where('year').eq(1984).return.all()
albums = await albumRepository.search().where('year').gt(1984).return.all()
albums = await albumRepository.search().where('year').gte(1984).return.all()
albums = await albumRepository.search().where('year').lt(1984).return.all()
albums = await albumRepository.search().where('year').lte(1984).return.all()

// find all albums where year is between 1980 and 1989 inclusive
albums = await albumRepository.search().where('year').between(1980, 1989).return.all()

// find all albums where the year is *not* ===, >, >=, <, and <= 1984
albums = await albumRepository.search().where('year').not.eq(1984).return.all()
albums = await albumRepository.search().where('year').not.gt(1984).return.all()
albums = await albumRepository.search().where('year').not.gte(1984).return.all()
albums = await albumRepository.search().where('year').not.lt(1984).return.all()
albums = await albumRepository.search().where('year').not.lte(1984).return.all()

// find all albums where year is *not* between 1980 and 1989 inclusive
albums = await albumRepository.search().where('year').not.between(1980, 1989);

// fluent alternatives that do the same thing
albums = await albumRepository.search().where('year').equals(1984).return.all()
albums = await albumRepository.search().where('year').does.equal(1984).return.all()
albums = await albumRepository.search().where('year').does.not.equal(1984).return.all()
albums = await albumRepository.search().where('year').is.equalTo(1984).return.all()
albums = await albumRepository.search().where('year').is.not.equalTo(1984).return.all()

albums = await albumRepository.search().where('year').greaterThan(1984).return.all()
albums = await albumRepository.search().where('year').is.greaterThan(1984).return.all()
albums = await albumRepository.search().where('year').is.not.greaterThan(1984).return.all()

albums = await albumRepository.search().where('year').greaterThanOrEqualTo(1984).return.all()
albums = await albumRepository.search().where('year').is.greaterThanOrEqualTo(1984).return.all()
albums = await albumRepository.search().where('year').is.not.greaterThanOrEqualTo(1984).return.all()

albums = await albumRepository.search().where('year').lessThan(1984).return.all()
albums = await albumRepository.search().where('year').is.lessThan(1984).return.all()
albums = await albumRepository.search().where('year').is.not.lessThan(1984).return.all()

albums = await albumRepository.search().where('year').lessThanOrEqualTo(1984).return.all()
albums = await albumRepository.search().where('year').is.lessThanOrEqualTo(1984).return.all()
albums = await albumRepository.search().where('year').is.not.lessThanOrEqualTo(1984).return.all()

albums = await albumRepository.search().where('year').is.between(1980, 1989).return.all()
albums = await albumRepository.search().where('year').is.not.between(1980, 1989).return.all()
```

#### Searching on Booleans

You can search against fields that contain booleans if you defined a field type of `boolean` in your schema:

```javascript
let albums

// find all albums where outOfPublication is true
albums = await albumRepository.search().where('outOfPublication').true().return.all()

// find all albums where outOfPublication is false
albums = await albumRepository.search().where('outOfPublication').false().return.all()
```

You can negate boolean searches. This might seem odd, but if your field is `null`, then it would match on a `.not` query:

```javascript
// find all albums where outOfPublication is false or null
albums = await albumRepository.search().where('outOfPublication').not.true().return.all()

// find all albums where outOfPublication is true or null
albums = await albumRepository.search().where('outOfPublication').not.false().return.all()
```

And, of course, there's lots of syntactic sugar to make this fluent:

```javascript
albums = await albumRepository.search().where('outOfPublication').eq(true).return.all()
albums = await albumRepository.search().where('outOfPublication').equals(true).return.all()
albums = await albumRepository.search().where('outOfPublication').does.equal(true).return.all()
albums = await albumRepository.search().where('outOfPublication').is.equalTo(true).return.all()

albums = await albumRepository.search().where('outOfPublication').true().return.all()
albums = await albumRepository.search().where('outOfPublication').false().return.all()
albums = await albumRepository.search().where('outOfPublication').is.true().return.all()
albums = await albumRepository.search().where('outOfPublication').is.false().return.all()

albums = await albumRepository.search().where('outOfPublication').not.eq(true).return.all()
albums = await albumRepository.search().where('outOfPublication').does.not.equal(true).return.all()
albums = await albumRepository.search().where('outOfPublication').is.not.equalTo(true).return.all()
albums = await albumRepository.search().where('outOfPublication').is.not.true().return.all()
albums = await albumRepository.search().where('outOfPublication').is.not.false().return.all()
```

#### Searching on Dates

If you have a field type of `date` in your schema, you can search on it using [Dates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formated strings, or the [UNIX epoch time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps) in *seconds*:

```javascript
studios = await studioRepository.search().where('established').on(new Date('2010-12-27')).return.all()
studios = await studioRepository.search().where('established').on('2010-12-27').return.all()
studios = await studioRepository.search().where('established').on(1293408000).return.all()
```

There are several date comparison methods to use. And they can be negated:

```javascript
const date = new Date('2010-12-27')
const laterDate = new Date('2020-12-27')

studios = await studioRepository.search().where('established').on(date).return.all()
studios = await studioRepository.search().where('established').not.on(date).return.all()
studios = await studioRepository.search().where('established').before(date).return.all()
studios = await studioRepository.search().where('established').not.before(date).return.all()
studios = await studioRepository.search().where('established').after(date).return.all()
studios = await studioRepository.search().where('established').not.after(date).return.all()
studios = await studioRepository.search().where('established').onOrBefore(date).return.all()
studios = await studioRepository.search().where('established').not.onOrBefore(date).return.all()
studios = await studioRepository.search().where('established').onOrAfter(date).return.all()
studios = await studioRepository.search().where('established').not.onOrAfter(date).return.all()
studios = await studioRepository.search().where('established').between(date, laterDate).return.all()
studios = await studioRepository.search().where('established').not.between(date, laterDate).return.all()
```

More fluent variations work too:

```javascript
const date = new Date('2010-12-27')
const laterDate = new Date('2020-12-27')

studios = await studioRepository.search().where('established').is.on(date).return.all()
studios = await studioRepository.search().where('established').is.not.on(date).return.all()

studios = await studioRepository.search().where('established').is.before(date).return.all()
studios = await studioRepository.search().where('established').is.not.before(date).return.all()

studios = await studioRepository.search().where('established').is.onOrBefore(date).return.all()
studios = await studioRepository.search().where('established').is.not.onOrBefore(date).return.all()

studios = await studioRepository.search().where('established').is.after(date).return.all()
studios = await studioRepository.search().where('established').is.not.after(date).return.all()

studios = await studioRepository.search().where('established').is.onOrAfter(date).return.all()
studios = await studioRepository.search().where('established').is.not.onOrAfter(date).return.all()

studios = await studioRepository.search().where('established').is.between(date, laterDate).return.all()
studios = await studioRepository.search().where('established').is.not.between(date, laterDate).return.all()
```

And, since dates are really just numbers, all the numeric comparisons work too:

```javascript
const date = new Date('2010-12-27')
const laterDate = new Date('2020-12-27')

studios = await studioRepository.search().where('established').eq(date).return.all()
studios = await studioRepository.search().where('established').not.eq(date).return.all()
studios = await studioRepository.search().where('established').equals(date).return.all()
studios = await studioRepository.search().where('established').does.equal(date).return.all()
studios = await studioRepository.search().where('established').does.not.equal(date).return.all()
studios = await studioRepository.search().where('established').is.equalTo(date).return.all()
studios = await studioRepository.search().where('established').is.not.equalTo(date).return.all()

studios = await studioRepository.search().where('established').gt(date).return.all()
studios = await studioRepository.search().where('established').not.gt(date).return.all()
studios = await studioRepository.search().where('established').greaterThan(date).return.all()
studios = await studioRepository.search().where('established').is.greaterThan(date).return.all()
studios = await studioRepository.search().where('established').is.not.greaterThan(date).return.all()

studios = await studioRepository.search().where('established').gte(date).return.all()
studios = await studioRepository.search().where('established').not.gte(date).return.all()
studios = await studioRepository.search().where('established').greaterThanOrEqualTo(date).return.all()
studios = await studioRepository.search().where('established').is.greaterThanOrEqualTo(date).return.all()
studios = await studioRepository.search().where('established').is.not.greaterThanOrEqualTo(date).return.all()

studios = await studioRepository.search().where('established').lt(date).return.all()
studios = await studioRepository.search().where('established').not.lt(date).return.all()
studios = await studioRepository.search().where('established').lessThan(date).return.all()
studios = await studioRepository.search().where('established').is.lessThan(date).return.all()
studios = await studioRepository.search().where('established').is.not.lessThan(date).return.all()

studios = await studioRepository.search().where('established').lte(date).return.all()
studios = await studioRepository.search().where('established').not.lte(date).return.all()
studios = await studioRepository.search().where('established').lessThanOrEqualTo(date).return.all()
studios = await studioRepository.search().where('established').is.lessThanOrEqualTo(date).return.all()
studios = await studioRepository.search().where('established').is.not.lessThanOrEqualTo(date).return.all()
```

#### Searching String Arrays

If you have a field type of `string[]` you can search for *whole strings* that are in that array:

```javascript
let albums

// find all albums where genres contains the string 'rock'
albums = await albumRepository.search().where('genres').contain('rock').return.all()

// find all albums where genres contains the string 'rock', 'metal', or 'blues'
albums = await albumRepository.search().where('genres').containOneOf('rock', 'metal', 'blues').return.all()

// find all albums where genres does *not* contain the string 'rock'
albums = await albumRepository.search().where('genres').not.contain('rock').return.all()

// find all albums where genres does *not* contain the string 'rock', 'metal', and 'blues'
albums = await albumRepository.search().where('genres').not.containOneOf('rock', 'metal', 'blues').return.all()

// alternative syntaxes
albums = await albumRepository.search().where('genres').contains('rock').return.all()
albums = await albumRepository.search().where('genres').containsOneOf('rock', 'metal', 'blues').return.all()
albums = await albumRepository.search().where('genres').does.contain('rock').return.all()
albums = await albumRepository.search().where('genres').does.not.contain('rock').return.all()
albums = await albumRepository.search().where('genres').does.containOneOf('rock', 'metal', 'blues').return.all()
albums = await albumRepository.search().where('genres').does.not.containOneOf('rock', 'metal', 'blues').return.all()
```

#### Full-Text Search

If you've defined a field with a type of `text` in your schema, you can store text in it and perform full-text searches against it. Full-text search is different from how a `string` is searched, which can only match the entire string. With full-text search, you can look for words, partial words, and exact phrases within a body of text.

Full-text search is optimized for human-readable text and it's pretty clever. It understands that certain words (like *a*, *an*, or *the*) are common and ignores them. It understands how words relate to each other and so if you search for *give*, it matches *gives*, *given*, *giving*, and *gave* too. It ignores punctuation.

Here are some examples of doing full-text search against some album titles:

```javascript
let albums

// finds all albums where the title contains the word 'butterfly'
albums = await albumRepository.search().where('title').match('butterfly').return.all()

// finds all albums where the title contains the the words 'beautiful' and 'children'
albums = await albumRepository.search().where('title').match('beautiful children').return.all()

// finds all albums where the title contains the exact phrase 'beautiful stories'
albums = await albumRepository.search().where('title').matchExact('beautiful stories').return.all()
```

If you want to search for a part of a word, you can do that too, but only the front part of a word. To do it, just tack a `*` on the end of your partial word and it'll match accordingly:

```javascript
// finds all albums where the title contains a word that starts with 'right'
albums = await albumRepository.search().where('title').match('right*').return.all()
```

However, this only works for the front part of a word. And you need to provide *at least* two characters. So, for example, the following queries will *not* work:

```javascript
// INVALID: Wildcard must be at the end of the word
albums = await albumRepository.search().where('title').match('*fly').return.all()
albums = await albumRepository.search().where('title').match('*hild*').return.all()

// INVALID: At least two characters required before wildcard
albums = await albumRepository.search().where('title').match('b*').return.all()
```

Also, do not combine partial-word searches with exact matches. Partial-word searches and exact matches are not compatible in RediSearch. If you try to exactly match a partial-word search, you'll get an error.

```javascript
// THIS WILL ERROR
albums = await albumRepository.search().where('title').matchExact('beautiful sto*').return.all()
```

As always, there are several alternatives to make this a bit more fluent and, of course, negation is available:

```javascript
albums = await albumRepository.search().where('title').not.match('butterfly').return.all()
albums = await albumRepository.search().where('title').matches('butterfly').return.all()
albums = await albumRepository.search().where('title').does.match('butterfly').return.all()
albums = await albumRepository.search().where('title').does.not.match('butterfly').return.all()

albums = await albumRepository.search().where('title').exact.match('beautiful stories').return.all()
albums = await albumRepository.search().where('title').not.exact.match('beautiful stories').return.all()
albums = await albumRepository.search().where('title').exactly.matches('beautiful stories').return.all()
albums = await albumRepository.search().where('title').does.exactly.match('beautiful stories').return.all()
albums = await albumRepository.search().where('title').does.not.exactly.match('beautiful stories').return.all()

albums = await albumRepository.search().where('title').not.matchExact('beautiful stories').return.all()
albums = await albumRepository.search().where('title').matchesExactly('beautiful stories').return.all()
albums = await albumRepository.search().where('title').does.matchExactly('beautiful stories').return.all()
albums = await albumRepository.search().where('title').does.not.matchExactly('beautiful stories').return.all()
```

#### Searching on Points

RediSearch, and therefore Redis OM, both support searching by geographic location. You specify a point in the globe and a radius and it'll gleefully return all the entities within that radius:

```javascript
let studios

// finds all the studios with 50 miles of downtown Cleveland
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).miles).return.all()
```

Note that coordinates are specified with the longitude *first*, and then the latitude. This might be the opposite of what you expect but is consistent with how Redis implements coordinates in [RediSearch](https://oss.redis.com/redisearch/Query_Syntax/) and with [GeoSets](https://redis.io/commands#geo).

If you don't want to rely on argument order, you can also specify longitude and latitude more explicitly:

```javascript
// finds all the studios with 50 miles of downtown Cleveland using a point
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin({ longitude: -81.7758995, latitude: 41.4976393 }).radius(50).miles).return.all()

// finds all the studios with 50 miles of downtown Cleveland using longitude and latitude
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()
```

Radius can be in *miles*, *feet*, *kilometers*, and *meters* in all the spelling variations you could ever want:

```javascript
// finds all the studios within 50 miles
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).mile).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).mi).return.all()

// finds all the studios within 50 feet
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).feet).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).foot).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).ft).return.all()

// finds all the studios within 50 kilometers
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).kilometers).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).kilometer).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).km).return.all()

// finds all the studios within 50 meters
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).meters).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).meter).return.all()

studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50).m).return.all()
```

If you don't specify the origin, Redis OM will use a longitude 0.0 and a latitude 0.0, also known as [Null Island](https://en.wikipedia.org/wiki/Null_Island):

```javascript
// finds all the studios within 50 miles of Null Island (probably ain't much there)
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.radius(50).miles).return.all()
```

If you don't specify the radius, it defaults to *1* and if you don't provide units, it defaults to *meters*:

```javascript
// finds all the studios within 1 meter of downtown Cleveland
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393)).return.all()

// finds all the studios within 1 kilometer of downtown Cleveland
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).kilometers).return.all()

// finds all the studios within 50 meters of downtown Cleveland
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin(-81.7758995, 41.4976393).radius(50)).return.all()
```

And there are plenty of fluent variations to help make your code pretty:

```javascript
studios = await studioRepository.search().where('location').not.inRadius(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').is.inRadius(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').is.not.inRadius(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').not.inCircle(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').is.inCircle(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()

studios = await studioRepository.search().where('location').is.not.inCircle(
  circle => circle.longitude(-81.7758995).latitude(41.4976393).radius(50).miles).return.all()
```

#### Chaining Searches

So far we've been doing searches that match on a single field. However, we often want to query on multiple fields. Not a problem:

```javascript
const albums = await albumRepository.search
  .where('artist').equals('Mushroomhread')
  .or('title').matches('butterfly')
  .and('year').is.greaterThan(1990).return.all()
```

These are executed in order from left to right, and ignore any order of operations. So this query will match an artist of "Mushroomhead" OR a title matching "butterfly" before it goes on to match that the year is greater than 1990.

If you'd like to change this you can nest your queries:

```javascript
const albums = await albumRepository.search
  .where('title').matches('butterfly').return.all()
  .or(search => search
    .where('artist').equals('Mushroomhead')
    .and('year').is.greaterThan(1990)
  )
```

This query finds all Mushroomhead albums after 1990 or albums that have "butterfly" in the title.

#### Running Raw Searches

The fluent search interface is nice, but sometimes you need to do something just a bit more. If you want, you can execute a search against your entities using the native RediSearch query syntax. I'm not going to explain the syntax here as it's a bit involved, but you can [read it for yourself](https://oss.redis.com/redisearch/Query_Syntax/) in the RediSearch documentation.

To execute a raw search, just call `.searchRaw` on the repository with your query:

```javascript
// finds all the Mushroomhead albums with the word 'beautiful' in the title from 1990 and beyond
const query = "@artist:{Mushroomhead} @title:beautiful @year:[1990 +inf]"
const albums = albumRepository.searchRaw(query).return.all();
```

The nice thing here is that it returns the same entities that you've been using for everything else. It's just a lower-level way of executing a query for when you need that extra bit of power.

### Sorting Search Results

RediSearch provides a basic mechanism for sorting your search results and Redis OM exposes it. You can sort on a single field and can sort on the following types: `string`, `number`, `boolean`, `date`, and `text`. To sort, simply call `.sortBy`, `.sortAscending`, or `.sortDescending`:

```javascript
const albumsByYear = await albumRepository.search
  .where('artist').equals('Mushroomhread')
    .sortAscending('year').return.all()

const albumsByTitle = await albumRepository.search
  .where('artist').equals('Mushroomhread')
    .sortBy('title', 'DESC').return.all()
```

You can also tell RediSearch to preload the sorting index to improve performance when you sort. This doesn't work with *all* of the types that you can sort by, but it's still pretty useful. To preload the index, mark the field in the `Schema` with the `sortable` property:

```javascript
const albumSchema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'text', sortable: true },
  year: { type: 'number', sortable: true },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
})
```

If your schema is for a JSON data structure (the default), you can mark `number`, `date`, and `text` fields as sortable. You can also mark `string` and `boolean` field sortable, but this will have no effect and will generate a warning.

If your schema is for a Hash, you can mark `string`, `number`, `boolean`, `date`, and `text` fields as sortable.

Fields of the types `point` and `string[]` are never sortable.

If this seems like a confusion flowchart to parse, don't worry. If you call `.sortBy` on a field in the Schema that's not marked as `sortable` and it *could* be, Redis OM will log a warning to let you know.


## 📚 Documentation

This README is pretty extensive, but if you want to check out every last corner of Redis OM for Node.js, take a look at the complete [API documentation](/docs).

## ⛏️ Troubleshooting

I'll eventually have a FAQ full of answered questions, but since this is a new library, nobody has asked anything yet, frequently or otherwise. So, if you run into a problem, open an issue. Even cooler, dive into the code and send a pull request. If you just want to ping somebody, hit me up on the [Redis Discord server][discord-url].

## ❤️ Contributing

Contributions are always appreciated. I take PayPal and Bitcoin. Just kidding, I would sincerely appreciate your help in making this software better. Here are a couple of ways to help:

- **Bug reports**: This is a new project. You're gonna find them. Open an issue and I'll look into it. Or hunt down the problem and send me a pull request.
- **Documentation**: You can improve the life of a lot of developers by fixing typos, grammar, and bad jokes. Or by just pointing out where a little more detail would help. Again, open an issue or send a pull request.

<!-- Links, Badges, and Whatnot -->

[package-shield]: https://img.shields.io/npm/v/redis-om?logo=npm
[build-shield]: https://img.shields.io/github/workflow/status/redis/redis-om-node/CI/main
[license-shield]: https://img.shields.io/npm/l/redis-om
[discord-shield]: https://img.shields.io/discord/697882427875393627?style=social&logo=discord
[twitch-shield]: https://img.shields.io/twitch/status/redisinc?style=social
[twitter-shield]: https://img.shields.io/twitter/follow/redisinc?style=social
[youtube-shield]: https://img.shields.io/youtube/channel/views/UCD78lHSwYqMlyetR0_P4Vig?style=social

[package-url]: https://www.npmjs.com/package/redis-om
[build-url]: https://github.com/redis/redis-om-node/actions/workflows/ci.yml
[license-url]: LICENSE
[discord-url]: http://discord.gg/redis
[twitch-url]: https://www.twitch.tv/redisinc
[twitter-url]: https://twitter.com/redisinc
[youtube-url]: https://www.youtube.com/redisinc

[redis-cloud-url]: https://redis.com/try-free/
[redis-stack-url]: https://redis.io/docs/stack/
[redisearch-url]: https://oss.redis.com/redisearch/
[redis-json-url]: https://oss.redis.com/redisjson/
[redis-om-dotnet]: https://github.com/redis/redis-om-dotnet
[redis-om-python]: https://github.com/redis/redis-om-python
[redis-om-spring]: https://github.com/redis/redis-om-spring
