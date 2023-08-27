/* eslint-disable @typescript-eslint/naming-convention */
import { randomUUID } from "node:crypto";

import { ReferenceArray } from "../utils";
import {
    validateSchemaReferences,
    validateSchemaData,
    tupleToObjStrings,
    jsonFieldToDoc,
    docToJson
} from "./document-helpers";

import type { DocumentShared, ParseSchema } from "../typings";

export class JSONDocument implements DocumentShared {

    readonly #schema: ParseSchema<any>;
    readonly #validate: boolean;
    readonly #autoFetch: boolean;
    #validateSchemaReferences = validateSchemaReferences;
    #validateSchemaData = validateSchemaData;

    public readonly $global_prefix: string;
    public readonly $prefix: string;
    public readonly $model_name: string;
    public readonly $suffix: string | undefined;
    public readonly $id: string;
    public readonly $record_id: string;

    /*
    * Using any so everything works as intended
    * I couldn't find any other way to do this or implement the MapSchema type directly in the class
    */
    /** @internal */
    [key: string]: any;

    public constructor(
        schema: ParseSchema<any>,
        record: {
            globalPrefix: string,
            prefix: string,
            name: string,
            suffix?: string | (() => string) | undefined,
            id?: string | undefined
        },
        data?: Record<string, any>,
        isFetchedData: boolean = false,
        validate: boolean = true,
        wasAutoFetched: boolean = false
    ) {
        this.$global_prefix = record.globalPrefix;
        this.$prefix = record.prefix;
        this.$model_name = record.name;
        this.$suffix = data?.$suffix ?? (typeof record.suffix === "function" ? record.suffix() : record.suffix);
        this.$id = data?.$id ?? record.id ?? randomUUID();
        this.$record_id = `${this.$global_prefix}:${this.$prefix}:${this.$model_name}:${this.$suffix ? `${this.$suffix}:` : ""}${this.$id}`;
        this.#schema = schema;
        this.#validate = validate;
        this.#autoFetch = wasAutoFetched;

        this.#populate();

        if (data) {
            if (isFetchedData) {
                for (let i = 0, entries = Object.entries(data), len = entries.length; i < len; i++) {
                    const [key, value] = entries[i];
                    if (key.startsWith("$")) continue;
                    const arr = key.split(".");

                    if (arr.length > 1) /* This is a tuple */ {

                        // var name
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const temp = arr.shift()!;

                        if (arr.length === 1) {
                            //@ts-expect-error Type overload
                            this[temp].push(jsonFieldToDoc(schema.data[temp].elements[arr[0]], value));
                            continue;
                        }

                        //@ts-expect-error Type overload
                        this[temp].push({ [arr[1]]: jsonFieldToDoc(schema.data[temp].elements[arr[0]].properties[arr[1]], value) });
                        continue;
                    }

                    if (typeof schema.data[key] !== "undefined") {
                        this[key] = jsonFieldToDoc(<never>schema.data[key], value);
                        continue;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (schema.references[key] === null && !this.#autoFetch) {
                        this[key] = new ReferenceArray(...<Array<string>>value);
                        continue;
                    }

                    this[key] = value;
                }
            } else {
                for (let i = 0, entries = Object.entries(data), len = entries.length; i < len; i++) {
                    const [key, value] = entries[i];
                    if (key.startsWith("$")) continue;
                    this[key] = value;
                }
            }
        }
    }

    #populate(): void {
        for (let i = 0, entries = Object.entries(this.#schema.data), len = entries.length; i < len; i++) {
            const [key, value] = entries[i];
            this[key] = value.default ?? (value.type === "object"
                ? {}
                : value.type === "tuple"
                    ? []
                    : value.type === "vector"
                        //@ts-expect-error Type overload
                        ? value.vecType === "FLOAT32"
                            ? new Float32Array()
                            //@ts-expect-error Type overload
                            : value.vecType === "FLOAT64"
                                ? new Float64Array()
                                : []
                        : void 0);
        }

        for (let i = 0, keys = Object.keys(this.#schema.references), len = keys.length; i < len; i++) {
            const key = keys[i];
            this[key] = new ReferenceArray();
        }
    }

    public toString(): string {
        if (this.#validate) this.#validateSchemaData(this.#schema.data);

        const obj: Record<string, unknown> = {
            $suffix: this.$suffix,
            $id: this.$id
        };

        for (let i = 0, entries = Object.entries(this.#schema.data), len = entries.length; i < len; i++) {
            const [key, val] = entries[i];

            if (typeof this[key] === "undefined") continue;

            if (val.type === "tuple") {
                const temp = tupleToObjStrings(<never>this[key], key);
                for (let j = 0, le = temp.length; j < le; j++) {
                    const [k, value] = Object.entries(temp[j])[0];

                    //@ts-expect-error Type overload
                    if (val.elements[j].type === "object") {
                        //@ts-expect-error Type overload
                        for (let u = 0, en = Object.entries(val.elements[j].properties), l = en.length; u < l; u++) {
                            const objV = en[u][1];
                            obj[k] = docToJson(<any>objV, value);
                        }
                        continue;
                    }

                    obj[k] = value;
                }
                continue;
            }

            obj[key] = docToJson(<never>val, this[key]);
        }

        if (!this.#autoFetch) {
            if (this.#validate) this.#validateSchemaReferences(this.#schema.references);
            for (let i = 0, keys = Object.keys(this.#schema.references), len = keys.length; i < len; i++) {
                const key = keys[i];
                obj[key] = this[key];
            }
        }
        return JSON.stringify(obj, null);
    }
}