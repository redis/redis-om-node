import { PrettyError } from "@infinite-fansub/logger";

import type { SearchOptions, SearchReply } from "redis";

import type { JSONDocument, HASHDocument } from "../document";

import {
    type SearchField,
    BooleanField,
    StringField,
    NumberField,
    BigIntField,
    VectorField,
    PointField,
    TextField,
    DateField
} from "./search-builders";

import type {
    SearchInformation,
    ParseSearchSchema,
    NodeRedisClient,
    FieldStringType,
    MapSearchField,
    ReturnDocument,
    ParseSchema,
    BaseField,
    ParsedMap,
    FieldType
} from "../typings";

export type SearchReturn<T extends Search<ParseSchema<any>>> = Omit<T, "where" | "and" | "or" | "rawQuery" | `sort${string}` | `return${string}`>;
export type SearchSortReturn<T extends Search<ParseSchema<any>>> = Omit<T, `sort${string}`>;

export class Search<T extends ParseSchema<any>, P extends ParseSearchSchema<T["data"]> = ParseSearchSchema<T["data"]>> {
    readonly #client: NodeRedisClient;
    readonly #schema: T;
    readonly #parsedSchema: ParsedMap;
    readonly #information: SearchInformation;
    readonly #doc: typeof JSONDocument | typeof HASHDocument;
    #workingType!: FieldType["type"];

    /**
     * LIMIT defaults to 0 10
     * SORTBY DIRECTION defaults to ASC
    */
    #options: SearchOptions = {};

    /** @internal */
    public _query: Array<SearchField<T>> = [];

    /** @internal */
    public _vector?: VectorField<T>;

    public constructor(
        client: NodeRedisClient,
        schema: T,
        doc: typeof JSONDocument | typeof HASHDocument,
        parsedSchema: ParsedMap,
        information: SearchInformation
    ) {
        this.#client = client;
        this.#schema = schema;
        this.#doc = doc;
        this.#parsedSchema = parsedSchema;
        this.#information = information;
    }

    public where<F extends keyof P>(field: F): MapSearchField<F, T, P> {
        return this.#createWhere(field);
    }

    public and<F extends keyof P>(field: F): MapSearchField<F, T, P> {
        return this.#createWhere(field);
    }

    public or(value: unknown): this {
        if (this.#workingType === "string" || this.#workingType === "boolean" || this.#workingType === "text") {
            this._query.at(-1)?.or.push(value);
        }

        return this;
    }

    public sortBy<F extends keyof P>(field: F, order: "ASC" | "DESC" = "ASC"): SearchSortReturn<Search<T>> {
        this.#options.SORTBY = { BY: <string>field, DIRECTION: order };
        return <never>this;
    }

    public sortAsc<F extends keyof P>(field: F): SearchSortReturn<Search<T>> {
        return this.sortBy(field);
    }

    public sortAscending<F extends keyof P>(field: F): SearchSortReturn<Search<T>> {
        return this.sortBy(field);
    }

    public sortDesc<F extends keyof P>(field: F): SearchSortReturn<Search<T>> {
        return this.sortBy(field, "DESC");
    }

    public sortDescending<F extends keyof P>(field: F): SearchSortReturn<Search<T>> {
        return this.sortBy(field, "DESC");
    }

