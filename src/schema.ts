import { PrettyError } from "@infinite-fansub/logger";
import { inspect } from "node:util";
import { Color } from "colours.js";

import { methods, schemaData } from "./utils/symbols";

import type {
    ExtractSchemaDefinition,
    MethodsDefinition,
    SchemaDefinition,
    SchemaOptions,
    ParseSchema,
    NumberField,
    StringField,
    BaseField,
    FieldType,
    ParsedSchemaDefinition
} from "./typings";

export class Schema<S extends SchemaDefinition, M extends MethodsDefinition<S> = MethodsDefinition<S>, P extends ParseSchema<S> = ParseSchema<S>> {

    /** @internal */
    public [methods]: M;

    /**
     * @internal
     * The real type is: {@link ParsedSchemaDefinition}
    */
    public [schemaData]: P;

    public constructor(rawData: S, methodsData?: M, public readonly options: SchemaOptions = {}) {
        this[schemaData] = <never>this.#parse(rawData);
        this[methods] = methodsData ?? <M>{};
        this.options.dataStructure = options.dataStructure ?? "JSON";

    }

    /** This only extends the definition, it does not extend methods nor options */
    public extends<T extends Schema<any>, SD = ExtractSchemaDefinition<T>>(schema: T): Schema<Omit<SD, keyof S> & S> {
        this[schemaData] = <never>{
            data: {
                ...schema[schemaData].data,
                ...this[schemaData].data
            },
            references: {
                ...schema[schemaData].references,
                ...this[schemaData].references
            }
        };
        return <never>this;
    }

    #parse(schema: SchemaDefinition): ParsedSchemaDefinition {
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
                    value = { type: value, elements: "string", default: undefined, optional: false, sortable: false, index: false, separator: "|" };
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
                        index: false
                    };
                } else {
                    value = { type: value, default: undefined, optional: false, sortable: false, index: false };
                    if ((<FieldType>value).type === "string" || (<FieldType>value).type === "number") (<StringField | NumberField>value).literal = undefined;
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
                if (typeof value.separator === "undefined") value.separator = "|";
                if (typeof value.elements === "object") {
                    value.elements = <never>this.#parse(value.elements).data;
                }
                value = this.#fill(value);
            } else if (value.type === "date") {
                if (value.default instanceof Date) value.default = value.default.getTime();
                if (typeof value.default === "string" || typeof value.default === "number") value.default = new Date(value.default).getTime();
                value = this.#fill(value);
            } else if (value.type === "object") {
                if (typeof value.default === "undefined") value.default = undefined;
                if (typeof value.optional === "undefined") value.optional = false;
                if (typeof value.properties === "undefined") value.properties = <never>null;
                else if (value.properties instanceof Schema) value.properties = <never>value.properties[schemaData].data;
                else value.properties = <never>this.#parse(value.properties).data;
            } else if (value.type === "tuple") {
                if (typeof value.elements === "undefined") throw new PrettyError("Tuple needs to have at least 1 element", {
                    reference: "redis-om"
                });
                for (let j = 0, le = value.elements.length; j < le; j++) {
                    value.elements[j] = <never>this.#parse({ [j]: value.elements[j] }).data[j];
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
            } else if (value.type === "string" || value.type === "number" || value.type === "bigint") {
                if (typeof value.literal === "undefined") value.literal = undefined;
                else if (!Array.isArray(value.literal)) value.literal = [<never>value.literal];
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
        if (typeof value.index === "undefined") value.index = false;
        return value;
    }
}