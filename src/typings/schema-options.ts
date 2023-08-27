export interface SchemaOptions {
    dataStructure?: "HASH" | "JSON" | undefined;
    skipDocumentValidation?: boolean | undefined;
    noLogs?: boolean | undefined;
    prefix?: string | undefined;
    suffix?: string | (() => string) | undefined;
}