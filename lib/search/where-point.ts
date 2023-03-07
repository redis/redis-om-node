import { Point } from "../entity"
import { Search } from "./search"
import { WhereField } from "./where-field"

type Units = 'm' | 'km' | 'ft' | 'mi'

/** A function that defines a circle for `.inCircle` searches. */
export type CircleFunction = (circle: Circle) => Circle

/** A builder that defines a circle. */
export class Circle {

  /** @internal */
  longitudeOfOrigin: number = 0

  /** @internal */
  latitudeOfOrigin: number = 0

  /** @internal */
  size: number = 1

  /** @internal */
  units: Units = 'm'

  /**
   * Sets the longitude. If not set, defaults to 0.0.
   *
   * @param value The longitude.
   * @returns This instance.
   */
  longitude(value: number) {
    this.longitudeOfOrigin = value
    return this
  }

  /**
   * Sets the latitude. If not set, defaults to 0.0.
   *
   * @param value The latitude.
   * @returns This instance.
   */
  latitude(value: number) {
    this.latitudeOfOrigin = value
    return this
  }

  /**
   * Sets the origin of the circle using a {@link Point}. If not
   * set, defaults to [Null Island](https://en.wikipedia.org/wiki/Null_Island).
   *
   * @param point A {@link Point} containing the longitude and latitude of the origin.
   * @returns This instance.
   */
  origin(point: Point): Circle

  /**
   * Sets the origin of the circle. If not set, defaults to
   * [Null Island](https://en.wikipedia.org/wiki/Null_Island).
   *
   * @param longitude The longitude.
   * @param latitude The latitude.
   * @returns This instance.
   */
  origin(longitude: number, latitude: number): Circle

  /** @internal */
  origin(pointOrLongitude: number | Point, latitude?: number): Circle {
    if (typeof pointOrLongitude === 'number' && latitude !== undefined) {
      this.longitudeOfOrigin = pointOrLongitude
      this.latitudeOfOrigin = latitude
    } else {
      const point = pointOrLongitude as Point
      this.longitudeOfOrigin = point.longitude
      this.latitudeOfOrigin = point.latitude
    }
    return this
  }

  /**
   * Sets the radius of the {@link Circle}. Defaults to 1. If units are
   * not specified, defaults to meters.
   *
   * @param size The radius of the circle.
   * @returns This instance.
   */
  radius(size: number) {
    this.size = size
    return this
  }

  /**
   * Sets the units to meters.
   * @returns This instance.
   */
  get m() { return this.meters }

  /**
   * Sets the units to meters.
   * @returns This instance.
   */
  get meter() { return this.meters }

  /**
   * Sets the units to meters.
   * @returns This instance.
   */
  get meters() {
    this.units = 'm'
    return this
  }

  /**
   * Sets the units to kilometers.
   * @returns This instance.
   */
  get km() { return this.kilometers }

  /**
   * Sets the units to kilometers.
   * @returns This instance.
   */
  get kilometer() { return this.kilometers }

  /**
   * Sets the units to kilometers.
   * @returns This instance.
   */
  get kilometers() {
    this.units = 'km'
    return this
  }

  /**
   * Sets the units to feet.
   * @returns This instance.
   */
  get ft() { return this.feet }

  /**
   * Sets the units to feet.
   * @returns This instance.
   */
  get foot() { return this.feet }

  /**
   * Sets the units to feet.
   * @returns This instance.
   */
  get feet() {
    this.units = 'ft'
    return this
  }

  /**
   * Sets the units to miles.
   * @returns This instance.
   */
  get mi() { return this.miles }

  /**
   * Sets the units to miles.
   * @returns This instance.
   */
  get mile() { return this.miles }

  /**
   * Sets the units to miles.
   * @returns This instance.
   */
  get miles() {
    this.units = 'mi'
    return this
  }
}

export class WherePoint extends WhereField {
  private circle: Circle = new Circle()

  inRadius(circleFn: CircleFunction): Search {
    return this.inCircle(circleFn)
  }

  inCircle(circleFn: CircleFunction): Search {
    this.circle = circleFn(this.circle)
    return this.search
  }

  toString(): string {
    const { longitudeOfOrigin, latitudeOfOrigin, size, units } = this.circle
    return this.buildQuery(`[${longitudeOfOrigin} ${latitudeOfOrigin} ${size} ${units}]`)
  }
}
