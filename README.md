<div align="center">
  <br/>
  <br/>
  <img width="360" src="logo.svg" alt="Redis OM" />
  <br/>
  <br/>
</div>

[![License][license-image]][license-url]

# Redis ŌM for Node.js

## Object Mapping (and more) for Redis!

Redis ŌM (prounced _REDiss OHM_) makes it easy to add Redis to your Node.js appliction by mapping the Redis data structures you know and love to classes that you define. No more pesky, low-level commands, just pure code with a fluent interface.

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
  .and('year').is.greaterThan(2000).returnAll()
```

Pretty cool, right? Read on for details.

# Before We Get Started

Before we get started there's a couple things you should know:

  1. This is a *preview*.
  2. **This is a preview**.
  3. This. Is. A. Preview.

This is a preview. This code is not production ready and all manner of Bad Things™ might happen if you use it. Things like:

  - Changes to interfaces and behavior that break your code upon upgrade.
  - Bugs, both garden variety and [Heisenbugs](https://en.wikipedia.org/wiki/Heisenbug), that crash your application.
  - Execution of the [HCF instruction](https://en.wikipedia.org/wiki/Halt_and_Catch_Fire_(computing)).

Likely there are bugs. If you find one, open an issue or—better yet—send me a pull request. Likely there will be changes. If you have a brilliant idea for one, let me know by opening an issue.

By using and abusing this software you are helping to improve it. This is greatly appreciated.

Caveats done. Now, on with *how* to use Redis ŌM!

# Getting Started

First things first, get yourself a Node.js project. There are lots of ways to do this but I'm gonna go with a classic:

    $ npm init

Once you have that sweet, sweet `package.json`, let's add our newest favorite package to it:

    $ npm install redis-om --save

Of course, you'll need some Redis, preferrably with [RediSearch][redisearch-url] and [RedisJSON][redis-json-url] installed. The easiest way to do this is to setup a free [Redis Cloud][redis-cloud-url] instance. But, you can also use Docker:

    $ docker run -p 6379:6379 redislabs/redismod:preview

Excellent. Set up done. Let's write some code!

# Connect to Redis with a Client

You connect to Redis using a [*client*](docs/client.md). The `Client` class has methods to open, close, and excute raw commands against Redis.

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
<summary>Also in TypeScript</summary>

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

Mostly you'll use `.open`, `.close` and `.fetchRepository` (which we'll talk about soon enough). But, on occasion you might need to talk to Redis directly. The `.execute` method allows you to do that.

## Redis Connection Strings

When you open a Redis client, you hand it a URL. The basic format for this URL is:

    redis://username:password@host:port

This is the bulk of what you will need, but if you want more, the full specification for the URL is [defined with the IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). And yes, there is a [TLS version](https://www.iana.org/assignments/uri-schemes/prov/rediss) as well.

If you don't provide a URL, it defaults to `redis://localhost:6379`.

# Define an Entity and a Schema

Ok. Let's start doing some object mapping. We'll start by defining an [*entity*](docs/entity.md) and a [*schema*](docs/schema.md).

```javascript
import { Entity, Schema } from 'redis-om'
```

[Entities](docs/entity.md) are the classes that you work with. The thing being created, read, updated, and deleted. Any class that extends `Entity` is an entity. Usually, you'll define an entity with a single line of code:

```javascript
class Album extends Entity {}
```

[Schemas](docs/schema.md) define the fields on your entity, their types, and how they are mapped internally to Redis. By default, entities map to Hashes in Redis but you can also use JSON, more on that later.:

```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
})
```

When you create a `Schema`, it modifies the entity you handed it, adding getters and setters for the properties you define. The type those getters and setters accept and return are defined with the type parameter above. Valid values are: `string`, `number`, `boolean`, or `array`. The first three do exactly waht you think they do—they define a property that is a String, Number, or Boolean. `array` specifically defines an array of Strings.

