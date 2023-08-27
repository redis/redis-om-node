import { PrettyError } from "@infinite-fansub/logger";
import { inspect } from "node:util";
import { Color } from "colours.js";

import { methods, schemaData } from "./utils/symbols";

import type {
    MethodsDefinition,
    SchemaDefinition,
    SchemaOptions,
    ParseSchema,
    BaseField
} from "./typings";

export class Schema<S extends SchemaDefinition, M extends MethodsDefinition<S> = MethodsDefinition<S>, P extends ParseSchema<S> = ParseSchema<S>> {

    /** @internal */
    public [methods]: M;

    /** @internal */
    public [schemaData]: P;

    public constructor(rawData: S, methodsData?: M, public readonly options: SchemaOptions = {}) {
        this[schemaData] = this.#parse(rawData);
        this[methods] = methodsData ?? <M>{};
        this.options.dataStructure = options.dataStructure ?? "JSON";

    }

    #parse<T extends SchemaDefinition>(schema: T): P {
        const data: Record<string, unknown> = {};
        const references: Record<string, unknown> = {};

        for (let i = 0, entries = Object.entries(schema), len = entries.length; i < len; i++) {
            let [key, value] = entries[i];
            if (key.startsWith("$")) throw new PrettyError("Keys cannot start with '$'", {
                reference: "redis-om"
            });

            if (typeof value === "string") {
                //@ts-expect-error Some people do not read docs
                if (value === "object") {
                    throw new PrettyError("Type 'object' needs to use its object definition", {
                        reference: "redis-om",
                        lines: [
                            {
                                error: inspect({ [key]: value }, { colors: true }),
                                marker: { text: "Parsing:" }
                            },
                            {
                                error: inspect({
                                    [key]: {
                                        type: "object"
                                    }
                                }, { colors: true, compact: false }),
                                marker: { text: "Fix:", color: Color.fromHex("#00FF00"), newLine: true }
                            },
                            {
                                error: inspect({
                                    artist: {
                                        type: "object",
                                        properties: {
                                            name: "string",
                                            age: "number",
                                            hobbies: "array"
                                        }
                                    }
                                }, { colors: true }),
                                marker: { text: "Information:", color: Color.fromHex("#009dff"), spacedBefore: true, newLine: true }
                            }
                        ]
                    });
                    //@ts-expect-error Some people do not read docs
                } else if (value === "reference") {
                    throw new PrettyError("Type 'reference' needs to use its object definition", {
                        reference: "redis-om",
                        lines: [
                            {
                                error: inspect({ [key]: value }, { colors: true }),
                                marker: { text: "Parsing:" }
                            },
                            {
                                error: inspect({
                                    [key]: {
                                        type: "reference",
                                        schema: "`SchemaInstance`"
                                    }
                                }, { colors: true, compact: false }),
                                marker: { text: "Fix:", color: Color.fromHex("#00FF00"), newLine: true }
                            }
                        ]
                    });
                    //@ts-expect-error Some people do not read docs
                } else if (value === "tuple") {
                    throw new PrettyError("Type 'tuple' needs to use its object definition");
                } else if (value === "array") {
                    value = { type: value, elements: "string", default: undefined, optional: false, sortable: false, index: true };
                } else if (value === "vector") {
                    value = {
                        type: value,
                        algorithm: "FLAT",
                        vecType: "FLOAT32",
                        dim: 128,
                        distance: "L2",
                        default: undefined,
                        optional: false,
                        sortable: false,
                        index: true
                    };
                } else {
                    value = { type: value, default: undefined, optional: false, sortable: false, index: true };
                }

                data[key] = value;
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!value.type) throw new PrettyError("Type not defined", {
                reference: "redis-om",
                lines: [
                    {
                        error: inspect({ [key]: value }, { colors: true }),
                        marker: { text: "Parsing:" }
                    }
                ]
            });

            if (value.type === "array") {
                if (typeof value.elements === "undefined") value.elements = "string";
                if (typeof value.separator === "undefined") value.separator = ",";
                if (typeof value.elements === "object") {
                    value.elements = <never>this.#parse(value.elements).data;
                    if (!this.options.noLogs) console.log(`'${key}' will not be indexed because array of objects is not yet supported on RediSearch`);
                }
                value = this.#fill(value);
            } else if (value.type === "date") {
                if (value.default instanceof Date) value.default = value.default.getTime();
                if (typeof value.default === "string" || typeof value.default === "number") value.default = new Date(value.default).getTime();
                value = this.#fill(value);
            } else if (value.type === "object") {
                if (typeof value.default === "undefined") value.default = undefined;
                if (typeof value.optional === "undefined") value.optional = false;
                if (!value.properties) value.properties = undefined;
                else value.properties = <never>this.#parse(value.properties).data;
            } else if (value.type === "tuple") {
                if (typeof value.elements === "undefined") throw new PrettyError("Tuple needs to have at least 1 element", {
                    reference: "redis-om"
                });
                for (let j = 0, le = value.elements.length; j < le; j++) {
                    //@ts-expect-error No comment
                    value.elements[j] = this.#parse({ [j]: typeof value.elements[j] === "string" ? value.elements[j] : { type: "object", properties: value.elements[j] } }).data[j];
                }
                value = this.#fill(value);
            } else if (value.type === "reference") {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
                if (!value.schema) throw new PrettyError("Type 'reference' lacks a schema", {
                    reference: "redis-om",
                    lines: [
                        {
                            error: inspect({ [key]: value }, { colors: true }),
                            marker: { text: "Parsing:" }
                        },
                        {
                            error: inspect({
                                [key]: {
                                    type: "reference",
                                    schema: "`SchemaInstance`"
                                }
                            }, { colors: true, compact: false }),
                            marker: { text: "Fix:", color: Color.fromHex("#00FF00"), newLine: true }
                        }
                    ]
                });
                references[key] = null;
                continue;
            } else if (value.type === "vector") {
                if (typeof value.algorithm === "undefined") {
                    throw new PrettyError("'algorithm' is missing on the vector definition", {
                        reference: "redis-om"
                    });
                }
                if (typeof value.distance === "undefined") {
                    throw new PrettyError("'distance' is missing on the vector definition", {
                        reference: "redis-om"
                    });
                }
                if (typeof value.vecType === "undefined") {
                    throw new PrettyError("'vecType' is missing on the vector definition", {
                        reference: "redis-om"
                    });
                }
                if (typeof value.dim === "undefined") {
                    throw new PrettyError("'dim' is missing on the vector definition", {
                        reference: "redis-om"
                    });
                }

                if (typeof value.cap === "undefined") value.cap = undefined;
                if (value.algorithm === "FLAT") {
                    if (typeof value.size === "undefined") value.size = undefined;
                } else {
                    if (typeof value.m === "undefined") value.m = undefined;
                    if (typeof value.construction === "undefined") value.construction = undefined;
                    if (typeof value.runtime === "undefined") value.runtime = undefined;
                    if (typeof value.epsilon === "undefined") value.epsilon = undefined;
                }
                value = this.#fill(value);
            } else {
                value = this.#fill(value);
            }

            data[key] = value;
        }
        return <never>{ data, references };
    }

    #fill(value: BaseField): any {
        if (typeof value.default === "undefined") value.default = undefined;
        if (typeof value.optional === "undefined") value.optional = false;
        if (typeof value.sortable === "undefined") value.sortable = false;
        if (typeof value.index === "undefined") value.index = true;
        return value;
    }
}