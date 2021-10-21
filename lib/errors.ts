export default class RedisError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RedisError'
  }
}