import { SearchField } from "./base";

import type { Point, ParseSchema, Units } from "../../typings";
import type { Search } from "../search";

export type CircleFunction = (circle: Circle) => Circle;

export class Circle {

    /** @internal */
    public _longitude: number = 0;

    /** @internal */
    public _latitude: number = 0;

    /** @internal */
    public size: number = 1;

    /** @internal */
    public units: Units = "m";

    public longitude(value: number): Circle {
        this._longitude = value;
        return this;
    }

    public latitude(value: number): Circle {
        this._latitude = value;
        return this;
    }

    public origin(point: Point): Circle;
    public origin(longitude: number, latitude: number): Circle;
    public origin(pointOrLongitude: number | Point, latitude?: number): Circle {
        if (typeof pointOrLongitude === "object") {
            const { longitude, latitude: lat } = pointOrLongitude;
            this._longitude = longitude;
            this._latitude = lat;
            return this;
        }

        this._longitude = pointOrLongitude;
        latitude && (this._latitude = latitude);
        return this;
    }

    public radius(size: number): Circle {
        this.size = size;
        return this;
    }

    public get meters(): Circle {
        this.units = "m";
        return this;
    }

    public get meter(): Circle {
        return this.meters;
    }

    public get m(): Circle {
        return this.meters;
    }

    public get kilometers(): Circle {
        this.units = "km";
        return this;
    }

    public get kilometer(): Circle {
        return this.kilometers;
    }

    public get km(): Circle {
        return this.kilometers;
    }

    public get feet(): Circle {
        this.units = "ft";
        return this;
    }

    public get foot(): Circle {
        return this.feet;
    }

    public get ft(): Circle {
        return this.feet;
    }

    public get miles(): Circle {
        this.units = "mi";
        return this;
    }

    public get mile(): Circle {
        return this.miles;
    }

    public get mi(): Circle {
        return this.miles;
    }

}

export class PointField<T extends ParseSchema<any>> extends SearchField<T> {
    #circle: Circle = new Circle();

    public override eq(fn: CircleFunction | Circle): Search<T> {
        this.#circle = typeof fn === "function" ? fn(this.#circle) : fn;
        this.search._query.push(this);
        return this.search;
    }

    public override equals(fn: CircleFunction | Circle): Search<T> {
        return this.eq(fn);
    }

    public override equalsTo(fn: CircleFunction | Circle): Search<T> {
        return this.eq(fn);
    }

    public inRadius(fn: CircleFunction | Circle): Search<T> {
        return this.eq(fn);
    }

    public inCircle(fn: CircleFunction | Circle): Search<T> {
        return this.eq(fn);
    }

    protected construct(): string {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _longitude, _latitude, size, units } = this.#circle;
        return `[${_longitude} ${_latitude} ${size} ${units}]`;
    }

}