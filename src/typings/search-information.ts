import type { ModelOptions } from "./model-options";

export interface SearchInformation extends ModelOptions {
    modelName: string;
    searchIndex: string;
}