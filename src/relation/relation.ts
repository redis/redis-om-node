import { PrettyError } from "@infinite-fansub/logger";
import { randomUUID } from "crypto";

import { JSONDocument, HASHDocument } from "../document";

import type {
    ModelInformation,
    NodeRedisClient,
    ParseSchemaData,
    MapSchemaData,
    ParseSchema,
    Document
} from "../typings";

export class Relation<T extends ParseSchema<any>, F extends ParseSchema<any>["relations"][number]["meta"] = {}> {
    readonly #client: NodeRedisClient;
    readonly #information: ModelInformation;
    readonly #in: string;

    #out?: string;
    #field?: string;
    #meta?: T;

    public constructor(
        client: NodeRedisClient,
        id: string,
        information: ModelInformation
    ) {
        this.#client = client;
        this.#information = information;
        this.#in = id;
    }

    public to(id: string | number | Document): this {
        if (id instanceof JSONDocument || id instanceof HASHDocument) id = id.$recordId;
        else if (id.toString().split(":").length === 1) {
            const suffix = this.#information.suffix;

            if (typeof suffix === "function") {
                throw new PrettyError("Due to the use of dynamic suffixes you gave to pass in a full id", {
                    reference: "redis-om"
                });
            }

            id = `${this.#information.globalPrefix}:${this.#information.prefix}:${this.#information.modelName}:${suffix ? `${suffix}:` : ""}${id}`;
        }

        this.#out = id.toString();

        return this;
    }

    public as<K extends keyof T["relations"]>(field: K): Relation<T, T["relations"][K]["meta"]> {
        this.#field = <string>field;
        return <never>this;
    }

    public with(meta: [keyof F] extends [never] ? never : MapSchemaData<Omit<F, "in" | "out"> & ParseSchemaData<any>>): this {
        this.#meta = <never>meta;
        return this;
    }

    public async exec(): Promise<void> {
        if (typeof this.#out === "undefined" || typeof this.#field === "undefined") throw new PrettyError("Relation query was not properly formatted", {
            reference: "redis-om"
        });

        const arr = ["FCALL"];
        const omitId = `${this.#information.globalPrefix}:${this.#information.prefix}:${this.#information.modelName}-relation-${this.#field}:${randomUUID()}`;

        if (this.#information.dataStructure === "JSON") {
            arr.push("JSONCR");
        } else {
            arr.push("HCR");
        }

        arr.push(
            "3",
            this.#in,
            this.#out,
            omitId,
            this.#field
        );

        if (typeof this.#meta !== "undefined") arr.push(JSON.stringify(this.#meta));

        await this.#client.sendCommand(arr);
    }
}