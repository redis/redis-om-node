/* eslint-disable @typescript-eslint/naming-convention */
import { randomUUID } from "node:crypto";

import { ReferenceArray } from "../utils";
import {
    validateSchemaReferences,
    validateSchemaData,
    objectToHashString,
    getLastKeyInSchema,
    tupleToObjStrings,
    hashFieldToString,
    stringToHashField,
    stringToHashArray,
    stringsToObject,
    deepMerge
} from "./document-helpers";

import type { DocumentShared, ObjectField, ParseSchema } from "../typings";

export class HASHDocument implements DocumentShared {

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

                    if (arr.length > 1) /* This is an object or tuple */ {
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (schema.data[arr[0]]?.type === "tuple") {
                            // var name
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const temp = arr.shift()!;

                            if (arr.length === 1) {
                                this[temp].push(stringToHashField(
                                    //@ts-expect-error Type overload
                                    schema.data[temp].elements[arr[0]],
                                    <string>value
                                ));

                                continue;
                            }

                            //@ts-expect-error Type overload
                            this[temp].push(stringToHashArray(arr, schema.data[temp].elements, value));
                        } else /*we assume its an object*/ {
                            this[arr[0]] = deepMerge(
                                this[arr[0]],
                                stringsToObject(
                                    arr,
                                    stringToHashField(
                                        getLastKeyInSchema(<Required<ObjectField>>schema.data[arr[0]], <string>arr.at(-1)) ?? { type: "string" },
                                        <string>value
                                    )
                                )[arr[0]]
                            );
                        }
                        continue;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (schema.references[key] === null) {
                        if (!this.#autoFetch) {
                            this[key] = new ReferenceArray(...<Array<string>>stringToHashField({ type: "array" }, <string>value));
                            continue;
                        }
                        this[key] = value;
                        continue;
                    }

                    this[key] = stringToHashField(<never>schema.data[key], <string>value);
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

        const arr = [
            "$id",
            this.$id
        ];

        if (this.$suffix) arr.push("$suffix", this.$suffix);

        for (let i = 0, entries = Object.entries(this.#schema.data), len = entries.length; i < len; i++) {
            const [key, val] = entries[i];

            if (typeof this[key] === "undefined") continue;

            if (val.type === "object") {
                //@ts-expect-error Typescript is getting confused due to the union of array and object
                arr.push(...objectToHashString(this[key], key, val.properties));
                continue;
            } else if (val.type === "tuple") {
                const temp = tupleToObjStrings(<never>this[key], key);
                for (let j = 0, le = temp.length; j < le; j++) {
                    const [k, value] = Object.entries(temp[j])[0];

                    //@ts-expect-error Type Overload
                    if (val.elements[j].type === "object") {
                        //@ts-expect-error Type Overload
                        arr.push(...objectToHashString(value, k, val.elements[j].properties));
                        continue;
                    }

                    arr.push(k, hashFieldToString(<never>val, value));
                }
                continue;
            }

            arr.push(key, hashFieldToString(<never>val, this[key]));

        }

        if (!this.#autoFetch) {
            if (this.#validate) this.#validateSchemaReferences(this.#schema.references);
            for (let i = 0, keys = Object.keys(this.#schema.references), len = keys.length; i < len; i++) {
                const key = keys[i];

                if (!this[key]?.length) continue;
                arr.push(key, hashFieldToString({ type: "array" }, this[key]));
            }
        }

        //@ts-expect-error pls dont question it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return arr;
    }
}