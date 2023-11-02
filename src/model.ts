import { PrettyError } from "@infinite-fansub/logger";
import { createHash } from "node:crypto";

import { parseRelationsToSearchIndex, parseSchemaToSearchIndex } from "./utils";
import { JSONDocument, HASHDocument } from "./document";
import { methods, schemaData } from "./utils/symbols";
import { Relation } from "./relation/relation";
import { Search } from "./search/search";

import type { Schema } from "./schema";
import type {
    ExtractParsedSchemaDefinition,
    ParsedRelationsToSearch,
    SchemaDefinition,
    NodeRedisClient,
    ReturnDocument,
    ModelOptions,
    ParseSchema,
    ParsedMap,
    MapSchema,
    Document
} from "./typings";

export class Model<S extends Schema<any>> {
    readonly #schema: S;
    readonly #client: NodeRedisClient;
    readonly #parsedSchema: ParsedMap;
    readonly #docType: typeof JSONDocument | typeof HASHDocument;
    readonly #relationsToIndex: ParsedRelationsToSearch;
    readonly #searchIndex: {
        name: string,
        hash: string,
        query: Array<string>
    } = <never>{};

    #options: ModelOptions;

    public constructor(
        client: NodeRedisClient,
        globalPrefix: string,
        prefix: string,
        private readonly name: string,
        injectScripts: boolean,
        data: S
    ) {
        this.#client = client;
        this.#schema = data;
        this.#options = {
            injectScripts,
            skipDocumentValidation: !this.#schema.options.skipDocumentValidation,
            globalPrefix,
            prefix: this.#schema.options.prefix ?? prefix,
            suffix: this.#schema.options.suffix
        };

        const { map, index } = parseSchemaToSearchIndex(<never>this.#schema[schemaData].data, this.#schema.options.dataStructure);
        this.#relationsToIndex = parseRelationsToSearchIndex(<never>this.#schema[schemaData].relations, this.#schema.options.dataStructure, `${globalPrefix}:${this.#options.prefix}:${this.name}`);
        this.#parsedSchema = map;
        this.#searchIndex.name = `${globalPrefix}:${this.#options.prefix}:${this.name}:index`;
        this.#searchIndex.query = [
            "FT.CREATE",
            this.#searchIndex.name,
            "ON",
            data.options.dataStructure,
            "PREFIX",
            "1",
            `${globalPrefix}:${this.#options.prefix}:${this.name}:`
        ];

        if (this.#schema.options.language) this.#searchIndex.query.push("LANGUAGE", this.#schema.options.language);
        if (this.#schema.options.stopWords) {
            this.#searchIndex.query.push("STOPWORDS", this.#schema.options.stopWords.length.toString());
            if (this.#schema.options.stopWords.length > 0) this.#searchIndex.query.push(...this.#schema.options.stopWords);
        }

        this.#searchIndex.query.push("SCHEMA");
        this.#searchIndex.query.push(...index);

        this.#searchIndex.hash = createHash("sha1").update(JSON.stringify({
            name,
            structure: this.#schema.options.dataStructure,
            definition: this.#schema[schemaData].data
        })).digest("base64");

        this.#defineMethods();

        if (data.options.dataStructure === "HASH") this.#docType = HASHDocument;
        else this.#docType = JSONDocument;
    }

    public async get<
        FREF extends boolean,
        FREL extends boolean,
        K extends keyof T,
        T extends ExtractParsedSchemaDefinition<S>["relations"] = ExtractParsedSchemaDefinition<S>["relations"],
        MOR extends boolean = false
    >(
        id: string | number,
        options?: {
            withReferences?: FREF,
            withRelations?: FREL,

            /** This only works if you are using `relationsConstrain` */
            returnMetadataOverRelation?: MOR,
            relationsConstrain?: Record<K, (search: Search<ParseSchema<(T[K]["meta"] & {}) extends SchemaDefinition ? (T[K]["meta"] & {}) : any>>) => Search<ParseSchema<any>>>
        }
    ): Promise<ReturnDocument<S, FREF, FREL, MOR> | undefined> {
        if (typeof id === "undefined") throw new PrettyError("A valid id was not given", {
            reference: "redis-om"
        });

        id = this.formatId(id.toString());

        const data = this.#schema.options.dataStructure === "JSON" ? await this.#client.json.get(id.toString()) : await this.#client.hGetAll(id.toString());

        if (data === null || Object.keys(data).length === 0) return undefined;
        if (options?.withReferences) {
            for (let i = 0, keys = Object.keys(this.#schema[schemaData].references), len = keys.length; i < len; i++) {
                const key = keys[i];
                //@ts-expect-error node-redis types decided to die
                const val = this.#schema.options.dataStructure === "JSON" ? data[key] : data[key].split(" | ");
                const temp = [];

                for (let j = 0, le = val.length; j < le; j++) {
                    temp.push(this.get(<string>val[j]));
                }

                //@ts-expect-error node-redis types decided to die
                data[key] = await Promise.all(temp);
            }
        }

        if (options?.withRelations) {
            if (!this.#options.injectScripts) throw new PrettyError("Cannot get relations without the required scripts", { reference: "redis-om" });
            if (typeof options.relationsConstrain !== "undefined") {
                const tempConstrains: Record<string, [string, string]> = {};

                for (let i = 0, entries = Object.entries(options.relationsConstrain), length = entries.length; i < length; i++) {
                    const [key, value] = <[string, (s: Search<ParseSchema<any>>) => Search<ParseSchema<any>>]>entries[i];

                    tempConstrains[key] = [
                        `${this.#relationsToIndex[key].key}:index`,
                        value(new Search(this.#client, {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            data: <never>this.#schema[schemaData].relations[key].meta!,
                            references: {},
                            relations: {}
                        }, this.#docType, this.#relationsToIndex[key].data.map, {
                            ...this.#options,
                            modelName: this.name,
                            suffix: this.#options.suffix,
                            searchIndex: `${this.#relationsToIndex[key].key}:index`,
                            dataStructure: this.#schema.options.dataStructure
                        })).rawQuery
                    ];
                }

                const fetched: Record<string, Array<unknown>> = JSON.parse(await this.#client.sendCommand([
                    "FCALL",
                    this.#schema.options.dataStructure === "JSON" ? "JSONSR" : "HSR",
                    "1",
                    JSON.stringify(tempConstrains),
                    (+(options.returnMetadataOverRelation ?? false)).toString()
                ]));

                for (let i = 0, entries = Object.entries(fetched), length = entries.length; i < length; i++) {
                    const [key, value] = entries[i];

                    for (let j = 0, len = value.length; j < len; j++) {
                        value[j] = <never>new this.#docType({
                            data: <never>(options.returnMetadataOverRelation
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                ? this.#schema[schemaData].relations[key].meta!
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                : this.#schema[schemaData].relations[key].schema ?? this.#schema[schemaData].data),
                            references: {},
                            relations: {}
                        }, {
                            globalPrefix: this.#options.globalPrefix,
                            prefix: this.#options.prefix,
                            name: this.name,
                            suffix: this.#options.suffix
                        }, <never>value[j], true, this.#options.skipDocumentValidation);
                    }

                    //@ts-expect-error node-redis types decided to die
                    data[key] = value;
                }
            } else {
                for (let i = 0, entries = Object.entries(this.#schema[schemaData].relations), length = entries.length; i < length; i++) {
                    const [key, value] = entries[i];

                    const arr: Array<Record<string, unknown>> = JSON.parse(await this.#client.sendCommand([
                        "FCALL",
                        this.#schema.options.dataStructure === "JSON" ? "JSONGR" : "HGR",
                        "1",
                        id,
                        key,
                        (+(options.returnMetadataOverRelation ?? false)).toString()
                    ]));

                    for (let j = 0, len = arr.length; j < len; j++) {
                        arr[j] = new this.#docType({
                            data: <never>(options.returnMetadataOverRelation
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                ? value.meta!
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                : value.schema ?? this.#schema[schemaData].data),
                            references: {},
                            relations: {}
                        }, {
                            globalPrefix: this.#options.globalPrefix,
                            prefix: this.#options.prefix,
                            name: this.name,
                            suffix: this.#options.suffix
                        }, arr[j], true, this.#options.skipDocumentValidation);
                    }
                    //@ts-expect-error node-redis types decided to die
                    data[key] = arr;
                }
            }
        }

        return <never>new this.#docType(<never>this.#schema[schemaData], {
            globalPrefix: this.#options.globalPrefix,
            prefix: this.#options.prefix,
            name: this.name,
            suffix: this.#options.suffix
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        }, <never>data, true, this.#options.skipDocumentValidation, options?.withRelations || options?.withReferences);
    }

    public create(id?: string | number): ReturnDocument<S>;
    public create(data?: { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true, false, true>): ReturnDocument<S>;
    public create(idOrData?: string | number | { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true, false, true>): ReturnDocument<S> {
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
        }, undefined, false, this.#options.skipDocumentValidation, false);
    }

    public async save(doc: Document): Promise<void> {
        if (typeof doc === "undefined") throw new PrettyError("No document was passed to be save", {
            reference: "redis-om"
        });

        if (this.#schema.options.dataStructure === "HASH") await this.#client.sendCommand(["HSET", doc.$recordId, ...doc.toString()]);
        else await this.#client.sendCommand(["JSON.SET", doc.$recordId, "$", doc.toString()]);
    }

    public async delete(...docs: Array<string | number | Document>): Promise<void> {
        if (!docs.length) throw new PrettyError("No documents were given to delete", {
            reference: "redis-om"
        });
        await this.#client.del(this.#idsOrDocsToString(docs));
    }

    public async exists(...docs: Array<string | number | Document>): Promise<number> {
        if (!docs.length) throw new PrettyError("No documents were given to check", {
            reference: "redis-om"
        });
        return await this.#client.exists(this.#idsOrDocsToString(docs));
    }

    public async expire(docs: Array<string | number | Document>, seconds: number | Date, mode?: "NX" | "XX" | "GT" | "LT"): Promise<void> {
        if (!docs.length) throw new PrettyError("No documents were given to expire", {
            reference: "redis-om"
        });
        docs = this.#idsOrDocsToString(docs);

        if (seconds instanceof Date) seconds = Math.round((seconds.getTime() - Date.now()) / 1000);

        const temp = [];

        for (let i = 0, len = docs.length; i < len; i++) {
            const doc = <string>docs[i];
            temp.push(this.#client.expire(doc, seconds, mode));
        }

        await Promise.all(temp);
    }

    public async createAndSave(id?: string | number): Promise<void>;
    public async createAndSave(data?: { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true, false, true>): Promise<void>;
    public async createAndSave(idOrData?: string | number | { $id?: string | number } & MapSchema<ExtractParsedSchemaDefinition<S>, true, true, false, true>): Promise<void> {
        await this.save(this.create(<never>idOrData));
    }

    public search(): Search<ExtractParsedSchemaDefinition<S>> {
        return new Search<ExtractParsedSchemaDefinition<S>>(this.#client, <never>this.#schema[schemaData], this.#docType, this.#parsedSchema, {
            ...this.#options,
            modelName: this.name,
            suffix: this.#options.suffix,
            searchIndex: this.#searchIndex.name,
            dataStructure: this.#schema.options.dataStructure
        });
    }

    public relate(idOrDoc: string | number | Document): Relation<ExtractParsedSchemaDefinition<S>> {
        return new Relation(this.#client, this.#idOrDocToString(idOrDoc), {
            ...this.#options,
            modelName: this.name,
            suffix: this.#options.suffix,
            dataStructure: this.#schema.options.dataStructure
        });
    }

    public async createIndex(): Promise<void> {
        if (!this.#options.injectScripts) {
            if (!this.#schema.options.noLogs) console.warn("Cannot index relations... Skipping");
        } else {
            for (let i = 0, values = Object.values(this.#relationsToIndex), length = values.length; i < length; i++) {
                const value = values[i];

                if (await this.#client.get(`${value.key}:index:hash`) === value.hash) continue;

                try {
                    await Promise.all([
                        this.#client.unlink(`${value.key}:index:hash`),
                        this.#client.ft.dropIndex(`${value.key}:index`),
                        this.#client.set(`${value.key}:index:hash`, value.hash),
                        this.#client.sendCommand([
                            "FT.CREATE",
                            `${value.key}:index`,
                            "ON",
                            this.#schema.options.dataStructure,
                            "PREFIX",
                            "1",
                            `${value.key}:`,
                            "SCHEMA",
                            ...value.data.index
                        ])
                    ]);
                } catch (e) {
                    if (e instanceof Error && e.message === "Unknown Index name") {
                        continue;
                    } else throw e;
                }

            }
        }

        if (await this.#client.get(`${this.#searchIndex.name}:hash`) === this.#searchIndex.hash) return;

        if (this.#searchIndex.query.at(-1) === "SCHEMA") {
            if (!this.#schema.options.noLogs) console.log("Nothing to index... Skipping");
            return;
        }

        await this.deleteIndex();

        await Promise.all([
            this.#client.set(`${this.#searchIndex.name}:hash`, this.#searchIndex.hash),
            this.#client.sendCommand(this.#searchIndex.query)
        ]);
    }

    public async deleteIndex(): Promise<void> {
        try {
            await Promise.all([
                this.#client.unlink(`${this.#searchIndex.name}:hash`),
                this.#client.ft.dropIndex(this.#searchIndex.name)
            ]);
        } catch (e) {
            if (e instanceof Error && e.message === "Unknown Index name") {
                return;
            } else throw e;
        }
    }

    public async rawSearch(...args: Array<string>): Promise<ReturnType<NodeRedisClient["ft"]["search"]>> {
        return await this.#client.ft.search(this.#searchIndex.name, args.join(" "));
    }

    public sanitize(string: string): string {
        return string.replaceAll(/[,.?<>{}[\]"':;!@#$%^&()\-+=~|/\\ ]/g, "\\$&");
    }

    public formatId(id: string): string {
        if (id.split(":").length === 1) {
            const suffix = this.#options.suffix;

            if (typeof suffix === "function") {
                throw new PrettyError("Due to the use of dynamic suffixes you gave to pass in a full id", {
                    reference: "redis-om"
                });
            }

            return `${this.#options.globalPrefix}:${this.#options.prefix}:${this.name}:${suffix ? `${suffix}:` : ""}${id}`;
        }

        return id;
    }

    #idsOrDocsToString(idsOrDocs: Array<string | number | Document>): Array<string> {
        const temp = [];

        for (let i = 0, len = idsOrDocs.length; i < len; i++) {
            temp.push(this.#idOrDocToString(idsOrDocs[i]));
        }

        return temp;
    }

    #idOrDocToString(idOrDoc: string | number | Document): string {
        return idOrDoc instanceof JSONDocument || idOrDoc instanceof HASHDocument ? idOrDoc.$recordId : this.formatId(idOrDoc.toString());
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

    public set options(options: Partial<Exclude<ModelOptions, "globalPrefix">>) {
        if ("globalPrefix" in options) throw new PrettyError("To edit the global prefix please use the client options", { reference: "redis-om" });
        this.#options = { ...this.#options, ...options };
    }
}