There are several other options available when defining a schema for your entity. Check them out in the [detailed documentation](docs/schema.md) for the `Schema` class.

# Reading and Writing with Repository

Now that we have a client and a schema we have what we need to make a [*repository*](docs/repository.md). A repository provides the means to read, write, and remove entities. Creating a repository is pretty straightforward:

```javascript
import { Repository } from 'redis-om'

let repository = new Repository(schema, client)
```

Once we have a repository, we can use it to create entities:

```javascript
let album = repository.createEntity()
album.entityId // '01FJYWEYRHYFT8YTEGQBABJ43J'
```

Note that entities created by `.createEntity` are not saved to Redis, at least not yet. They've only been instantiated and populated with an entity ID. This ID is a [ULID](https://github.com/ulid/spec) and is unique id representing that object. To create a new entity *and* save it to Redis, we need to set all the properties on the entity and call `.save`:

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

## Missing Entities and Null Values

Redis, and by extension Redis ŌM, doesn't differentiate between missing and null. Missing fields in Redis are returned as `null` and missing keys return `null`. So, if you fetch an entity that doesn't exists, it will happily return you an entity full of nulls:

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

It does this becuase Redis doesn't dinstinguish between missing and null. You could have an entity that is all nulls. Or you could not. Redis doesn't know which is your intention and so always returns something when you call `.fetch`.

## A Note for TypeScript Users

When you define an entity and schema in TypeScript, all is well. But when you go to *use* that entity, you might have a problem. You'll get an error accessing the properties that the schema added to the entity. This code won't work:

```typescript
let album = repository.createEntity()
album.artist = "Mushroomhead"                 // Property 'artist' does not exist on type 'Album'
album.title = "The Righteous & The Butterfly" // Property 'title' does not exist on type 'Album'
album.year = 2014                             // Property 'year' does not exist on type 'Album'
album.genres = [ 'metal' ]                    // Property 'genres' does not exist on type 'Album'
album.outOfPublication = true                 // Property 'outOfPublication' does not exist on type 'Album'
```

To fix this, add an interface with the same name as your entity. On that interface, add all the properties you provided to the schema:

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

# Embedding Your Own Logic into Entities

You might be looking at how you define an entity and be thinking it's a bit odd. Just an empty class? Really? Well, this class can contain additional logic that works with the data it retrieves from Redis. Which can be pretty useful.

You can use this to created computed fields and add domain logic:

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

Or even use more Redis ŌM to find related entities:

```javascript
class Album extends Entity {
  async fetchArtist() {
    return await artistRepository.fetch(this.artistId)
  }
}
```

# Using RedisJSON

By default, Redis ŌM stores your entities in Hashes. But if your using [RedisJSON][redis-json-url], you can instead choose to sotre your entites as JSON. It works exactly the same as using Hashes, but when you defined you schema, you pass in an option telling it to use JSON:

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

# Using RediSearch

Using [RediSearch][redisearch-url] with Redis ŌM is where the power of this fully armed and operational battlestation starts to become apparent. If you have RediSearch installed on your Redis server you can use the search capabilites of Redis ŌM. This enables commands like:

```javascript
let albums = await repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000).returnAll()
```

Let's explore this in full.

## Build the Index

To use search you have to build an index. If you don't you'll get errors. To build an index, just call `.createIndex` on your repository:

```javascript
await repository.createIndex();
```

If you change your schema, you'll need to rebuild your index. To do that you'll need to drop the index and create it again:

```javascript
await repository.dropIndex();
await repository.createIndex();
```

## Finding All The Things (and Returning Them)

Once you have an index created (or recreated) you can search. The most basic search is just to return everything. This will return all of the albums that you've put in Redis:

```javascript
let albums = await repository.search().returnAll()
```

### Pagination

It's possible that you have a *lot* of albums, I know I do. In that case, you can page through the results. Just pass in the zero-based offset and the number of results you want:

