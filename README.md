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
let albums = repository.search()
  .where('artist').equals('Mushroomhead')
  .and('title').matches('butterfly')
  .and('year').is.greaterThan(2000)
```

Pretty cool, right? Read on for details.

## Before We Get Started

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

## Getting Started

First things first, get yourself a Node.js project. There are lots of ways to do this but I'm gonna go with a classic:

    $ npm init

Once you have that sweet, sweet `package.json`, let's add our newest favorite package to it:

    $ npm install redis-om --save

Of course, you'll need some Redis, preferrably with [RediSearch](https://oss.redis.com/redisearch/) and [RedisJSON](https://oss.redis.com/redisjson/) installed. The easiest way to do this is to setup a free [Redis Cloud](https://redis.com/try-free/) instance. But, you can also use Docker:

    $ docker run -p 6379:6379 redislabs/redismod:preview

Excellent. Set up done. Let's write some code!

## Connect to Redis

We'll start by connecting to Redis and running some arbitray Redis commands. This is just to show how to connect to Redis and to make sure everything is working:

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

  let aNumber = await client.execute<number>(['HSET', 'foo', 'bar', 'baz', 'qux', 42])
  // 2

  let anArray = await client.execute<string[]>(['HGETALL', 'foo'])
  // [ 'bar', 'baz', 'qux', '42' ]

  await client.close();

})();
```
</details>

When you open a Redis client, you hand it a URL. The basic format for this URL is:

    redis://username:password@host:port

