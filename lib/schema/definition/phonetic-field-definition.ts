/** Mixin for adding phonetic matching for TEXT fields in RediSearch. */
interface PhoneticFieldDefinition {
  /**
   * Enables setting the phonetic matcher to use, supported matchers are:
   * dm:en - Double Metaphone for English
   * dm:fr - Double Metaphone for French
   * dm:pt - Double Metaphone for Portuguese
   * dm:es - Double Metaphone for Spanish
   */
   matcher?: 'dm:en' | 'dm:fr' | 'dm:pt' | 'dm:es';
}

export default PhoneticFieldDefinition;
