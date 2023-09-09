import { PrettyError } from "@infinite-fansub/logger";
import { createHash } from "node:crypto";

import { JSONDocument, HASHDocument } from "./document";
import { methods, schemaData } from "./utils/symbols";
import { parseSchemaToSearchIndex } from "./utils";
import { Search } from "./search/search";

import type { Schema } from "./schema";
import type {
    ExtractParsedSchemaDefinition,
    ReturnDocument,
    NodeRedisClient,
    ModelOptions,
    ParsedMap,
    MapSchema,
    Document
} from "./typings";

export class Model<S extends Schema<any>> {
    readonly #schema: S;
    readonly #client: NodeRedisClient;
    readonly #searchIndexName: string;
    readonly #searchIndexHashName: string;
    readonly #searchIndexBase: Array<string>;
    readonly #searchIndex: Array<string>;
    readonly #searchIndexHash: string;
    readonly #parsedSchema: ParsedMap;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    readonly #docType: typeof JSONDocument | typeof HASHDocument;

    #options: ModelOptions;

    public constructor(client: NodeRedisClient, globalPrefix: string, ver: string, private readonly name: string, data: S) {
        this.#client = client;
        this.#schema = data;
        this.#options = {
            ...this.#schema.options,
            skipDocumentValidation: !this.#schema.options.skipDocumentValidation,
            globalPrefix,
            prefix: this.#schema.options.prefix ?? ver,
            version: ver
        };

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { map, index } = parseSchemaToSearchIndex(<never>this.#schema[schemaData].data, this.#options.dataStructure!);
        this.#parsedSchema = map;
        this.#searchIndexName = `${globalPrefix}:${this.#options.prefix}:${this.name}:index`;
        this.#searchIndexHashName = `${globalPrefix}:${this.#options.prefix}:${this.name}:index:hash`;
        this.#searchIndexBase = [
            "FT.CREATE",
            this.#searchIndexName,
            "ON",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data.options.dataStructure!,
            "PREFIX",
            "1",
            `${globalPrefix}:${this.#options.prefix}:${this.name}:`
        ];

