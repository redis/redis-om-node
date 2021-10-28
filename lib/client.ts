import RedisShim from './redis/redis-shim';

import Entity from './entity/entity';
import Repository from './repository/repository';
import Schema from './schema/schema';
import RedisError from './errors';

/** @internal */
export type HashData = { [key: string ]: any };

/** @internal */
export type JsonData = { [key: string ]: any };

/** @internal */
export type SearchDataStructure = 'HASH' | 'JSON';

/** Class containing a connection to Redis. */
export default class Client {
  private shim?: RedisShim;

  /**
   * Open a connection to Redis at the provided URL.
   * @param url Defaults to *redis://localhost:6379*.
   */
  async open(url: string = 'redis://localhost:6379') {
    this.validateShimClosed();
    let shim = new RedisShim();
    await shim.open(url);
    this.shim = shim;
  }

  /**
   * Execute an arbitrary Redis command.
   * @template TResult Expect result type such as `string`, `string[]`, or whatever complex type Redis returns.
   * @param command The command to execute.
   * @returns The raw results of calling the Redis command.
   */
   async execute<TResult>(command: (string|number|boolean)[]) : Promise<TResult> {
    this.validateShimOpen();
    return await this.shim!.execute<TResult>(command.map(arg => {
      if (arg === false) return '0';
      if (arg === true) return '1';
      return arg.toString();
    }));
  }

  /**
   * Creates a repository for the given schema.
   * @template TEntity The entity type for this {@lin Schema} and {@link Repository}.
   * @param schema The schema.
   * @returns A repository for the provided schema. 
   */
  fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>) : Repository<TEntity> {
    this.validateShimOpen();
    return new Repository(schema, this);
  }

  /**
   * Close the connection to Redis.
   */
   async close() {
    this.validateShimOpen();
    await this.shim!.close();
    this.shim = undefined;
  }

  /** @internal */
  async createIndex(indexName: string, dataStructure: SearchDataStructure, prefix: string, schema: string[]) {
    this.validateShimOpen();
    await this.shim!.execute([
      'FT.CREATE', indexName, 
      'ON', dataStructure,
      'PREFIX', '1', `${prefix}`,
      'SCHEMA', ...schema
    ]);
  }

  /** @internal */
  async dropIndex(indexName: string) {
    this.validateShimOpen();
    await this.shim!.execute([ 'FT.DROPINDEX', indexName ]);
  }
  
  /** @internal */
  async search(indexName: string, query: string, offset: number, count: number) {
    this.validateShimOpen();
    return await this.shim!.execute<any[]>(['FT.SEARCH', indexName, query, 'LIMIT', offset.toString(), count.toString()]);
  }

  /** @internal */
  async unlink(key: string) {
    this.validateShimOpen();
    await this.shim!.unlink(key);
  }

  /** @internal */
  async hgetall(key: string): Promise<HashData> {
    this.validateShimOpen();
    return await this.shim!.hgetall(key);
  }

  /** @internal */
  async hsetall(key: string, data: HashData) {
    this.validateShimOpen();
    await this.shim!.hsetall(key, data)
  }

  /** @internal */
  async jsonget(key: string): Promise<JsonData> {
    this.validateShimOpen();
    let json = await this.shim!.execute<string>([ 'JSON.GET', key, '.' ]);
    return JSON.parse(json);
  }

  /** @internal */
  async jsonset(key: string, data: JsonData) {
    this.validateShimOpen();
    let json = JSON.stringify(data);
    await this.shim!.execute<string>([ 'JSON.SET', key, '.', json ]);
  }

  private validateShimClosed() {
    if (this.shim) throw new RedisError("Redis connection is already open.");
  }

  private validateShimOpen() {
    if (!this.shim) throw new RedisError("Redis connection needs opened.");
  }
}
