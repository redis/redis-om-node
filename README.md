<div align="center">
  <br/>
  <br/>
  <img width="360" src="logo.svg" alt="Redis OM" />
  <br/>
  <br/>
</div>

[![License][license-image]][license-url]

# Object Mapping (and more) for Redis!

Redis OM for Node.js (prounced _ohm_) makes it super simple to write applications the store and retrieve data from Redis.

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