import { SearchField } from "./base";

import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export class NumberField<T extends ParseSchema<any>> extends SearchField<T> {

    declare protected value: [string, string];

    public eq(value: number): Search<T> {
        this.value = [value.toString(), value.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public gt(value: number): Search<T> {
        this.value = [`(${value}`, "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public gte(value: number): Search<T> {
        this.value = [value.toString(), "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public lt(value: number): Search<T> {
        this.value = ["-inf", `(${value}`];
        this.search._query.push(this);
        return this.search;
    }

    public lte(value: number): Search<T> {
        this.value = ["-inf", value.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public between(lower: number, upper: number): Search<T> {
        this.value = [lower.toString(), upper.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public equals(value: number): Search<T> {
        return this.eq(value);
    }

    public equalsTo(value: number): Search<T> {
        return this.eq(value);
    }

    public greaterThan(value: number): Search<T> {
        return this.gt(value);
    }

    public greaterThanOrEqualTo(value: number): Search<T> {
        return this.gte(value);
    }

    public lessThan(value: number): Search<T> {
        return this.lt(value);
    }

    public lessThanOrEqualTo(value: number): Search<T> {
        return this.lte(value);
    }

    protected construct(): string {
        return `[${this.value.join(" ")}]`;
    }
}