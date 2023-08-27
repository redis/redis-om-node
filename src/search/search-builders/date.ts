import { SearchField } from "./base";

import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export class DateField<T extends ParseSchema<any>> extends SearchField<T> {

    declare protected value: [string, string];

    public eq(value: Date | number | string): Search<T> {
        const time = this.#getTime(value);
        this.value = [time, time];
        this.search._query.push(this);
        return this.search;
    }

    public gt(value: Date | number | string): Search<T> {
        this.value = [`(${this.#getTime(value)}`, "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public gte(value: Date | number | string): Search<T> {
        this.value = [this.#getTime(value), "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public lt(value: Date | number | string): Search<T> {
        this.value = ["-inf", `(${this.#getTime(value)}`];
        this.search._query.push(this);
        return this.search;
    }

    public lte(value: Date | number | string): Search<T> {
        this.value = ["-inf", this.#getTime(value)];
        this.search._query.push(this);
        return this.search;
    }

    public between(lower: Date | number | string, upper: Date | number | string): Search<T> {
        this.value = [this.#getTime(lower), this.#getTime(upper)];
        this.search._query.push(this);
        return this.search;
    }

    public equals(value: Date | number | string): Search<T> {
        return this.eq(value);
    }

    public equalsTo(value: Date | number | string): Search<T> {
        return this.eq(value);
    }

    public greaterThan(value: Date | number | string): Search<T> {
        return this.gt(value);
    }

    public greaterThanOrEqualTo(value: Date | number | string): Search<T> {
        return this.gte(value);
    }

    public lessThan(value: Date | number | string): Search<T> {
        return this.lt(value);
    }

    public lessThanOrEqualTo(value: Date | number | string): Search<T> {
        return this.lte(value);
    }

    public on(value: Date | number | string): Search<T> {
        return this.eq(value);
    }

    public after(value: Date | number | string): Search<T> {
        return this.gt(value);
    }

    public before(value: Date | number | string): Search<T> {
        return this.lt(value);
    }

    public onOrAfter(value: Date | number | string): Search<T> {
        return this.gte(value);
    }

    public onOrBefore(value: Date | number | string): Search<T> {
        return this.lte(value);
    }

    protected construct(): string {
        return `[${this.value.join(" ")}]`;
    }

    #getTime(value: Date | number | string): string {
        if (value instanceof Date) return value.getTime().toString();
        if (typeof value === "string") return new Date(value).getTime().toString();
        return value.toString();
    }
}