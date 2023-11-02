import type { createClient } from "redis";

import type { SchemaDefinition } from "./schema-and-fields-definition";
import type { MethodsDefinition } from "./methods-definition";

export type NodeRedisClient = ReturnType<typeof createClient>;

export interface ClientOptions<T extends SchemaDefinition, M extends MethodsDefinition<T>> {
    url?: string | URLObject;
    globalPrefix?: string;
    enableInjections?: boolean;
    base?: {
        schema?: {
            definition?: T,
            methods?: M,
            options?: SchemaOptions
        }
    };
}

export interface SchemaOptions {
    dataStructure?: "HASH" | "JSON" | undefined;

    /** For word Stemming */
    language?: Language;
    stopWords?: Array<string>;
    skipDocumentValidation?: boolean | undefined;
    noLogs?: boolean | undefined;
    prefix?: string | undefined;
    suffix?: string | (() => string) | undefined;
}

export interface ModelOptions extends Required<Pick<SchemaOptions, "skipDocumentValidation" | "suffix">> {
    injectScripts: boolean;
    globalPrefix: string;
    prefix: string;
}

/** internal */
export interface ModelInformation extends ModelOptions, Required<Pick<SchemaOptions, "dataStructure">> {
    modelName: string;
}

/** internal */
export interface SearchInformation extends ModelInformation {
    searchIndex: string;
}

export interface URLObject {
    username: string;
    password: string;
    entrypoint: string;
    port?: string;
}

export type Language = "arabic"
    | "armenian"
    | "danish"
    | "dutch"
    | "english"
    | "finnish"
    | "french"
    | "german"
    | "hungarian"
    | "italian"
    | "norwegian"
    | "portuguese"
    | "romanian"
    | "russian"
    | "serbian"
    | "spanish"
    | "swedish"
    | "tamil"
    | "turkish"
    | "yiddish"
    | "chinese";