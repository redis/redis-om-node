declare global {
  namespace jest {
    interface Matchers<R> {
      toBeUlid(): R;
    }
  }
}

expect.extend({
  toBeUlid(actual: string) {

    if (actual.match(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/)) {
      return {
        pass: true,
        message: () => `Expected ${actual} not to be a valid ISO date string`
      }
    } else {
      return {
        pass: false,
        message: () => `Expected ${actual} to be a valid ULID`
      };
    }
  }
});

export {};
