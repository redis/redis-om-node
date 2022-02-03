import { GeoPoint } from "..";
import Entity from "../entity/entity";
import Search from "./search";
import WhereField from "./where-field";

type Units = 'm' | 'km' | 'ft' | 'mi';

export type CircleFunction = (circle: Circle) => Circle

export class Circle {
  longitudeOfOrigin: number = 0;
  latitudeOfOrigin: number = 0;
  size: number = 1;
  units: Units = 'm';

  longitude(value: number) {
    this.longitudeOfOrigin = value;
    return this;
  }

  latitude(value: number) {
    this.latitudeOfOrigin = value;
    return this;
  }

  origin(point: GeoPoint) : Circle;
  origin(longitude: number, latitude: number) : Circle;
  origin(pointOrLongitude: number | GeoPoint, latitude?: number) : Circle {
    if (typeof(pointOrLongitude) === 'number' && latitude !== undefined) {
      this.longitudeOfOrigin = pointOrLongitude;
      this.latitudeOfOrigin = latitude;
    } else {
      let point = pointOrLongitude as GeoPoint;
      this.longitudeOfOrigin = point.longitude;
      this.latitudeOfOrigin = point.latitude;
    }
    return this;
  }

  radius(size: number) {
    this.size = size;
    return this;
  }

  get m() { return this.meters; }
  get meter() { return this.meters; }
  get meters() {
    this.units = 'm';
    return this;
  }

  get km() { return this.kilometers };
  get kilometer() { return this.kilometers; }
  get kilometers() {
    this.units = 'km';
    return this;
  }

  get ft() { return this.feet };
  get foot() { return this.feet; }
  get feet() {
    this.units = 'ft';
    return this;
  }

  get mi() { return this.miles };
  get mile() { return this.miles; }
  get miles() {
    this.units = 'mi';
    return this;
  }
}

export default class WhereGeo<TEntity extends Entity> extends WhereField<TEntity> {
  private circle: Circle = new Circle();

  inCircle(circleFn: CircleFunction): Search<TEntity> {
    this.circle = circleFn(this.circle);
    return this.search;
  }

  toString(): string {
    let { longitudeOfOrigin, latitudeOfOrigin, size, units } = this.circle;
    return this.buildQuery(`[${longitudeOfOrigin} ${latitudeOfOrigin} ${size} ${units}]`);
  }
}
