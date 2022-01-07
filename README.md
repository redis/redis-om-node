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
  - ⚠️ [Before We Get Started](#%EF%B8%8F-before-we-get-started)
  - 🏁 [Getting Started](#-getting-started)
  - 🔌 [Connect to Redis with a Client](#-connect-to-redis-with-a-client)
    - [Redis Connection Strings](#redis-connection-strings)
  - 📇 [Define an Entity and a Schema](#-define-an-entity-and-a-schema)
  - 🖋 [Reading and Writing with Repository](#-reading-and-writing-with-repository)
    - [Missing Entities and Null Values](#missing-entities-and-null-values)
    - [A Note for TypeScript Users](#a-note-for-typescript-users)
  - 🧮 [Embedding Your Own Logic into Entities](#-embedding-your-own-logic-into-entities)
  - 📄 [Using RedisJSON](#-using-redisjson)
  - 🔎 [Using RediSearch](#-using-redisearch)
    - [Build the Index](#build-the-index)
    - [Finding All The Things (and Returning Them)](#finding-all-the-things-and-returning-them)
      - [Pagination](#pagination)
      - [First Things First](#first-things-first)
      - [Counting](#counting)
    - [Finding Specific Things](#finding-specific-things)
      - [Searching on Whole Strings](#searching-on-whole-strings)
      - [Searching on Numbers](#searching-on-numbers)
      - [Searching on Booleans](#searching-on-booleans)
      - [Searching Arrays](#searching-arrays)
      - [Full-Text Search](#full-text-search)
      - [Chaining Searches](#chaining-searches)
  - 👊 [Combining RedisJSON and RediSearch](#-combining-redisjson-and-redisearch)
  - 📚 [Documentation](#-documentation)
  - ⛏️ [Troubleshooting](#%EF%B8%8F-troubleshooting)
  - ❤️ [Contributing](#%EF%B8%8F-contributing)
</details>

## 💡 Redis OM for Node.js

Redis OM (pronounced _REDiss OHM_) makes it easy to add Redis to your Node.js application by mapping the Redis data structures you know and love to classes that you define. No more pesky, low-level commands, just pure code with a fluent interface.

Define an entity:

```javascript
class Album extends Entity {}

let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string', textSearch: true },
  year: { type: 'number' }
});
```

Create a new entity and save it:

```javascript
let album = repository.createEntity()
album.artist = "Mushroomhead"
album.title = "The Righteous & The Butterfly"
album.year = 2014
await repository.save(album)
```

Search for matching entities:

```javascript
let albums = await repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000).return.all()
```

Pretty cool, right? Read on for details.

## ⚠️ Before We Get Started

Before we get started there are a couple of things you should know:

  1. This is a *preview*.
  2. **This is a preview**.
  3. This. Is. A. Preview.

This is a preview. This code is not production-ready and all manner of Bad Things™ might happen if you use it. Things like:

  - Changes to interfaces and behavior that break your code upon upgrade.
  - Bugs, both garden variety and [Heisenbugs](https://en.wikipedia.org/wiki/Heisenbug), that crash your application.
  - Execution of the [HCF instruction](https://en.wikipedia.org/wiki/Halt_and_Catch_Fire_(computing)).

Likely there are bugs. If you find one, open an issue or—better yet—send me a pull request. Likely there will be changes. If you have a brilliant idea for one, let me know by opening an issue. Or just hop on our [Discord server][discord-url] and suggest it there.

By using and abusing this software you are helping to improve it. This is greatly appreciated.

Caveats done. Now, on with *how* to use Redis OM!

## 🏁 Getting Started

First things first, get yourself a Node.js project. There are lots of ways to do this, but I'm gonna go with a classic:

    $ npm init

Once you have that sweet, sweet `package.json`, let's add our newest favorite package to it:

    $ npm install redis-om --save

Of course, you'll need some Redis, preferably with [RediSearch][redisearch-url] and [RedisJSON][redis-json-url] installed. The easiest way to do this is to set up a free [Redis Cloud][redis-cloud-url] instance. But, you can also use Docker:

    $ docker run -p 6379:6379 redislabs/redismod:preview

Excellent. Setup done. Let's write some code!

## 🔌 Connect to Redis with a Client

You connect to Redis using a [*client*](docs/classes/Client.md). The `Client` class has methods to open, close, and execute raw commands against Redis.

```javascript
let { Client } = require('redis-om')

(async function() {

  let client = new Client()
  await client.open('redis://localhost:6379')

  let aString = await client.execute(['PING'])
  // 'PONG'

  let aNumber = await client.execute(['HSET', 'foo', 'bar', 'baz', 'qux', 42])
  // 2

  let anArray = await client.execute(['HGETALL', 'foo'])
  // [ 'bar', 'baz', 'qux', '42' ]

  await client.close()

})()
```

<details>
<summary>Or, in TypeScript:</summary>

```typescript
import { Client } from 'redis-om';

(async function() {

  let client = new Client();
  await client.open('redis://localhost:6379');

  let aString = await client.execute<string>(['PING']);
  // 'PONG'

  let aNumber = await client.execute<number>(['HSET', 'foo', 'bar', 'baz', 'qux', 42]);
  // 2

  let anArray = await client.execute<string[]>(['HGETALL', 'foo']);
  // [ 'bar', 'baz', 'qux', '42' ]

  await client.close();

})();
```
</details>

Mostly you'll use `.open`, `.close`, and `.fetchRepository` (which we'll talk about soon enough). But, on occasion, you might need to talk to Redis directly. The `.execute` method allows you to do that.

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
```

[Schemas](docs/classes/Schema.md) define the fields on your entity, their types, and how they are mapped internally to Redis. By default, entities map to Hashes in Redis, but you can also use JSON (more on that later):

```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
})
```

When you create a `Schema`, it modifies the entity you handed it, adding getters and setters for the properties you define. The type those getters and setters accept and return are defined with the type parameter above. Valid values are: `string`, `number`, `boolean`, or `array`. The first three do exactly what you think—they define a property that is a String, a Number, or a Boolean. `array` specifically defines an array of Strings.

There are several other options available when defining a schema for your entity. Check them out in the [detailed documentation](docs/classes/Schema.md) for the `Schema` class.

## 🖋 Reading and Writing with Repository

Now that we have a client and a schema, we have what we need to make a [*repository*](docs/classes/Repository.md). A repository provides the means to read, write, and remove entities. Creating a repository is pretty straightforward:

```javascript
import { Repository } from 'redis-om'

let repository = new Repository(schema, client)
```

Once we have a repository, we can use it to create entities:

```javascript
let album = repository.createEntity()
album.entityId // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

Note that entities created by `.createEntity` are not saved to Redis (at least not yet). They've only been instantiated and populated with an entity ID. This ID is a [ULID](https://github.com/ulid/spec), and is a unique id representing that object. To create a new entity *and* save it to Redis, we need to set all the properties on the entity that we care about, and call `.save`:

```javascript
let album = repository.createEntity()
album.artist = "Mushroomhead"
album.title = "The Righteous & The Butterfly"
album.year = 2014
album.genres = [ 'metal' ]
album.outOfPublication = true

let id = await repository.save(album) // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

You also use `.save` to update an existing entity:

```javascript
album.genres = [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication = false

let id = await repository.save(album) // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

If you know an object's entity ID you can `.fetch` it:

```javascript
let album = await repository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.artist // "Mushroomhead"
album.title // "The Righteous & The Butterfly"
album.year // 2014
album.genres // [ 'metal', 'nu metal', 'avantgarde' ]
album.outOfPublication // false
```

Or `.remove` it:

```javascript
await repository.remove('01FJYWEYRHYFT8YTEGQBABJ43J')
```

### Missing Entities and Null Values

Redis, and by extension Redis OM, doesn't differentiate between missing and null. Missing fields in Redis are returned as `null`, and missing keys return `null`. So, if you fetch an entity that doesn't exist, it will happily return you an entity full of nulls:

```javascript
let album = await repository.fetch('DOES_NOT_EXIST')
album.artist // null
album.title // null
album.year // null
album.genres // null
album.outOfPublication // null
```

Conversely, if you set all the properties on an entity to `null` and then save it, it will remove the entity from Redis:

```javascript
let album = await repository.fetch('01FJYWEYRHYFT8YTEGQBABJ43J')
album.artist = null
album.title = null
album.year = null
album.genres = null
album.outOfPublication = null

let id = await repository.save(album)

let exists = await client.execute(['EXISTS', 'Album:01FJYWEYRHYFT8YTEGQBABJ43J']) // 0
```

It does this because Redis doesn't distinguish between missing and null. You could have an entity that is all nulls. Or you could not. Redis doesn't know which is your intention, and so always returns *something* when you call `.fetch`.

### A Note for TypeScript Users

When you define an entity and schema in TypeScript, all is well. But when you go to *use* that entity, you might have a problem. You'll get an error accessing the properties that the schema added to the entity. This code won't work:

```typescript
let album = repository.createEntity()
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

let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
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
  async fetchArtist() {
    return await artistRepository.fetch(this.artistId)
  }
}
```

## 📄 Using RedisJSON

By default, Redis OM stores your entities in Hashes. But if you're using [RedisJSON][redis-json-url], you can instead choose to store your entities as JSON. It works exactly the same as using Hashes, but when you define your schema, just pass in an option telling it to use JSON:

```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'JSON'
})
```

Everything else works the same.

## 🔎 Using RediSearch

Using [RediSearch][redisearch-url] with Redis OM is where the power of this fully armed and operational battle station starts to become apparent. If you have RediSearch installed on your Redis server you can use the search capabilities of Redis OM. This enables commands like:

```javascript
let albums = await repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000).return.all()
```

Let's explore this in full.

### Build the Index

To use search you have to build an index. If you don't, you'll get errors. To build an index, just call `.createIndex` on your repository:

```javascript
await repository.createIndex();
```

If you change your schema, you'll need to rebuild your index. To do that, you'll need to drop the index and create it again:

```javascript
await repository.dropIndex();
await repository.createIndex();
```

### Finding All The Things (and Returning Them)

Once you have an index created (or recreated) you can search. The most basic search is to just return all the things. This will return all of the albums that you've put in Redis:

```javascript
let albums = await repository.search().return.all()
```

#### Pagination

It's possible that you have a *lot* of albums; I know I do. In that case, you can page through the results. Just pass in the zero-based offset and the number of results you want:

```javascript
let offset = 100
let count = 25
let albums = await repository.search().return.page(offset, count)
```

Don't worry if your offset is greater than the number of entities. If it is, you just get an empty array back. No harm, no foul.

#### First Things First

Sometimes you only have one album. Or maybe you only care about the first album you find. You can easily grab the first result of your search with `.first`:

```javascript
let firstAlbum = await repository.search().return.first();
```

Note: If you have *no* albums, this will return `null`.

#### Counting

Sometimes you just want to know how many entities you have. For that, you can call `.count`:

```javascript
let count = await repository.search().return.count()
```

### Finding Specific Things

It's fine and dandy to return all the things. But that's not what you usually want to do. You want to find *specific* things. Redis OM will let you find those specific things by [strings](#searching-on-whole-strings), [numbers](#searching-on-numbers), and [booleans](#searching-on-booleans). You can also search for strings that are in an [array](#searching-arrays) or even perform [full-text search](#full-text-search) within strings.

And it does it with a fluent interface that allows—but does not demand—code that reads like a sentence. See below for exhaustive examples of all the syntax available to you.

#### Searching on Whole Strings

You can search for a whole string. This syntax will not search for partial strings or words within a string. If you want to do that, check out [Full-Text Search](#full-text-search).

```javascript
let albums

// find all albums where the artist is 'Mushroomhead'
albums = await repository.search.where('artist').eq('Mushroomhead').return.all()

// find all albums where the artist is *not* 'Mushroomhead'
albums = await repository.search.where('artist').not.eq('Mushroomhead').return.all()

// fluent alternatives that do the same thing
albums = await repository.search.where('artist').equals('Mushroomhead').return.all()
albums = await repository.search.where('artist').does.equal('Mushroomhead').return.all()
albums = await repository.search.where('artist').is.equalTo('Mushroomhead').return.all()
albums = await repository.search.where('artist').does.not.equal('Mushroomhead').return.all()
albums = await repository.search.where('artist').is.not.equalTo('Mushroomhead').return.all()
```

#### Searching on Numbers

You can search against fields that contain numbers—both integers and floating-point numbers—with all the comparisons you'd expect to see:

```javascript
let albums

// find all albums where the year is ===, >, >=, <, and <= 1984
albums = await repository.search.where('year').eq(1984).return.all()
albums = await repository.search.where('year').gt(1984).return.all()
albums = await repository.search.where('year').gte(1984).return.all()
albums = await repository.search.where('year').lt(1984).return.all()
albums = await repository.search.where('year').lte(1984).return.all()

// find all albums where year is between 1980 and 1989 inclusive
albums = await repository.search.where('year').between(1980, 1989).return.all()

// find all albums where the year is *not* ===, >, >=, <, and <= 1984
albums = await repository.search.where('year').not.eq(1984).return.all()
albums = await repository.search.where('year').not.gt(1984).return.all()
albums = await repository.search.where('year').not.gte(1984).return.all()
albums = await repository.search.where('year').not.lt(1984).return.all()
albums = await repository.search.where('year').not.lte(1984).return.all()

// find all albums where year is *not* between 1980 and 1989 inclusive
albums = await repository.search.where('year').not.between(1980, 1989);

// fluent alternatives that do the same thing
albums = await repository.search.where('year').equals(1984).return.all()
albums = await repository.search.where('year').does.equal(1984).return.all()
albums = await repository.search.where('year').does.not.equal(1984).return.all()
albums = await repository.search.where('year').is.equalTo(1984).return.all()
albums = await repository.search.where('year').is.not.equalTo(1984).return.all()

albums = await repository.search.where('year').greaterThan(1984).return.all()
albums = await repository.search.where('year').is.greaterThan(1984).return.all()
albums = await repository.search.where('year').is.not.greaterThan(1984).return.all()

albums = await repository.search.where('year').greaterThanOrEqualTo(1984).return.all()
albums = await repository.search.where('year').is.greaterThanOrEqualTo(1984).return.all()
albums = await repository.search.where('year').is.not.greaterThanOrEqualTo(1984).return.all()

albums = await repository.search.where('year').lessThan(1984).return.all()
albums = await repository.search.where('year').is.lessThan(1984).return.all()
albums = await repository.search.where('year').is.not.lessThan(1984).return.all()

albums = await repository.search.where('year').lessThanOrEqualTo(1984).return.all()
albums = await repository.search.where('year').is.lessThanOrEqualTo(1984).return.all()
albums = await repository.search.where('year').is.not.lessThanOrEqualTo(1984).return.all()

albums = await repository.search.where('year').is.between(1980, 1989).return.all()
albums = await repository.search.where('year').is.not.between(1980, 1989).return.all()
```

#### Searching on Booleans

You can search against fields that contain booleans:

```javascript
let albums

// find all albums where outOfPublication is true
albums = await repository.search.where('outOfPublication').true().return.all()

// find all albums where outOfPublication is false
albums = await repository.search.where('outOfPublication').false().return.all()
```

You can negate boolean searches. This might seem odd, but if your field is `null`, then it would match on a `.not` query:

```javascript
// find all albums where outOfPublication is false or null
albums = await repository.search.where('outOfPublication').not.true().return.all()

// find all albums where outOfPublication is true or null
albums = await repository.search.where('outOfPublication').not.false().return.all()
```

And, of course, there's lots of syntactic sugar to make this fluent:

```javascript
albums = await repository.search.where('outOfPublication').eq(true).return.all()
albums = await repository.search.where('outOfPublication').equals(true).return.all()
albums = await repository.search.where('outOfPublication').does.equal(true).return.all()
albums = await repository.search.where('outOfPublication').is.equalTo(true).return.all()

albums = await repository.search.where('outOfPublication').true().return.all()
albums = await repository.search.where('outOfPublication').false().return.all()
albums = await repository.search.where('outOfPublication').is.true().return.all()
albums = await repository.search.where('outOfPublication').is.false().return.all()

albums = await repository.search.where('outOfPublication').not.eq(true).return.all()
albums = await repository.search.where('outOfPublication').does.not.equal(true).return.all()
albums = await repository.search.where('outOfPublication').is.not.equalTo(true).return.all()
albums = await repository.search.where('outOfPublication').is.not.true().return.all()
albums = await repository.search.where('outOfPublication').is.not.false().return.all()
```

#### Searching Arrays

You can search on whole strings that are in an array:

```javascript
let albums

// find all albums where genres contains the string 'rock'
albums = await repository.search.where('genres').contain('rock').return.all()

// find all albums where genres contains the string 'rock', 'metal', or 'blues'
albums = await repository.search.where('genres').containOneOf('rock', 'metal', 'blues').return.all()

// find all albums where genres does *not* contain the string 'rock'
albums = await repository.search.where('genres').not.contain('rock').return.all()

// find all albums where genres does *not* contain the string 'rock', 'metal', and 'blues'
albums = await repository.search.where('genres').not.containOneOf('rock', 'metal', 'blues').return.all()

// alternative syntaxes
albums = await repository.search.where('genres').contains('rock').return.all()
albums = await repository.search.where('genres').containsOneOf('rock', 'metal', 'blues').return.all()
albums = await repository.search.where('genres').does.contain('rock').return.all()
albums = await repository.search.where('genres').does.not.contain('rock').return.all()
albums = await repository.search.where('genres').does.containOneOf('rock', 'metal', 'blues').return.all()
albums = await repository.search.where('genres').does.not.containOneOf('rock', 'metal', 'blues').return.all()
```

#### Full-Text Search

By default, a string matches the entire string. So, if the title of your album is "The Righteous & The Butterfly", to find that album using its title, you'll need to provide the entire string. However, you can configure a string for full-text search in the schema by setting `textSearch` to `true`:

```javascript
  ...
  title: { type: 'string', textSearch: true },
  ...
```

Doing this gives you the full power of [RediSearch][redisearch-url] by enabling full-text search against that string instead of matching the whole string. Full-text search is pretty clever. It understands that certain words (like *a*, *an*, or *the*) are common and ignores them. It understands how words relate to each other and so if you search for 'give', it matches 'gave', 'gives', 'given', and 'giving' too. Plus, if you need to, you can override this to do exact matches of a word or phrase.

```javascript
let albums

// finds all albums where the title contains the word 'butterfly'
albums = await repository.search.where('title').match('butterfly').return.all()

// finds all albums where the title contains the the words 'beautiful' and 'children'
albums = await repository.search.where('title').match('beautiful children').return.all()

// finds all albums where the title contains the exact phrase 'beautiful stories'
albums = await repository.search.where('title').matchExact('beautiful stories').return.all()
```

Redis OM also exposes word prefix searches from RediSearch. If you are looking for a word that starts with a particular value, just tack a `*` on the end and it'll match accordingly:

```javascript
// finds all albums where the title contains a word that starts with 'right'
albums = await repository.search.where('title').match('right*').return.all()
```

But do not combine these. I repeat, **DO NOT COMBINE THESE**. Prefix searches and exact matches are not compatible. If you try to exactly match a prefixed search, you'll get an error.

```javascript
// THIS WILL ERROR
albums = await repository.search.where('title').matchExact('beautiful sto*').return.all()
```

Again, there are several alternatives to make this a bit more fluent and, of course, negation is available:

```javascript
albums = await repository.search.where('title').not.match('butterfly').return.all()
albums = await repository.search.where('title').matches('butterfly').return.all()
albums = await repository.search.where('title').does.match('butterfly').return.all()
albums = await repository.search.where('title').does.not.match('butterfly').return.all()

albums = await repository.search.where('title').exact.match('beautiful stories').return.all()
albums = await repository.search.where('title').not.exact.match('beautiful stories').return.all()
albums = await repository.search.where('title').exactly.matches('beautiful stories').return.all()
albums = await repository.search.where('title').does.exactly.match('beautiful stories').return.all()
albums = await repository.search.where('title').does.not.exactly.match('beautiful stories').return.all()

albums = await repository.search.where('title').not.matchExact('beautiful stories').return.all()
albums = await repository.search.where('title').matchesExactly('beautiful stories').return.all()
albums = await repository.search.where('title').does.matchExactly('beautiful stories').return.all()
albums = await repository.search.where('title').does.not.matchExactly('beautiful stories').return.all()
```

#### Chaining Searches

So far we've been doing searches that match on a single field. However, we often want to query on multiple fields. Not a problem:

```javascript
let albums = await repository.search
  .where('artist').equals('Mushroomhread')
  .or('title').matches('butterfly')
  .and('year').is.greaterThan(1990).return.all()
```

These are executed in order from left to right, and ignore any order of operations. So this query will match an artist of "Mushroomhead" OR a title matching "butterfly", before it goes on to match that the year is greater than 1990.

If you'd like to change this you can nest your queries:

```javascript
search
  .where('title').matches('butterfly').return.all()
  .or(search => search
    .where('artist').equals('Mushroomhead')
    .and('year').is.greaterThan(1990)
  )
```

This query finds all Mushroomhead albums after 1990 or albums that have "butterfly" in the title.

## 👊 Combining RedisJSON and RediSearch

One final note: All of the search capabilities of RediSearch that Redis OM exposes work with Hashes. However, RediSearch also plays nice with RedisJSON. All you need to do to use search with RedisJSON is to enable it in the schema:


```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
}, {
  dataStructure: 'JSON'
})
```

Everything else just works the same.

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
[redisearch-url]: https://oss.redis.com/redisearch/
[redis-json-url]: https://oss.redis.com/redisjson/
[redis-om-dotnet]: https://github.com/redis/redis-om-dotnet
[redis-om-python]: https://github.com/redis/redis-om-python
[redis-om-spring]: https://github.com/redis/redis-om-spring