This should be plenty for now, but if you need more, the full specification for the URL is [defined with the IANA](https://www.iana.org/assignments/uri-schemes/prov/redis). And yes, there is a [TLS version](https://www.iana.org/assignments/uri-schemes/prov/rediss) as well.

If you don't provide a URL, it defaults to `redis://localhost:6379`.

## Define a Schema

Ok. Let's start doing some object mapping. We'll start by defining an *entity* and a *schema*.

```javascript
import { Entity, Schema } from 'redis-om';
```

Entities are the classes that you work with. The thing being created, read, updated, and deleted. Any class that extends `Entity` is an entity. Usually, you'll define an entity with a single line of code:

```javascript
class Album extends Entity {}
```

Schemas define the fields on your entity, their types, and how they are mapped internally to Redis:

```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
});
```

When you create a `Schema`, it modifies the entity you handed it, adding getters and setters for the properties you define. The following types are available:

| Type      | Description          |
|-----------|----------------------|
| `string`  | Defines a string.    |
| `number`  | Floats and integers. |
| `boolean` | True or false.       |
| `array`   | An array of strings. |

Inside of Redis, this schema will map to a [Redis Hash](https://redis.io/commands#hash). The fields in that Hash will be the field names specified in the `Schema`. If you want to override the field names in Redis, you can add the `alias` property and give it a different name:

```javascript
  ...
  outOfPublication: { type: 'boolean', alias: 'outOfPub' }
  ...
```

The Hashes themselves will be stored under a unique key. That key consists of a prefix matching the name of the entity and an uniquely generated entity ID. The entity ID is generated by Redis ŌM as a [ULID](https://github.com/ulid/spec). ULIDs are like UUIDs but more human-friendly.

In our example the key for an `Album` would look like:

    Album:01FJX4SMD9YVK5HBTQ3ZAVRAKQ

You can override both the prefix for your entity and the mechanism by which you generate the entity ID when you define the schema:

```javascript
let schema = new Schema(Album, {
  artist: { type: 'string' },
  title: { type: 'string' },
  year: { type: 'number' },
  genres: { type: 'array' },
  outOfPublication: { type: 'boolean' }
}, {
  prefix: 'record',
  idStrategy: () => Math.random().toString().substr(2, 8)
});
```

Please note that the function I provided in the idStrategy property is garbage. DO NOT USE IT. That said, the above configuration would result in the key in Redis for an `Album` to be something like:

    record:67573051

## Create, Read, Update, and Delete

## Embedding Your Own Logic into Entities

## Using JSON


## Using RediSearch

By default, a string can match only the entire string. So, if the title of your album is "The Righteous & The Butterfly" then to find that album using it's title, you'll need to provide the entire string. However, you can instead configure a string for full-text search by setting `textSearch` to `true`.

```javascript
  ...
  title: { type: 'string', textSearch: true },
  ...
```

Also by default this schema will map to a [Redis Hash](https://redis.io/commands#hash). The fields in that Hash will be the field names specified in the `Schema`. If you want to override the field names in Redis, you can add the `alias` property and give it a different name:

```javascript
  ...
  outOfPublication: { type: 'boolean', alias: 'outOfPub' }
  ...
```

Instead of using Hashes, you can map your objects to JSON. To 

You can add some logic to your entities

## Create, Read, Update, and Delete

## Using JSON

## Search!

## Query Syntax

```typescript
let search = repository.search();

// string
search.where('aString').eq('foo');
search.where('aString').not.eq('foo');
search.where('aString').equals('foo');
search.where('aString').does.equal('foo');
search.where('aString').does.not.equal('foo');
search.where('aString').is.equalTo('foo');
search.where('aString').is.not.equalTo('foo');

// string with full text search
search.where('aString').match('foo');
search.where('aString').not.match('foo');
search.where('aString').matches('foo');
search.where('aString').does.match('foo');
search.where('aString').does.not.match('foo');

search.where('aString').exact.match('foo');
search.where('aString').not.exact.match('foo');
search.where('aString').exactly.matches('foo');
search.where('aString').does.exactly.match('foo');
search.where('aString').does.not.exactly.match('foo');

search.where('aString').matchExact('foo');
search.where('aString').not.matchExact('foo');
search.where('aString').matchesExactly('foo');
search.where('aString').does.matchExactly('foo');
search.where('aString').does.not.matchExactly('foo');

// booleans
search.where('aBoolean').eq(true);
search.where('aBoolean').not.eq(true);
search.where('aBoolean').equals(true);
search.where('aBoolean').does.equal(true);
search.where('aBoolean').does.not.equal(true);
search.where('aBoolean').is.equalTo(true);
search.where('aBoolean').is.not.equalTo(true);

search.where('aBoolean').true();
search.where('aBoolean').false();
search.where('aBoolean').is.true();
search.where('aBoolean').is.false();
search.where('aBoolean').is.not.true();
search.where('aBoolean').is.not.false();

// numbers
search.where('aNumber').eq(42);
search.where('aNumber').not.eq(42);
search.where('aNumber').equals(42);
search.where('aNumber').does.equal(42);
search.where('aNumber').does.not.equal(42);
search.where('aNumber').is.equalTo(42);
search.where('aNumber').is.not.equalTo(42);

search.where('aNumber').gt(42);
search.where('aNumber').not.gt(42);
search.where('aNumber').greaterThan(42);
search.where('aNumber').is.greaterThan(42);
search.where('aNumber').is.not.greaterThan(42);

search.where('aNumber').gte(42);
search.where('aNumber').not.gte(42);
search.where('aNumber').greaterThanOrEqualTo(42);
search.where('aNumber').is.greaterThanOrEqualTo(42);
search.where('aNumber').is.not.greaterThanOrEqualTo(42);

search.where('aNumber').lt(42);
search.where('aNumber').not.lt(42);
search.where('aNumber').lessThan(42);
search.where('aNumber').is.lessThan(42);
search.where('aNumber').is.not.lessThan(42);

search.where('aNumber').lte(42);
search.where('aNumber').not.lte(42);
search.where('aNumber').lessThanOrEqualTo(42);
search.where('aNumber').is.lessThanOrEqualTo(42);
search.where('aNumber').is.not.lessThanOrEqualTo(42);

search.where('aNumber').between(23, 42);
search.where('aNumber').not.between(23, 42);
search.where('aNumber').is.between(23, 42);
search.where('aNumber').is.not.between(23, 42);

// arrays
search.where('anArray').contains('foo');
search.where('anArray').does.contain('foo');
search.where('anArray').does.not.contain('foo');

search.where('anArray').containsOneOf('foo', 'bar', 'baz');
search.where('anArray').does.containOneOf('foo', 'bar', 'baz');
search.where('anArray').does.not.containOneOf('foo', 'bar', 'baz');

// boolean logic
search
  .where('aString').equals('foo')
  .or('aString').equals('bar')
  .and('aBoolean').is.true();

// nested logic
search
  .where(search => search
    .where('aString').equals('foo')
    .or('aString').equals('bar')
  )
  .and(search => search
    .where('anArray').contains('baz')
    .or('aBoolean').is.true()
  );

```



<!-- Badges -->

[license-image]: https://img.shields.io/badge/License-BSD%203--Clause-blue.svg
[license-url]: LICENSE