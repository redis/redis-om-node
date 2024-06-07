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

**Redis OM for Node.js** makes it easy to model Redis data in your Node.js applications.

[Redis OM .NET][redis-om-dotnet] | **Redis OM Node.js** | [Redis OM Python][redis-om-python] | [Redis OM Spring][redis-om-spring]

<details>
  <summary><strong>Table of contents</strong></summary>

  - [Redis OM for Node.js](#redis-om-for-nodejs)
  - [Getting Started](#getting-started)
  - [Connect to Redis with Node Redis](#connect-to-redis-with-node-redis)
    - [Redis Connection Strings](#redis-connection-strings)
  - [Entities and Schemas](#entities-and-schemas)
    - [JSON and Hashes](#json-and-hashes)
      - [Configuring JSON](#configuring-json)
      - [Configuring Hashes](#configuring-hashes)
  - [Reading, Writing, and Removing with Repository](#reading-writing-and-removing-with-repository)
    - [Creating Entities](#creating-entities)
    - [Missing Entities and Null Values](#missing-entities-and-null-values)
  - [Searching](#searching)
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
      - [Searching Arrays of Numbers](#searching-arrays-of-numbers)
      - [Full-Text Search](#full-text-search)
      - [Searching on Points](#searching-on-points)
      - [Chaining Searches](#chaining-searches)
      - [Running Raw Searches](#running-raw-searches)
    - [Sorting Search Results](#sorting-search-results)
  - [Advanced Stuff](#advanced-stuff)
    - [Schema Options](#schema-options)
  - [Documentation](#documentation)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
</details>

## Redis OM for Node.js

Redis OM (pronounced _REDiss OHM_) makes it easy to add Redis to your Node.js application by mapping the Redis data structures you know and love to simple JavaScript objects. No more pesky, low-level commands, just pure code with a fluent interface.

Define a schema:

```javascript
const schema = new Schema('album', {
  artist: { type: 'string' },
  title: { type: 'text' },
  year: { type: 'number' }
})
```

Create a JavaScript object and save it:

```javascript
const album = {
  artist: "Mushroomhead",
  title: "The Righteous & The Butterfly",
  year: 2014
}

await repository.save(album)
```

Search for matching entities:

```javascript
const albums = await repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000)
    .return.all()
```

Pretty cool, right? Read on for details.

> ## ⚠️ Warning: This Version Has Breaking Changes from 0.3.6
>
> Redis OM 0.4 is new, improved, and includes breaking changes. If you're trying it for the first time, no worries. Just follow what's in this README and you'll be fine.
>
> However, you might be a user of Redis OM already. If that is the case, you'll want to review this document to understand those changes.
>
> Of course, you don't have to upgrade. If this is you, you'll want to check out [the README for that version](https://www.npmjs.com/package/redis-om/v/0.3.6) over on NPM.
>
> However, I hope you choose to try the new version. It has many changes that have been frequently requested that are documented in the [CHANGELOG](CHANGELOG). And more, *non-breaking* changes will follow these.
>


## Getting Started

First things first, get yourself a Node.js project. There are lots of ways to do this, but I'm gonna go with a classic:

    $ npm init

Once you have that sweet, sweet `package.json`, let's add our newest favorite package to it:

    $ npm install redis-om

Redis OM for Node.js uses [Node Redis](https://github.com/redis/node-redis). So you should install that too:

    $ npm install redis

And, of course, you'll need some Redis, preferably [Redis Stack][redis-stack-url] as it comes with [RediSearch][redisearch-url] and [RedisJSON][redis-json-url] ready to go. The easiest way to do this is to set up a free [Redis Cloud][redis-cloud-url] instance. But, you can also use Docker:

    $ docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

Excellent. Setup done. Let's write some code!

## Connect to Redis with Node Redis

Before you can use Redis OM, you need to connect to Redis with Node Redis. Here's how you do that, stolen straight from the top of the Node Redis [README](https://github.com/redis/node-redis):

```javascript
import { createClient } from 'redis'

const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()
```

Node Redis is a powerful piece of software with lots and lots of capabilities. Its details are *way* beyond the scope of this README. But, if you're curious—or if you need that power—you can find all the info in the Node Redis [documentation](https://github.com/redis/node-redis).

Regardless, once you have a connection to Redis you can use it to execute Redis commands:

```javascript

const aString = await redis.ping() // 'PONG'
const aNumber = await redis.hSet('foo', 'alfa', '42', 'bravo', '23') // 2
const aHash = await redis.hGetAll('foo') // { alfa: '42', bravo: '23' }
```

You might not need to do this, but it's always handy to have the option. When you're done with a Redis connection, you can let the server know by calling `.quit`:

```javascript
await redis.quit()
```

### Redis Connection Strings

By default, Node Redis connects to `localhost` on port `6379`. This is, of course, configurable. Just pass in a *url* with the hostname and port that you want to use:

```javascript
const redis = createClient({ url: 'redis://alice:foobared@awesome.redis.server:6380' })
```

The basic format for this URL is:

    redis://username:password@host:port

This will probably cover most scenarios, but if you want something more, the full specification for the URL is [defined with the IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). And yes, there is a [TLS version](https://www.iana.org/assignments/uri-schemes/prov/rediss) as well.

Node Redis has lots of other ways you can create a connection. You can use discrete parameters, UNIX sockets, and all sorts of cool things. Details can be found in the [client configuration guide](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md) for Node Redis and the [clusterting guide](https://github.com/redis/node-redis/blob/master/docs/clustering.md).

## Entities and Schemas

Redis OM is all about saving, reading, and deleting *entities*. An [Entity](docs/README.md#entity) is just data in a JavaScript object that you want to save or retrieve from Redis. Almost any JavaScript object is a valid `Entity`.

[Schemas](docs/classes/Schema.md) define fields that might be on an `Entity`. It includes a field's type, how it is stored internally in Redis, and how to search on it if you are using RediSearch. By default, they are mapped to JSON documents using RedisJSON, but you can change it to use Hashes if want (more on that later).

Ok. Let's start doing some object mapping and create a `Schema`:

```javascript
import { Schema } from 'redis-om'

const albumSchema = new Schema('album', {
  artist: { type: 'string' },
  title: { type: 'text' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  songDurations: { type: 'number[]' },
  outOfPublication: { type: 'boolean' }
})

const studioSchema = new Schema('studio', {
  name: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  location: { type: 'point' },
  established: { type: 'date' }
})
```

The *first argument* is the `Schema` name. It defines the key name prefix that entities stored in Redis will have. It should be unique for your particular instance of Redis and probably meaningful to what you're doing. Here we have selected `album` for our album data and `studio` for data on recording studios. Imaginative, I know.

The *second argument* defines fields that might be stored in that key. The property name is the name of the field that you'll be referencing in your Redis OM queries. The type property tells Redis OM what sort of data is in that field. Valid types are: `string`, `number`, `boolean`, `string[]`, `number[]`, `date`, `point`, and `text`.

The first three types do exactly what you think—they define a field that is a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), a [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), or a [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean). `string[]` and `number[]` do what you'd think as well, specifically describing an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of Strings or Numbers respectively.

`date` is a little different, but still more or less what you'd expect. It describes a property that contains a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) and can be set using not only a Date but also a String containing an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date or a number with the [UNIX epoch time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps) in *seconds* (NOTE: the JavaScript Date object is specified in *milliseconds*).

A `point` defines a point somewhere on the globe as a longitude and a latitude. It is expressed as a simple object with `longitude` and `latitude` properties. Like this:

```javascript
const point = { longitude: 12.34, latitude: 56.78 }
```

A `text` field is a lot like a `string`. If you're just reading and writing objects, they are identical. But if you want to *search* on them, **they are very, very different**. I'll cover that in detail when I talk about [searching](#searching) but the tl;dr is that `string` fields can only be matched on their exact value and are best for keys and discrete data—like postal codes or status indicators—while `text` fields have full-text search enabled on them, are optimized for human-readable text, and can take advantage of [stemming](https://redis.io/docs/stack/search/reference/stemming/) and [stop words](https://redis.io/docs/stack/search/reference/stopwords/).

### JSON and Hashes

As I mentioned earlier, by default Redis OM stores your entities in JSON documents using RedisJSON. You can make this explicit in code if you like:

```javascript
const albumSchema = new Schema('album', {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  songDurations: { type: 'number[]' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'JSON'
})
```

But you can also store your entities as Hashes instead. Just change the `dataStructure` property to reflect it:

```javascript
const albumSchema = new Schema('album', {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'HASH'
})
```

And that's it.

Of course, Hashes and JSON are somewhat different data structures. Hashes are flat with fields containing values. JSON documents, however, are trees and can have depth and—most excitingly—can be nested. This difference is reflected in how Redis OM maps data to entities and how you configure your Schema.

> Note that I have not included the `songDurations` in the Hash. This is because `number[]` is only possible when working with JSON, it will generate an error if you try to use it with Hashes.

#### Configuring JSON

When you store your entities as JSON, the path to the properties in your JSON document and your JavaScript object default to the name of your property in the schema. In the above example, this would result in a document that looks like this:

```json
{
  "artist": "Mushroomhead",
  "title": "The Righteous & The Butterfly",
  "year": 2014,
  "genres": [ "metal" ],
  "songDurations": [ 204, 290, 196, 210, 211, 105, 244, 245, 209, 252, 259, 200, 215, 219 ],
  "outOfPublication": true
}
```

However, you might not want your JavaScript object and your JSON to map this way. So, you can provide a `path` option in your schema that contains a [JSONPath](https://redis.io/docs/stack/json/path/#jsonpath-syntax) pointing to where that field *actually* exists in the JSON and your entity. For example, we might want to store some of the album's data inside of an album property like this:

```json
{
  "album": {
    "artist": "Mushroomhead",
    "title": "The Righteous & The Butterfly",
    "year": 2014,
    "genres": [ "metal" ],
    "songDurations": [ 204, 290, 196, 210, 211, 105, 244, 245, 209, 252, 259, 200, 215, 219 ]
  },
  "outOfPublication": true
}
```

To do this, we'll need to specify the `path` property for the nested fields in the schema:

```javascript
const albumSchema = new Schema('album', {
  artist: { type: 'string', path: '$.album.artist' },
  title: { type: 'string', path: '$.album.title' },
  year: { type: 'number', path: '$.album.year' },
  genres: { type: 'string[]', path: '$.album.genres[*]' },
  songDurations: { type: 'number[]', path: '$.album.songDurations[*]' },
  outOfPublication: { type: 'boolean' }
})
```

There are two things to note here:

  1. We haven't specified a path for `outOfPublication` as it's still in the root of the document. It defaults to `$.outOfPublication`.
  2. Our `genres` field points to a `string[]`. When using a `string[]` the JSONPath must return an array. If it doesn't, an error will be generated.
  3. Same for our `songDurations`.

#### Configuring Hashes

When you store your entities as Hashes there is no nesting—all the entities are flat. In Redis, the properties on your entity are stored in fields inside a Hash. The default name for each field is the name of the property in your schema and this is the name that will be used in your entities. So, for the following schema:

```javascript
const albumSchema = new Schema('album', {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'HASH'
})
```

In your code, your entities would look like this:

```javascript
{
  artist: 'Mushroomhead',
  title: 'The Righteous & The Butterfly',
  year: 2014,
  genres: [ 'metal' ],
  outOfPublication: true
}
```

Inside Redis, your Hash would be stored like this:

| Field            | Value                                   |
|------------------|:----------------------------------------|
| artist           | Mushroomhead                            |
| title            | The Righteous & The Butterfly           |
| year             | 2014                                    |
| genres           | metal                                   |
| outOfPublication | 1                                       |

However, you might not want the names of your fields and the names of the properties on your entity to be exactly the same. Maybe you've got some existing data with existing names or something.

Fear not! You can change the name of the field used by Redis with the `field` property:

```javascript
const albumSchema = new Schema('album', {
  artist: { type: 'string', field: 'album_artist' },
  title: { type: 'string', field: 'album_title' },
  year: { type: 'number', field: 'album_year' },
  genres: { type: 'string[]' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'HASH'
})
```

With this configuration, your entities will remain unchanged and will still have properties for `artist`, `title`, `year`, `genres`, and `outOfPublication`. But inside Redis, the field will have changed:

| Field            | Value                                   |
|------------------|:----------------------------------------|
| album_artist     | Mushroomhead                            |
| album_title      | The Righteous & The Butterfly           |
| album_year       | 2014                                    |
| genres           | metal                                   |
| outOfPublication | 1                                       |

## Reading, Writing, and Removing with Repository

Now that we have a client and a schema, we have what we need to make a [*repository*](docs/classes/Repository.md). A repository provides the means to write, read, and remove entities. Creating a repository is pretty straightforward—just instantiate one with a schema and a client:

```javascript
import { Repository } from 'redis-om'

const albumRepository = new Repository(albumSchema, redis)
const studioRepository = new Repository(studioSchema, redis)
```

Once we have a repository, we can use `.save` to, well, save entities:

```javascript
let album = {
  artist: "Mushroomhead",
  title: "The Righteous & The Butterfly",
  year: 2014,
  genres: [ 'metal' ],
  songDurations: [ 204, 290, 196, 210, 211, 105, 244, 245, 209, 252, 259, 200, 215, 219 ],
  outOfPublication: true
}

album = await albumRepository.save(album)
```

This saves your entity and returns a copy, a copy with some additional properties. The primary property we care about right now is the entity ID, which Redis OM will generate for you. However, this isn't stored and accessed like a typical property. After all, you might have a property in your data with a name that conflicts with the name Redis OM uses and that would create all sorts of problems.

So, Redis OM uses a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) to access it instead. You'll need to import this symbol from Redis OM:

```javascript
import { EntityId } from 'redis-om'
```

Then you can access the entity ID using that symbol:

```javascript
album = await albumRepository.save(album)
album[EntityId] // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

The entity ID that Redis OM generates is a [ULID](https://github.com/ulid/spec) and is a unique id representing that object. If you don't like using generated IDs for some reason and instead want to provide your own, you can totally do that:

```javascript
album = await albumRepository.save('BWOMP', album)
```

Regardless, once you have an object's entity ID you can `.fetch` with it:

```javascript
const album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.artist // "Mushroomhead"
album.title // "The Righteous & The Butterfly"
album.year // 2014
album.genres // [ 'metal' ]
album.songDurations // [ 204, 290, 196, 210, 211, 105, 244, 245, 209, 252, 259, 200, 215, 219 ]
album.outOfPublication // true
```

If you call `.save` with an entity that *already* has an entity ID, probably because you *fetched* it, `.save` will update it instead of creating a new `Entity`:

```javascript
let album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.genres = [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication = false

album = await albumRepository.save(album)
```

You can even use `.save` to clone an `Entity`. Just pass in a new entity ID to `.save` and it'll save the data to that entity ID:

```javascript
const album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.genres = [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication = false

const clonedEntity = await albumRepository.save('BWOMP', album)
```

And, of course, you need to be able to delete things. Use `.remove` to do that:

```javascript
await albumRepository.remove('01FJYWEYRHYFT8YTEGQBABJ43J')
```

You can also set an entity to expire after a certain number of seconds. Redis will automatically remove that entity when the time's up. Use the `.expire` method to do this:

```javascript
const ttlInSeconds = 12 * 60 * 60  // 12 hours
await albumRepository.expire('01FJYWEYRHYFT8YTEGQBABJ43J', ttlInSeconds)
```

### Missing Entities and Null Values

Redis, and by extension Redis OM, doesn't differentiate between missing and null—particularly for Hashes. Missing fields in Redis Hashes are returned as `null`. Missing keys also return `null`. So, if you fetch an entity that doesn't exist, it will happily return you an empty entity, complete with the provided entity ID:

```javascript
const album = await albumRepository.fetch('TOTALLY_BOGUS')
album[EntityId] // 'TOTALLY_BOGUS'
album.artist // undefined
album.title // undefined
album.year // undefined
album.genres // undefined
album.outOfPublication // undefined
```

Conversely, if you remove all the properties on an entity and then save it, it will remove the entity from Redis:

```javascript
const album = await albumRepository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
delete album.artist
delete album.title
delete album.year
delete album.genres
delete album.outOfPublication

const entityId = await albumRepository.save(album)

const exists = await redis.exists('album:01FJYWEYRHYFT8YTEGQBABJ43J') // 0
```

It does this because Redis doesn't distinguish between missing and null. You could have an entity that is empty. Or you could not have an entity at all. Redis doesn't know which is your intention, and so always returns *something* when you call `.fetch`.

## Searching

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

However, if you have a *lot* of data, rebuilding an index can take some time. So, you might want to explicitly manage the building and rebuilding of your indices in some sort of deployment code script thing. To support those devops sorts of things, Redis OM includes a `.dropIndex` method to explicitly remove an index without rebuilding it:

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

Note: If you have *no* albums, this will return `null`. And I feel sorry for you.

#### Counting

Sometimes you just want to know how many albums you have. For that, you can call `.count`:

```javascript
const count = await albumRepository.search().return.count()
```

### Finding Specific Things

It's fine and dandy to return all the things. But that's not what you usually want to do. You want to find *specific* things. Redis OM will let you find those specific things by [strings](#searching-on-strings), [numbers](#searching-on-numbers), and [booleans](#searching-on-booleans). You can also search for strings that are in an [array](#searching-string-arrays), perform [full-text search](#full-text-search) within strings, search by [date](#searching-on-dates), and search for [points](#searching-on-points) on the globe within a particular area.

And it does it with a fluent interface that allows—but does not demand—code that reads like a sentence. See below for exhaustive examples of all the syntax available to you.

#### Searching on Strings

When you set the field type in your schema to `string`, you can search for a particular value in that string. You can also search for partial strings (no shorter than two characters) that occur at the beginning, middle, or end of a string. If you need to search strings in a more sophisticated manner, you'll want to look at the `text` type and search it using the [Full-Text Search](#full-text-search) syntax.

```javascript
let albums

// find all albums where the artist is 'Mushroomhead'
albums = await albumRepository.search().where('artist').eq('Mushroomhead').return.all()

// find all albums where the artist is *not* 'Mushroomhead'
albums = await albumRepository.search().where('artist').not.eq('Mushroomhead').return.all()

// find all albums using wildcards
albums = await albumRepository.search().where('artist').eq('Mush*').return.all()
albums = await albumRepository.search().where('artist').eq('*head').return.all()
albums = await albumRepository.search().where('artist').eq('*room*').return.all()

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

// find all albums where the year is between 1980 and 1989 inclusive
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

If you have a field type of `date` in your schema, you can search on it using [Dates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted strings, or the [UNIX epoch time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps) in *seconds*:

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

Wildcards work here too:

```javascript
albums = await albumRepository.search().where('genres').contain('*rock*').return.all()
```

### Searching Arrays of Numbers

If you have a field of type `number[]`, you can search on it just like a `number`. If any number in the array matches your criteria, then it'll match and the document will be returned.

```javascript
let albums

// find all albums where at least one song is at least 3 minutes long
albums = await albumRepository.search().where('songDuration').gte(180).return.all()

// find all albums where at least one song is at exactly 3 minutes long
albums = await albumRepository.search().where('songDuration').eq(180).return.all()

// find all albums where at least one song is between 3 and 4 minutes long
albums = await albumRepository.search().where('songDuration').between(180, 240).return.all()
```

I'm not going to include all the examples again. Just go check out the section on [searching on numbers](#searching-on-numbers).

#### Full-Text Search

If you've defined a field with a type of `text` in your schema, you can store text in it and perform full-text searches against it. Full-text search is different from how a `string` is searched. With full-text search, you can look for words, partial words, fuzzy matches, and exact phrases within a body of text.

Full-text search is optimized for human-readable text and it's pretty clever. It understands that certain words (like *a*, *an*, or *the*) are common and ignores them. It understands how words relate to each other and so if you search for *give*, it matches *gives*, *given*, *giving*, and *gave* too. It ignores punctuation and whitespace.

Here are some examples of doing full-text search against some album titles:

```javascript
let albums

// finds all albums where the title contains the word 'butterfly'
albums = await albumRepository.search().where('title').match('butterfly').return.all()

// finds all albums using fuzzy matching where the title contains a word which is within 3 Levenshtein distance of the word 'buterfly'
albums = await albumRepository.search().where('title').match('buterfly', { fuzzyMatching: true, levenshteinDistance: 3 }).return.all()

// finds all albums where the title contains the words 'beautiful' and 'children'
albums = await albumRepository.search().where('title').match('beautiful children').return.all()

// finds all albums where the title contains the exact phrase 'beautiful stories'
albums = await albumRepository.search().where('title').matchExact('beautiful stories').return.all()
```

If you want to search for a part of a word. To do it, just tack a `*` on the beginning or end (or both) of your partial word and it'll match accordingly:

```javascript
// finds all albums where the title contains a word that contains 'right'
albums = await albumRepository.search().where('title').match('*right*').return.all()
```

Do not combine partial-word searches or fuzzy matches with exact matches. Partial-word searches and fuzzy matches with exact matches are not compatible in RediSearch. If you try to exactly match a partial-word search or fuzzy match a partial-word search, you'll get an error.

```javascript
// THESE WILL ERROR
albums = await albumRepository.search().where('title').matchExact('beautiful sto*').return.all()
albums = await albumRepository.search().where('title').matchExact('*buterfly', { fuzzyMatching: true, levenshteinDistance: 3 }).return.all()
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
// finds all the studios within 50 miles of downtown Cleveland using a point
studios = await studioRepository.search().where('location').inRadius(
  circle => circle.origin({ longitude: -81.7758995, latitude: 41.4976393 }).radius(50).miles).return.all()

// finds all the studios within 50 miles of downtown Cleveland using longitude and latitude
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
const albums = await albumRepository.search()
  .where('artist').equals('Mushroomhead')
  .or('title').matches('butterfly')
  .and('year').is.greaterThan(1990).return.all()
```

These are executed in order from left to right, and ignore any order of operations. So this query will match an artist of "Mushroomhead" OR a title matching "butterfly" before it goes on to match that the year is greater than 1990.

If you'd like to change this you can nest your queries:

```javascript
const albums = await albumRepository.search()
  .where('title').matches('butterfly').return.all()
  .or(search => search
    .where('artist').equals('Mushroomhead')
    .and('year').is.greaterThan(1990)
  ).return.all()
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
const albumsByYear = await albumRepository.search()
  .where('artist').equals('Mushroomhead')
    .sortAscending('year').return.all()

const albumsByTitle = await albumRepository.search()
  .where('artist').equals('Mushroomhead')
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

If your schema is for a JSON data structure (the default), you can mark `number`, `date`, and `text` fields as sortable. You can also mark `string` and `boolean` fields as sortable, but this will have no effect and will generate a warning.

If your schema is for a Hash, you can mark `string`, `number`, `boolean`, `date`, and `text` fields as sortable.

Fields of the types `point` and `string[]` are never sortable.

If this seems like a confusing flowchart to parse, don't worry. If you call `.sortBy` on a field in the Schema that's not marked as `sortable` and it *could* be, Redis OM will log a warning to let you know.

## Advanced Stuff

This is a bit of a catch-all for some of the more advanced stuff you can do with Redis OM.

### Schema Options

Additional field options can be set depending on the field type. These correspond to the [Field Options](https://redis.io/commands/ft.create/#field-options) available when creating a RediSearch full-text index. Other than the `separator` option, these only affect how content is indexed and searched.

|  schema type   | RediSearch type | `indexed` | `sortable` | `normalized` | `stemming` | `matcher` | `weight` | `separator` | `caseSensitive` |
| -------------- | :-------------: | :-------: | :--------: | :----------: | :--------: | :--------: | :------: | :---------: | :-------------: |
| `string`       |       TAG       |    yes    |  HASH Only |   HASH Only  |      -     |      -     |     -    |     yes     |        yes      |
| `number`       |     NUMERIC     |    yes    |    yes     |       -      |      -     |      -     |     -    |      -      |         -       |
| `boolean`      |       TAG       |    yes    |  HASH Only |       -      |      -     |      -     |     -    |      -      |         -       |
| `string[]`     |       TAG       |    yes    |  HASH Only |   HASH Only  |      -     |      -     |     -    |     yes     |        yes      |
| `number[]`     |     NUMERIC     |    yes    |    yes     |       -      |      -     |      -     |     -    |      -      |         -       |
| `date`         |     NUMERIC     |    yes    |    yes     |       -      |            |      -     |     -    |      -      |         -       |
| `point`        |       GEO       |    yes    |     -      |       -      |            |      -     |     -    |      -      |         -       |
| `text`         |       TEXT      |    yes    |    yes     |      yes     |     yes    |     yes    |    yes   |      -      |         -       |

* `indexed`: true | false, whether this field is indexed by RediSearch (default true)
* `sortable`: true | false, whether to create an additional index to optimize sorting (default false)
* `normalized`: true | false, whether to apply normalization for sorting (default true)
* `matcher`: string defining phonetic matcher which can be one of: 'dm:en' for English, 'dm:fr' for French, 'dm:pt' for Portugese, 'dm:es' for Spanish (default none)
* `stemming`: true | false, whether word-stemming is applied to text fields (default true)
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

## Documentation

This README is pretty extensive, but if you want to check out every last corner of Redis OM for Node.js, take a look at the complete [API documentation](/docs).

## Troubleshooting

I'll eventually have a FAQ full of answered questions, but since this is a new library, nobody has asked anything yet, frequently or otherwise. So, if you run into a problem, open an issue. Even cooler, dive into the code and send a pull request. If you just want to ping somebody, hit me up on the [Redis Discord server][discord-url].

## Contributing

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
