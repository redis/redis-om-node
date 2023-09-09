import { SearchField } from "./base";

import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export class TextField<T extends ParseSchema<any>> extends SearchField<T> {

    protected override value: {
        val: string,
        exact: boolean
    } = { val: "", exact: false };

    public eq(...value: Array<string>): Search<T>;
    public eq(value: Array<string>): Search<T>;
    public eq(value: Array<string> | string): Search<T> {
        return this.#handleMultipleFields(Array.isArray(value) ? value : arguments);
    }

    public equals(...value: Array<string>): Search<T>;
    public equals(value: Array<string>): Search<T>;
    public equals(): Search<T> {
        return this.eq(...arguments);
    }

    public equalsTo(...value: Array<string>): Search<T>;
    public equalsTo(value: Array<string>): Search<T>;
    public equalsTo(): Search<T> {
        return this.eq(...arguments);
    }

    public exact(...value: Array<string>): Search<T>;
    public exact(value: Array<string>): Search<T>;
    public exact(value: Array<string> | string): Search<T> {
        return this.#handleMultipleFields(Array.isArray(value) ? value : arguments, true);
    }

    public match(...value: Array<string>): Search<T>;
    public match(value: Array<string>): Search<T>;
    public match(): Search<T> {
        return this.eq(...arguments);
    }

    public matches(...value: Array<string>): Search<T>;
    public matches(value: Array<string>): Search<T>;
    public matches(): Search<T> {
        return this.eq(...arguments);
    }

    public matchExact(...value: Array<string>): Search<T>;
    public matchExact(value: Array<string>): Search<T>;
    public matchExact(): Search<T> {
        return this.exact(...arguments);
    }

    public matchExactly(...value: Array<string>): Search<T>;
    public matchExactly(value: Array<string>): Search<T>;
    public matchExactly(): Search<T> {
        return this.exact(...arguments);
    }

    public matchesExactly(...value: Array<string>): Search<T>;
    public matchesExactly(value: Array<string>): Search<T>;
    public matchesExactly(): Search<T> {
        return this.exact(...arguments);
    }

    public get exactly(): Exclude<typeof this, "exact" | "matchExact" | "matchExactly" | "matchesExactly"> {
        this.value.exact = true;
        return <never>this;
    }

    protected construct(): string {
        return `(${this.value.exact ? `"${this.value.val}"` : this.value.val}${this.or.length > 0 ? ` | ${this.value.exact ? this.or.map((v) => `"${v}"`).join(" | ") : this.or.join(" | ")}` : ""})`;
    }

    /** @internal */
    #handleMultipleFields(value: Array<string> | IArguments, exact: boolean = false): Search<T> {
        const length = value.length;

        this.value = { val: value[0], exact };

        if (length > 1) {
            for (let i = 1; i < length; i++) {
                this.or.push(value[i]);
            }
        }

        this.search._query.push(this);
        return this.search;
    }
}