```javascript
let offset = 100
let count = 25
let albums = await repository.search().return(offset, count)
```

Don't worry if your offset is greater than the number of entities. If it is, you just get an empty array back. No harm, no foul.

### Counting

Sometimes you just want to know how many entities you have. For that you can call `.count`:

```javascript
let count = await repository.search().count()
```

## Finding Specific Things

It's all fine an dandy to return all the things. But that's usually not what you want to do. You want to find *specific* things. Redis ŌM will let you find those specific things by [strings](#searching-on-whole-strings), [numbers](#searching-on-numbers), and [booleans](#searching-on-booleans). You can also search for strings that are in an [array](#searching-arrays) or even perform [full-text search](#full-text-search) within strings.

And it does it with a fluent interface that allows, but does not demand, code that reads like a sentence. See below for exhaustive examples of all the syntax available to you.

### Searching on Whole Strings

You can search for a whole string. This syntax will not search for partial strings or words within a string. If you want to do that, check out [Full-Text Search](#full-text-search).

```javascript
let albums

// find all albums where the artist is 'Mushroomhead'
albums = await repository.search.where('artist').eq('Mushroomhead').returnAll()

// find all albums where the artist is *not* 'Mushroomhead'
albums = await repository.search.where('artist').not.eq('Mushroomhead').returnAll()

// fluent alternatives that do the same thing
albums = await repository.search.where('artist').equals('Mushroomhead').returnAll()
albums = await repository.search.where('artist').does.equal('Mushroomhead').returnAll()
albums = await repository.search.where('artist').is.equalTo('Mushroomhead').returnAll()
albums = await repository.search.where('artist').does.not.equal('Mushroomhead').returnAll()
albums = await repository.search.where('artist').is.not.equalTo('Mushroomhead').returnAll()
```

### Searching on Numbers

You can search against fields that contain numbers—both intergers and floating-point numbers—with all the comparisons you'd expect to see:

```javascript
let albums

// find all albums where the year is ===, >, >=, <, and <= 1984
albums = await repository.search.where('year').eq(1984).returnAll()
albums = await repository.search.where('year').gt(1984).returnAll()
albums = await repository.search.where('year').gte(1984).returnAll()
albums = await repository.search.where('year').lt(1984).returnAll()
albums = await repository.search.where('year').lte(1984).returnAll()

// find all albums where year is between 1980 and 1989 inclusive
albums = await repository.search.where('year').between(1980, 1989).returnAll()

// find all albums where the year is *not* ===, >, >=, <, and <= 1984
albums = await repository.search.where('year').not.eq(1984).returnAll()
albums = await repository.search.where('year').not.gt(1984).returnAll()
albums = await repository.search.where('year').not.gte(1984).returnAll()
albums = await repository.search.where('year').not.lt(1984).returnAll()
albums = await repository.search.where('year').not.lte(1984).returnAll()

// find all albums where year is *not* between 1980 and 1989 inclusive
albums = await repository.search.where('year').not.between(1980, 1989);

// fluent alternatives that do the same thing
albums = await repository.search.where('year').equals(1984).returnAll()
albums = await repository.search.where('year').does.equal(1984).returnAll()
albums = await repository.search.where('year').does.not.equal(1984).returnAll()
albums = await repository.search.where('year').is.equalTo(1984).returnAll()
albums = await repository.search.where('year').is.not.equalTo(1984).returnAll()

albums = await repository.search.where('year').greaterThan(1984).returnAll()
albums = await repository.search.where('year').is.greaterThan(1984).returnAll()
albums = await repository.search.where('year').is.not.greaterThan(1984).returnAll()

albums = await repository.search.where('year').greaterThanOrEqualTo(1984).returnAll()
albums = await repository.search.where('year').is.greaterThanOrEqualTo(1984).returnAll()
albums = await repository.search.where('year').is.not.greaterThanOrEqualTo(1984).returnAll()

albums = await repository.search.where('year').lessThan(1984).returnAll()
albums = await repository.search.where('year').is.lessThan(1984).returnAll()
albums = await repository.search.where('year').is.not.lessThan(1984).returnAll()

albums = await repository.search.where('year').lessThanOrEqualTo(1984).returnAll()
albums = await repository.search.where('year').is.lessThanOrEqualTo(1984).returnAll()
albums = await repository.search.where('year').is.not.lessThanOrEqualTo(1984).returnAll()

albums = await repository.search.where('year').is.between(1980, 1989).returnAll()
albums = await repository.search.where('year').is.not.between(1980, 1989).returnAll()
```

### Searching on Booleans

You can search against fields that contain booleans:

```javascript
let albums

// find all albums where outOfPublication is true
albums = await repository.search.where('outOfPublication').true().returnAll()

// find all albums where outOfPublication is false
albums = await repository.search.where('outOfPublication').false().returnAll()
```

You can negate boolean searches. This might seem odd, but if your field is `null` then it would match on a `.not` query:

```javascript
// find all albums where outOfPublication is false or null
albums = await repository.search.where('outOfPublication').not.true().returnAll()

// find all albums where outOfPublication is true or null
albums = await repository.search.where('outOfPublication').not.false().returnAll()
```

Amd, of course, there's lots of syntactic sugar to make this fluent:

```javascript
albums = await repository.search.where('outOfPublication').eq(true).returnAll()
albums = await repository.search.where('outOfPublication').equals(true).returnAll()
albums = await repository.search.where('outOfPublication').does.equal(true).returnAll()
albums = await repository.search.where('outOfPublication').is.equalTo(true).returnAll()

albums = await repository.search.where('outOfPublication').true().returnAll()
albums = await repository.search.where('outOfPublication').false().returnAll()
albums = await repository.search.where('outOfPublication').is.true().returnAll()
albums = await repository.search.where('outOfPublication').is.false().returnAll()

albums = await repository.search.where('outOfPublication').not.eq(true).returnAll()
albums = await repository.search.where('outOfPublication').does.not.equal(true).returnAll()
albums = await repository.search.where('outOfPublication').is.not.equalTo(true).returnAll()
albums = await repository.search.where('outOfPublication').is.not.true().returnAll()
albums = await repository.search.where('outOfPublication').is.not.false().returnAll()
```

### Searching Arrays

You can search on whole string that are in an array:

```javascript
let albums

// find all albums where genres contains the string 'rock'
albums = await repository.search.where('genres').contain('rock').returnAll()

// find all albums where genres contains the string 'rock', 'metal', or 'blues'
albums = await repository.search.where('genres').containOneOf('rock', 'metal', 'blues').returnAll()

// find all albums where genres does *not* contain the string 'rock'
albums = await repository.search.where('genres').not.contain('rock').returnAll()

// find all albums where genres does *not* contain the string 'rock', 'metal', and 'blues'
albums = await repository.search.where('genres').not.containOneOf('rock', 'metal', 'blues').returnAll()

// alternative syntaxes
albums = await repository.search.where('genres').contains('rock').returnAll()
albums = await repository.search.where('genres').containsOneOf('rock', 'metal', 'blues').returnAll()
albums = await repository.search.where('genres').does.contain('rock').returnAll()
albums = await repository.search.where('genres').does.not.contain('rock').returnAll()
albums = await repository.search.where('genres').does.containOneOf('rock', 'metal', 'blues').returnAll()
albums = await repository.search.where('genres').does.not.containOneOf('rock', 'metal', 'blues').returnAll()
```

### Full-Text Search

By default, a string matches the entire string. So, if the title of your album is "The Righteous & The Butterfly", to find that album using it's title, you'll need to provide the entire string. However, you can configure a string for full-text search in the schema by setting `textSearch` to `true`:

```javascript
  ...
  title: { type: 'string', textSearch: true },
  ...
```

Doing this gives you the full power of [RediSearch][redisearch-url] by enabling full-text search against the string instead of just matching the whole string. Full-text search is pretty clever. It understands that certain words (like *a*, *an*, or *the*) are common and ignores them. It understands how words related to each other and so if you search for 'give' it matches 'gave', 'gives', 'given', and 'giving' too. Plus, you can override this to do exact matches of a word or phrase.

```javascript
let albums

// finds all albums where the title contains the word 'butterfly'
albums = await repository.search.where('title').match('butterfly').returnAll()

// finds all albums where the title contains the exact phrase 'beautiful stories'
albums = await repository.search.where('title').matchExact('beautiful stories').returnAll()
```

Redis ŌM also exposes word prefix searches from RediSearch. If you are looking for a word that starts with a particular value, just tack a `*` on the end and it'll match accordingly:

```javascript
// finds all albums where the title contains a word that starts with 'right'
albums = await repository.search.where('title').match('right*').returnAll()
```

But don't not combine these. I repeat, **DO NOT COMBINE THESE**. Prefix searches and exact matches are not compatible. If you try to exactly match a prefixed search, you'll get an error.

```javascript
// THIS WILL ERROR
albums = await repository.search.where('title').matchExact('beautiful sto*').returnAll()
```

Again, there are several alternatives to make this a bit more fluent and negation is available:

```javascript
albums = await repository.search.where('title').not.match('butterfly').returnAll()
albums = await repository.search.where('title').matches('butterfly').returnAll()
albums = await repository.search.where('title').does.match('butterfly').returnAll()
albums = await repository.search.where('title').does.not.match('butterfly').returnAll()

albums = await repository.search.where('title').exact.match('beautiful stories').returnAll()
albums = await repository.search.where('title').not.exact.match('beautiful stories').returnAll()
albums = await repository.search.where('title').exactly.matches('beautiful stories').returnAll()
albums = await repository.search.where('title').does.exactly.match('beautiful stories').returnAll()
albums = await repository.search.where('title').does.not.exactly.match('beautiful stories').returnAll()

albums = await repository.search.where('title').not.matchExact('beautiful stories').returnAll()
albums = await repository.search.where('title').matchesExactly('beautiful stories').returnAll()
albums = await repository.search.where('title').does.matchExactly('beautiful stories').returnAll()
albums = await repository.search.where('title').does.not.matchExactly('beautiful stories').returnAll()
```

### Chaining Searches

So far we've been doing searches that match on a single field. However, we often want to query on multiple field. No problem:

```javascript
let albums = await repository.search
  .where('artist').equals('Mushroomhread')
  .or('title').matches('butterfly')
  .and('year').is.greaterThan(1990).returnAll()
```

These are executed in order from left to right and ignore any order of operations. So this query will match an arist of 'Mushroomhead' OR a title matching 'butterfly' before it goes on to match that the year is greater than 1990.

If you'd like to change this you can nest queries:

```javascript
search
  .where('title').matches('butterfly').returnAll()
  .or(search => search
    .where('artist').equals('Mushroomhead')
    .and('year').is.greaterThan(1990)
  )
```

This query finds all Mushroomhead albums after 1990 or albums that have butterfly in the title.

# Combining RedisJSON and RediSearch

One final note. All of the search capabilites of RediSearch that Redis ŌM exposes work with Hashes. But, RediSearch also plays nice with RedisJSON. All you need to do to use search with RedisJSON is to enabled it in the schema:


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


<!-- Links, Badges, and Whatnot -->

[license-image]: https://img.shields.io/badge/License-BSD%203--Clause-blue.svg
[license-url]: LICENSE
[redis-cloud-url]: https://redis.com/try-free/
[redisearch-url]: https://oss.redis.com/redisearch/
[redis-json-url]: https://oss.redis.com/redisjson/