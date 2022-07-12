[redis-om](../README.md) / PhoneticFieldDefinition

# Interface: PhoneticFieldDefinition

Mixin for adding phonetic matching for TEXT fields in RediSearch.

## Hierarchy

- **`PhoneticFieldDefinition`**

  ↳ [`TextFieldDefinition`](TextFieldDefinition.md)

## Table of contents

### Properties

- [matcher](PhoneticFieldDefinition.md#matcher)

## Properties

### matcher

• `Optional` **matcher**: ``"dm:en"`` \| ``"dm:fr"`` \| ``"dm:pt"`` \| ``"dm:es"``

Enables setting the phonetic matcher to use, supported matchers are:
dm:en - Double Metaphone for English
dm:fr - Double Metaphone for French
dm:pt - Double Metaphone for Portuguese
dm:es - Double Metaphone for Spanish

#### Defined in

[lib/schema/definition/phonetic-field-definition.ts:10](https://github.com/redis/redis-om-node/blob/f2d3aed/lib/schema/definition/phonetic-field-definition.ts#L10)