        if (this.#options.language) this.#searchIndexBase.push("LANGUAGE", this.#options.language);
        if (this.#options.stopWords) {
            this.#searchIndexBase.push("STOPWORDS", this.#options.stopWords.length.toString());
            if (this.#options.stopWords.length > 0) this.#searchIndexBase.push(...this.#options.stopWords);
        }

        this.#searchIndexBase.push("SCHEMA");

        this.#searchIndex = index;
        this.#searchIndexHash = createHash("sha1").update(JSON.stringify({
            name,
            structure: this.#options.dataStructure,
            definition: this.#schema[schemaData].data
        })).digest("base64");

        this.#defineMethods();

        if (data.options.dataStructure === "HASH") this.#docType = HASHDocument;
        else this.#docType = JSONDocument;
    }

    public async get<F extends boolean = false>(id: string | number, autoFetch?: F): Promise<ReturnDocument<S, F> | undefined> {
        if (typeof id === "undefined") throw new PrettyError("A valid id was not given", {
            reference: "redis-om"
        });
        if (id.toString().split(":").length === 1) {
            const suffix = this.#options.suffix;

            if (typeof suffix === "function") {
                throw new PrettyError("Due to the use of dynamic suffixes you gave to pass in a full id", {
                    reference: "redis-om"
                });
            }
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            id = `${this.#options.globalPrefix}:${this.#options.prefix}:${this.name}:${suffix ? `${suffix}:` : ""}${id}`;
        }

        const data = this.#options.dataStructure === "JSON" ? await this.#client.json.get(id.toString()) : await this.#client.hGetAll(id.toString());

        if (data === null) return void 0;
        if (autoFetch) {
            for (let i = 0, keys = Object.keys(this.#schema[schemaData].references), len = keys.length; i < len; i++) {
                const key = keys[i];
                //@ts-expect-error node-redis types decided to die
                const val = this.#options.dataStructure === "JSON" ? data[key] : data[key].split(" | ");
                const temp = [];

                for (let j = 0, le = val.length; j < le; j++) {
                    temp.push(this.get(<string>val[j]));
                }

                //@ts-expect-error node-redis types decided to die
                data[key] = await Promise.all(temp);
            }
        }

        return <never>new this.#docType(<never>this.#schema[schemaData], {
            globalPrefix: this.#options.globalPrefix,
            prefix: this.#options.prefix,
            name: this.name
        }, <never>data, true, this.#options.skipDocumentValidation, autoFetch);
    }

    public create(id?: string | number): ReturnDocument<S>;
    public create(data?: { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true>): ReturnDocument<S>;
    public create(idOrData?: string | number | { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true>): ReturnDocument<S> {
        if (typeof idOrData === "object") {
            return <never>new this.#docType(<never>this.#schema[schemaData], {
                globalPrefix: this.#options.globalPrefix,
                prefix: this.#options.prefix,
                name: this.name,
                suffix: this.#options.suffix
            }, idOrData, false, this.#options.skipDocumentValidation, false);
        }

        return <never>new this.#docType(<never>this.#schema[schemaData], {
            globalPrefix: this.#options.globalPrefix,
            prefix: this.#options.prefix,
            name: this.name,
            suffix: this.#options.suffix,
            id: idOrData?.toString()
        }, void 0, false, this.#options.skipDocumentValidation, false);
    }

    public async save(doc: Document): Promise<void> {
        if (typeof doc === "undefined") throw new PrettyError("No document was passed to be save", {
            reference: "redis-om"
        });

        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        if (this.#options.dataStructure === "HASH") await this.#client.sendCommand(["HSET", doc.$record_id, ...doc.toString()]);
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        else await this.#client.sendCommand(["JSON.SET", doc.$record_id, "$", <string>doc.toString()]);
    }

    public async delete(...docs: Array<string | number | Document>): Promise<void> {
        if (!docs.length) throw new PrettyError("No documents were given to delete", {
            reference: "redis-om"
        });
        await this.#client.del(this.#stringOrDocToString(docs));
    }

    public async exists(...docs: Array<string | number | Document>): Promise<number> {
        if (!docs.length) throw new PrettyError("No documents were given to check", {
            reference: "redis-om"
        });
        return await this.#client.exists(this.#stringOrDocToString(docs));
    }

    public async expire(docs: Array<string | number | Document>, seconds: number | Date, mode?: "NX" | "XX" | "GT" | "LT"): Promise<void> {
        if (!docs.length) throw new PrettyError("No documents were given to expire", {
            reference: "redis-om"
        });
        docs = this.#stringOrDocToString(docs);

        if (seconds instanceof Date) seconds = Math.round((seconds.getTime() - Date.now()) / 1000);

        const temp = [];

        for (let i = 0, len = docs.length; i < len; i++) {
            const doc = <string>docs[i];
            temp.push(this.#client.expire(doc, seconds, mode));
        }

        await Promise.all(temp);
    }

    public async createAndSave(data: { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true>): Promise<void> {
        const doc = new this.#docType(<never>this.#schema[schemaData], {
            globalPrefix: this.#options.globalPrefix,
            prefix: this.#options.prefix,
            name: this.name,
            suffix: this.#options.suffix
        }, data, false, this.#options.skipDocumentValidation, false);
        await this.save(doc);
    }

    public search(): Search<ExtractParsedSchemaDefinition<S>> {
        // eslint-disable-next-line max-len
        return new Search<ExtractParsedSchemaDefinition<S>>(this.#client, <never>this.#schema[schemaData], this.#parsedSchema, {
            ...this.#options,
            modelName: this.name,
            searchIndex: this.#searchIndexName
        });
    }

    public async createIndex(): Promise<void> {
        const currentIndexHash = await this.#client.get(this.#searchIndexHashName);
        if (currentIndexHash === this.#searchIndexHash) return;

        if (this.#searchIndex.length === 0) {
            if (!this.#options.noLogs) console.log("Nothing to index... Skipping");
            return;
        }

        await this.deleteIndex();

        await Promise.all([
            this.#client.set(this.#searchIndexHashName, this.#searchIndexHash),
            this.#client.sendCommand([...this.#searchIndexBase, ...this.#searchIndex])
        ]);
    }

    public async deleteIndex(): Promise<void> {
        try {
            await Promise.all([
                this.#client.unlink(this.#searchIndexHashName),
                this.#client.ft.dropIndex(this.#searchIndexName)
            ]);
        } catch (e) {
            if (e instanceof Error && e.message === "Unknown Index name") {
                Promise.resolve();
            } else throw e;
        }
    }

    public async rawSearch(...args: Array<string>): Promise<ReturnType<NodeRedisClient["ft"]["search"]>> {
        return await this.#client.ft.search(this.#searchIndexName, args.join(" "));
    }

    #stringOrDocToString(stringOrNumOrDoc: Array<string | number | Document>): Array<string> {
        const temp = [];

        for (let i = 0, len = stringOrNumOrDoc.length; i < len; i++) {
            const el = stringOrNumOrDoc[i];
            let id = "";

            if (el instanceof JSONDocument || el instanceof HASHDocument) {
                id = el.$record_id;
            } else if (el.toString().split(":").length === 1) {
                const suffix = this.#options.suffix;

                if (typeof suffix === "function") {
                    throw new PrettyError("Due to the use of dynamic suffixes you gave to pass in a full id", {
                        reference: "redis-om"
                    });
                }
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                id = `${this.#options.globalPrefix}:${this.#options.prefix}:${this.name}:${suffix ? `${suffix}:` : ""}${el.toString()}`;
            }

            temp.push(id);
        }

        return temp;
    }

    #defineMethods(): void {
        for (let i = 0, entries = Object.entries(this.#schema[methods]), len = entries.length; i < len; i++) {
            const [key, value] = entries[i];
            //@ts-expect-error shenanigans
            this[key] = value;
        }
    }

    public get options(): ModelOptions {
        return this.#options;
    }

    public set options(options: Partial<ModelOptions>) {
        this.#options = { ...this.#options, ...options };
    }
}