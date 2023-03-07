import { RedisOmError } from './redis-om-error'
import { Point } from "../entity"

export class PointOutOfRange extends RedisOmError {

  #latitude
  #longitude

  constructor(point: Point) {
    super("Points must be between ±85.05112878 latitude and ±180 longitude.")
    this.#longitude = point.longitude
    this.#latitude = point.latitude
  }

  get point() {
    return { longitude: this.#longitude, latitude: this.#latitude }
  }
}
