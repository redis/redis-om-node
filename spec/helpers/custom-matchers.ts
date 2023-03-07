export {}

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toThrowErrorOfType(expectedType: any, expectedMessage: string): void
    }
    interface Matchers<R> {
      toThrowErrorOfType(expectedType: any, expectedMessage: string): R
    }
  }
}

expect.extend({
  toThrowErrorOfType(fnOrError, expectedType, expectedMessage) {

    let pass: boolean, actual: any

    if (fnOrError instanceof Function) {
      try {
        fnOrError()
      } catch (error: any) {
        actual = error
      }
    } else {
      actual = fnOrError
    }

    pass = actual.constructor.name === expectedType.name && actual.message === expectedMessage

    return {
      pass,
      message: () =>
        `Expected${ pass ? ' not ' : ' ' }to throw ${expectedType.name} with message "${expectedMessage}".\n` +
        `Received: ${actual.constructor.name} with message "${actual.message}"`
    }
  }
})
