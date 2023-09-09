import { SearchField } from "./base";

import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export class BigIntField<T extends ParseSchema<any>, L extends bigint> extends SearchField<T, L> {

    public eq(...value: Array<L>): Search<T>;
    public eq(value: Array<L>): Search<T>;
    public eq(value: Array<L> | L): Search<T> {
        return this.#handleMultipleFields(Array.isArray(value) ? value : arguments);
    }

    public equals(...value: Array<L>): Search<T>;
    public equals(value: Array<L>): Search<T>;
    public equals(): Search<T> {
        return this.eq(...arguments);
    }

    public equalsTo(...value: Array<L>): Search<T>;
    public equalsTo(value: Array<L>): Search<T>;
    public equalsTo(): Search<T> {
        return this.eq(...arguments);
    }

    protected construct(): string {
        return `{${this.value}${this.or.length > 0 ? ` | ${this.or.join(" | ")}` : ""}}`;
    }

    /** @internal */
    #handleMultipleFields(value: Array<L> | IArguments): Search<T> {
        const length = value.length;

        this.value = value[0].toString();

        if (length > 1) {
            for (let i = 1; i < length; i++) {
                this.or.push(value[i].toString());
            }
        }

        this.search._query.push(this);
        return this.search;
    }
}