    public async count(): Promise<number> {
        this.#options.LIMIT = { from: 0, size: 0 };
        return (await this.#search()).total;
    }

    public async page<F extends boolean = false>(offset: number, count: number, autoFetch?: F): Promise<Array<ReturnDocument<T, F>> | undefined> {
        const { total, documents } = await this.#search({ LIMIT: { from: offset, size: count } });
        if (total === 0) return undefined;

        const docs = [];

        for (let i = 0, len = documents.length; i < len; i++) {
            const doc = documents[i];
            if (autoFetch) {
                for (let j = 0, keys = Object.keys(this.#schema.references), le = keys.length; j < le; j++) {
                    const key = keys[j];
                    const val = <Array<string>><unknown>doc.value[key];
                    const temp = [];

                    for (let k = 0, l = val.length; k < l; k++) {
                        temp.push(this.#get(val[k]));
                    }

                    doc.value[key] = <never>await Promise.all(temp);
                }
            }

            docs.push(new this.#doc(<never>this.#schema, {
                globalPrefix: this.#information.globalPrefix,
                prefix: this.#information.prefix,
                name: this.#information.modelName,
                suffix: this.#information.suffix
            }, doc.value, true, this.#information.skipDocumentValidation, autoFetch));
        }

        return <never>docs;
    }

    public async pageOfIds(offset: number, count: number, idOnly: boolean = false): Promise<Array<string> | undefined> {
        const { total, documents } = await this.#search({ LIMIT: { from: offset, size: count } }, true);
        if (total === 0) return undefined;

        const docs: Array<string> = [];

        for (let j = 0, len = documents.length; j < len; j++) {
            const doc = documents[j];
            docs.push(idOnly ? doc.value.$id?.toString() ?? "UNKNOWN" : doc.id);
        }

        return docs;
    }

    public async first<F extends boolean = false>(autoFetch?: F): Promise<ReturnDocument<T, F> | undefined> {
        return (await this.page(0, 1, autoFetch))?.[0];
    }

    public async firstId(withKey: boolean = false): Promise<string | undefined> {
        return (await this.pageOfIds(0, 1, withKey))?.[0];
    }

    public async min<F extends keyof P, AF extends boolean = false>(field: F, autoFetch?: AF): Promise<ReturnDocument<T, AF> | undefined> {
        return await this.sortBy(field, "ASC").first(autoFetch);
    }

    public async minId<F extends keyof P>(field: F): Promise<string | undefined> {
        return await this.sortBy(field, "ASC").firstId();
    }

    public async max<F extends keyof P, AF extends boolean = false>(field: F, autoFetch?: AF): Promise<ReturnDocument<T, AF> | undefined> {
        return await this.sortBy(field, "DESC").first(autoFetch);
    }

    public async maxId<F extends keyof P>(field: F): Promise<string | undefined> {
        return await this.sortBy(field, "DESC").firstId();
    }

    public async all<F extends boolean = false>(autoFetch?: F): Promise<Array<ReturnDocument<T, F>> | undefined> {
        const { total } = await this.#search({ LIMIT: { from: 0, size: 0 } });
        if (total === 0) return undefined;

        const { documents } = await this.#search({ LIMIT: { from: 0, size: total } });
        const docs = [];

        for (let i = 0, len = documents.length; i < len; i++) {
            const doc = documents[i];

            if (autoFetch) {
                for (let j = 0, keys = Object.keys(this.#schema.references), le = keys.length; j < le; j++) {
                    const key = keys[j];
                    const val = <Array<string>><unknown>doc.value[key];
                    const temp = [];

                    for (let k = 0, l = val.length; k < l; k++) {
                        temp.push(this.#get(val[k]));
                    }

                    doc.value[key] = <never>await Promise.all(temp);
                }
            }
            docs.push(new this.#doc(<never>this.#schema, {
                globalPrefix: this.#information.globalPrefix,
                prefix: this.#information.prefix,
                name: this.#information.modelName,
                suffix: this.#information.suffix
            }, doc.value, true, this.#information.skipDocumentValidation, autoFetch));
        }

        return <never>docs;
    }

    public async allIds(idOnly: boolean = false): Promise<Array<string> | undefined> {
        const { total } = await this.#search({ LIMIT: { from: 0, size: 0 } });
        if (total === 0) return undefined;

        const { documents } = await this.#search({ LIMIT: { from: 0, size: total } });
        const docs: Array<string> = [];

        for (let i = 0, len = documents.length; i < len; i++) {
            const doc = documents[i];
            docs.push(idOnly ? doc.value.$id?.toString() ?? "UNKNOWN" : doc.id);
        }

        return docs;
    }

    public async returnCount(): Promise<number> {
        return this.count();
    }

    public async returnAll<F extends boolean = false>(autoFetch?: F): Promise<Array<ReturnDocument<T, F>> | undefined> {
        return await this.all(autoFetch);
    }

    public async returnAllIds(withKey: boolean = false): Promise<Array<string> | undefined> {
        return await this.allIds(withKey);
    }

    public async returnPage<F extends boolean = false>(offset: number, count: number, autoFetch?: F): Promise<Array<ReturnDocument<T, F>> | undefined> {
        return await this.page(offset, count, autoFetch);
    }

    public async returnPageOfIds(offset: number, count: number, withKey: boolean = false): Promise<Array<string> | undefined> {
        return await this.pageOfIds(offset, count, withKey);
    }

    public async returnFirst<F extends boolean = false>(autoFetch?: F): Promise<ReturnDocument<T, F> | undefined> {
        return await this.first(autoFetch);
    }

    public async returnFirstId(withKey: boolean = false): Promise<string | undefined> {
        return await this.firstId(withKey);
    }

    public async returnMin<F extends keyof P, AF extends boolean = false>(field: F, autoFetch?: AF): Promise<ReturnDocument<T, AF> | undefined> {
        return await this.min(field, autoFetch);
    }

    public async returnMinId<F extends keyof P>(field: F): Promise<string | undefined> {
        return await this.minId(field);
    }

    public async returnMax<F extends keyof P, AF extends boolean = false>(field: F, autoFetch?: AF): Promise<ReturnDocument<T, AF> | undefined> {
        return await this.max(field, autoFetch);
    }

    public async returnMaxId<F extends keyof P>(field: F): Promise<string | undefined> {
        return await this.maxId(field);
    }

    async #search(options?: SearchOptions, keysOnly: boolean = false): Promise<SearchReply> {
        const query = this.#buildQuery();
        options = { ...this.#options, ...options };
        if (keysOnly) options.RETURN = [];
        return await this.#client.ft.search(this.#information.searchIndex, query, options);
    }

    async #get(id: string): Promise<ReturnDocument<T> | null> {
        const data = this.#information.dataStructure === "JSON" ? await this.#client.json.get(id) : await this.#client.hGetAll(id);

        if (data === null || Object.keys(data).length === 0) return null;

        return <never>new this.#doc(<never>this.#schema, {
            globalPrefix: this.#information.globalPrefix,
            prefix: this.#information.prefix,
            name: this.#information.modelName,
            suffix: this.#information.suffix
        }, <never>data, true, this.#information.skipDocumentValidation, false);
    }

    #buildQuery(): string {
        let query = "";
        if (this._query.length === 0) query = "*";
        else query = this.#parseQuery();

        if (typeof this._vector !== "undefined") {
            this.#options.DIALECT = 2;
            this.#options.PARAMS = { BLOB: this._vector._vector._buffer };
            query += this._vector.toString();
        }

        return query;
    }

    #parseQuery(): string {
        let query = "";
        for (let i = 0, len = this._query.length; i < len; i++) {
            const queryPart = this._query[i];
            if (queryPart instanceof VectorField) {
                this.#options.DIALECT = 2;
                this.#options.PARAMS = { BLOB: queryPart._vector._buffer };
            }
            // @ts-expect-error This looks like something that should be reported
            query += `${queryPart.toString()} `;
        }

        return query;
    }

    #createWhere<F extends keyof P>(field: F): MapSearchField<F, T, P> {
        if (typeof field !== "string") throw new PrettyError(`Expected a field name but instead got '${typeof field}'`);

        const parsedField = this.#parsedSchema.get(field);
        if (!parsedField) throw new PrettyError(`'${field}' doesn't exist on the schema`);

        const { type, searchPath } = parsedField;

        return <never>this.#defineReturn(searchPath, type);
    }

    #defineReturn(field: string, type: Exclude<FieldStringType, "array">): BaseField {
        switch (type) {
            case "string": {
                this.#workingType = "string";
                return <never>new StringField<T, string>(this, field);
            }
            case "number": {
                this.#workingType = "number";
                return <never>new NumberField<T, number>(this, field);
            }
            case "bigint": {
                this.#workingType = "bigint";
                return <never>new BigIntField<T, bigint>(this, field);
            }
            case "boolean": {
                this.#workingType = "boolean";
                return <never>new BooleanField<T>(this, field);
            }
            case "text": {
                this.#workingType = "text";
                return <never>new TextField<T>(this, field);
            }
            case "date": {
                this.#workingType = "date";
                return <never>new DateField<T>(this, field);
            }
            case "point": {
                this.#workingType = "point";
                return <never>new PointField<T>(this, field);
            }
            case "vector": {
                this.#workingType = "vector";
                return <never>new VectorField<T>(this, field);
            }
        }
    }

    public get rawQuery(): string {
        return this.#buildQuery();
    }

    public get return(): SearchReturn<Search<T>> {
        return <never>this;
    }
}