import type { Client } from "../client";

export interface Module {
    name: string;
    ctor: new (client: Client) => unknown;
}

export type ExtractName<T> = Extract<T, string> | ([T] extends [[]] ? [] : { [K in keyof T]: ExtractName<T[K]> });

export type WithModules<M extends Array<Module>, F = true> = F extends true ? { [N in M[number]["name"]]: CTORType<M[number]["ctor"]> } : never;

type CTORType<T> = T extends new (...args: Array<any>) => infer U ? U : never;