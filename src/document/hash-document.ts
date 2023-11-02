/* eslint-disable @typescript-eslint/naming-convention */
import { PrettyError } from "@infinite-fansub/logger";
import { randomUUID } from "node:crypto";

import { ReferenceArray } from "../utils";
import {
    validateSchemaReferences,
    documentFieldToHASHValue,
    HASHValueToDocumentField,
    validateSchemaData
} from "./document-helpers";

import type { DocumentShared, ParsedSchemaDefinition } from "../typings";

export class HASHDocument implements DocumentShared {

    readonly #schema: ParsedSchemaDefinition;
    readonly #validate: boolean;
    readonly #autoFetch: boolean;
    #validateSchemaReferences = validateSchemaReferences;
    #validateSchemaData = validateSchemaData;

    readonly #global_prefix: string;
    readonly #prefix: string;
    readonly #model_name: string;
    readonly #suffix: string | undefined;
    readonly #id: string;
    readonly #record_id: string;

    /*
    * Using any so everything works as intended
    * I couldn't find any other way to do this or implement the MapSchema type directly in the class
    */
    /** @internal */
    [key: string]: any;

    public constructor(
        schema: ParsedSchemaDefinition,
        record: {
            globalPrefix: string,
            prefix: string,
            name: string,
            suffix: string | (() => string) | undefined,
            id?: string | undefined
        },
        data?: Record<string, any>,
        isFetchedData: boolean = false,
        validate: boolean = true,
        wasAutoFetched: boolean = false
    ) {
        this.#global_prefix = record.globalPrefix;
        this.#prefix = record.prefix;
        this.#model_name = record.name;
        this.#suffix = data?.$suffix ?? (typeof record.suffix === "function" ? record.suffix() : record.suffix);
        this.#id = data?.$id?.toString() ?? record.id ?? randomUUID();
        this.#record_id = `${this.#global_prefix}:${this.#prefix}:${this.#model_name}:${this.#suffix ? `${this.#suffix}:` : ""}${this.#id}`;
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

                    if (arr.length > 1) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const keyName = arr.shift()!;
                        const workingField = schema.data[keyName];

                        if (typeof workingField !== "undefined") {
                            if (workingField.type === "tuple") {
                                if (!Array.isArray(this[keyName])) this[keyName] = [];
                                if (workingField.elements[+arr[0]].type === "object") {
                                    this[keyName][+arr[0]] = (<never>HASHValueToDocumentField(
                                        workingField.elements[+arr[0]],
                                        value,
                                        this[keyName][+arr[0]],
                                        arr
                                    ))[+arr[0]];
                                } else {
                                    this[keyName][+arr[0]] = HASHValueToDocumentField(
                                        workingField.elements[+arr[0]],
                                        value,
                                        this[keyName][+arr[0]],
                                        arr
                                    );
                                }
                            } else if (workingField.type === "object") {
                                if (workingField.properties === null) throw new PrettyError("Something went terribly wrong");
                                if (typeof this[keyName] === "undefined") this[keyName] = {};
                                this[keyName][arr[0]] = HASHValueToDocumentField(
                                    workingField.properties[arr[0]],
                                    value,
                                    this[keyName][arr[0]],
                                    arr
                                );
                            } else if (workingField.type === "array") {
                                if (!Array.isArray(this[keyName])) this[keyName] = [];
                                if (typeof workingField.elements !== "object") throw new PrettyError("Something went terribly wrong processing an array");
                                this[keyName] = Object.values(<never>HASHValueToDocumentField(
                                    { type: "object", properties: workingField.elements },
                                    value,
                                    this[keyName],
                                    arr
                                ));
                            }
                            continue;
                        }
                    }

                    if (typeof schema.data[key] !== "undefined") {
                        this[key] = HASHValueToDocumentField(schema.data[key], value);
                        continue;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (schema.references[key] === null) {
                        if (!this.#autoFetch) {
                            this[key] = new ReferenceArray(value.split(" | "));
                            continue;
                        }
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
                : value.type === "tuple" || value.type === "array"
                    ? []
                    : value.type === "vector"
                        ? value.vecType === "FLOAT64"
                            ? new Float64Array()
                            : new Float32Array()
                        : undefined);
        }

        for (let i = 0, keys = Object.keys(this.#schema.references), len = keys.length; i < len; i++) {
            const key = keys[i];
            this[key] = new ReferenceArray();
        }
    }

    public toString(): string {
        if (this.#validate) this.#validateSchemaData(this.#schema.data, this);

        const arr = [
            "$id",
            this.$id
        ];

        if (this.$suffix) arr.push("$suffix", this.$suffix);

        for (let i = 0, entries = Object.entries(this), length = entries.length; i < length; i++) {
            const [key, val] = entries[i];
            if (key.startsWith("$") || key.startsWith("_")) continue;

            const schema = this.#schema.data[key];

            if (typeof schema !== "undefined") {
                //@ts-expect-error This can return a Buffer but it has to be like this until i find out a better way to pass in buffers
                arr.push(...documentFieldToHASHValue(schema, val, key));
                continue;
            }

            if (typeof this.#schema.references[key] === "undefined" && typeof this.#schema.relations[key] === "undefined") arr.push(val);
        }

        if (!this.#autoFetch) {
            if (this.#validate) this.#validateSchemaReferences(this.#schema.references, this);
            for (let i = 0, keys = Object.keys(this.#schema.references), len = keys.length; i < len; i++) {
                const key = keys[i];

                if (this[key].length > 0) arr.push(key, this[key].join(" | "));
            }
        }

        return arr.join(" ");
    }

    public get $globalPrefix(): string {
        return this.#global_prefix;
    }

    public get $prefix(): string {
        return this.#prefix;
    }

    public get $modelName(): string {
        return this.#model_name;
    }

    public get $suffix(): string | undefined {
        return this.#suffix;
    }

    public get $id(): string {
        return this.#id;
    }

    public get $recordId(): string {
        return this.#record_id;
    }
}