import type { ParseSchema } from "../../typings";
import type { Search } from "../search";

export abstract class SearchField<T extends ParseSchema<any>> {

    protected negated: boolean = false;
    protected value: unknown;
    public or: Array<unknown> = [];

    public constructor(protected search: Search<T>, protected field: string) { }

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    public abstract eq(value: Array<unknown> | unknown): Search<T>;

    /** Syntactic sugar, calls `eq` */
    public abstract equals(value: unknown): Search<T>;

    /** Syntactic sugar, calls `eq` */
    public abstract equalsTo(value: unknown): Search<T>;

    /** Syntactic sugar, return self */
    public get does(): this {
        return this;
    }

    /** Syntactic sugar, return self */
    public get is(): this {
        return this;
    }

    /** Negate query, return self */
    public get not(): this {
        this.negate();
        return this;
    }

    protected negate(): void {
        this.negated = !this.negated;
    }

    protected abstract construct(): string;

    public toString(): string {
        return `(${this.negated ? "-" : ""}(@${this.field}:${this.construct()}))`;
    }
}