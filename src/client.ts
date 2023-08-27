import { PrettyError } from "@infinite-fansub/logger";
import { createClient } from "redis";

import { Schema } from "./schema";
import { Model } from "./model";

import type {
    ExtractSchemaMethods,
    MethodsDefinition,
    SchemaDefinition,
    SchemaOptions,
    WithModules,
    NodeRedisClient,
    ExtractName,
    URLObject,
    Module,
    ClientOptions
} from "./typings";

export class Client<SD extends SchemaDefinition = {}, MD extends MethodsDefinition<SD> = {}> {
    #client!: NodeRedisClient;
    #models: Map<string, Model<any>> = new Map();
    #open: boolean = false;
    #prefix: string = "Redis-OM";

    /** Please only access this from within a module or if you know what you are doing */
    public _options: ClientOptions<SD, MD>;

    public constructor(options?: ClientOptions<SD, MD>) {
        this._options = options ?? <ClientOptions<SD, MD>>{};

        if (this._options.modules) {
            for (let i = 0, len = this._options.modules.length; i < len; i++) {
                const module = this._options.modules[i];
                //@ts-expect-error shenanigans
                this[module.name] = new module.ctor(this);
            }
        }
    }

    public async connect(url: string | URLObject = this._options.url ?? "redis://localhost:6379"): Promise<Client> {
        if (this.#open) return this;

        if (typeof url === "object") {

            const { username, password, entrypoint, port } = url;
            url = `${username}:${password}@${(/:\d$/).exec(entrypoint) ? entrypoint : `${entrypoint}:${port}`}`;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        this.#client ??= createClient({ url });
        try {
            await this.#client.connect();
            this.#open = true;
        } catch (e) {
            Promise.reject(e);
        }

        return this;
    }

    public async disconnect(): Promise<Client> {
        await this.#client.quit();

        this.#open = false;
        return this;
    }

    public async forceDisconnect(): Promise<Client> {
        await this.#client.disconnect();

        this.#open = false;
        return this;
    }

    public schema<T extends SchemaDefinition, M extends MethodsDefinition<(T & SD)>>(definition: T, methods?: M, options?: SchemaOptions): Schema<
        { [K in keyof (T & SD)]: (T & SD)[K] },
        { [K in keyof (M & MD)]: (M & MD)[K] }
    > {
        return <never>new Schema({
            ...this._options.inject?.schema?.definition,
            ...definition
        }, <never>{
            ...this._options.inject?.schema?.methods,
            ...methods
        }, {
            ...this._options.inject?.schema?.options,
            ...options
        });
    }

    public model<T extends Schema<any>>(name: string, schema?: T): Model<T> & ExtractSchemaMethods<T> {
        let model = this.#models.get(name);
        if (model) return <never>model;

        if (!schema) throw new PrettyError("You have to pass a schema if it doesn't exist", {
            reference: "redis-om"
        });

        model = new Model(this.#client, this.#prefix, "V1", name, schema);
        this.#models.set(name, model);
        return <never>model;
    }

    public withModules<T extends Array<Module>>(...modules: ExtractName<T>): this & WithModules<T> {
        for (let i = 0, len = modules.length; i < len; i++) {
            const module = modules[i];
            //@ts-expect-error shenanigans
            this[module.name] = new module.ctor(this);
        }

        return <never>this;
    }

    public get raw(): NodeRedisClient {
        return this.#client;
    }

    public get isOpen(): boolean {
        return this.#open;
    }

    public set redisClient(client: NodeRedisClient) {
        if (!this.#open) {
            this.#client = client;
        }
    }

    public set globalPrefix(str: string) {
        this.#prefix = str;
    }
}

export const client = new Client();