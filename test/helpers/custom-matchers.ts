declare global {
  namespace jest {
    interface Matchers<R> {
      toBeUlid(): R;
      toBeTrue(): R;
      toBeFalse(): R;
    }
  }
}

expect.extend({

  toBeUlid(actual: string) {
    return actual.match(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/)
      ? { pass: true, message: () => `Expected ${actual} not to be a valid ULID` }
      : { pass: false, message: () => `Expected ${actual} to be a valid ULID` };
  },

  toBeTrue(actual: boolean) {
    return actual === true
      ? { pass: true, message: () => `Expected ${actual} not to be a true` }
      : { pass: false, message: () => `Expected ${actual} to be true` };
  },

  toBeFalse(actual: boolean) {
    return actual === false
      ? { pass: true, message: () => `Expected ${actual} not to be a false` }
      : { pass: false, message: () => `Expected ${actual} to be false` };
  }

});

export {};
