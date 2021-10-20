import { JsonEntity } from "../functional/helpers/data-helper";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeUlid(): CustomMatcherResult;
      toBeTrue(): CustomMatcherResult;
      toBeFalse(): CustomMatcherResult;
    }
  }
}

expect.extend({

  toBeUlid(actual): jest.CustomMatcherResult {
    return actual.match(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/)
      ? { pass: true, message: () => `Expected ${actual} not to be a valid ULID` }
      : { pass: false, message: () => `Expected ${actual} to be a valid ULID` };
  },

  toBeTrue(actual): jest.CustomMatcherResult {
    return actual === true
      ? { pass: true, message: () => `Expected ${actual} not to be a true` }
      : { pass: false, message: () => `Expected ${actual} to be true` };
  },

  toBeFalse(actual): jest.CustomMatcherResult {
    return actual === false
      ? { pass: true, message: () => `Expected ${actual} not to be a false` }
      : { pass: false, message: () => `Expected ${actual} to be false` };
  }

});

export {};
