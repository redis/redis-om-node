import { SearchField } from "./base";

import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export class NumberField<T extends ParseSchema<any>, L extends number> extends SearchField<T, L> {

    declare protected value: [string, string];

    public eq(value: L): Search<T> {
        this.value = [value.toString(), value.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public gt(value: L): Search<T> {
        this.value = [`(${value}`, "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public gte(value: L): Search<T> {
        this.value = [value.toString(), "+inf"];
        this.search._query.push(this);
        return this.search;
    }

    public lt(value: L): Search<T> {
        this.value = ["-inf", `(${value}`];
        this.search._query.push(this);
        return this.search;
    }

    public lte(value: L): Search<T> {
        this.value = ["-inf", value.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public between(lower: L, upper: L): Search<T> {
        this.value = [lower.toString(), upper.toString()];
        this.search._query.push(this);
        return this.search;
    }

    public equals(value: L): Search<T> {
        return this.eq(value);
    }

    public equalsTo(value: L): Search<T> {
        return this.eq(value);
    }

    public greaterThan(value: L): Search<T> {
        return this.gt(value);
    }

    public greaterThanOrEqualTo(value: L): Search<T> {
        return this.gte(value);
    }

    public lessThan(value: L): Search<T> {
        return this.lt(value);
    }

    public lessThanOrEqualTo(value: L): Search<T> {
        return this.lte(value);
    }

    protected construct(): string {
        return `[${this.value.join(" ")}]`;
    }
}