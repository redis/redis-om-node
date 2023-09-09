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