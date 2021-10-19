import RedisShim from './redis/redis-shim';

import Entity from './entity/entity';
import Repository from './repository/repository';
import Schema from './schema/schema';
import RedisError from './errors';

export type HashData = { [key: string ]: any };
export type JsonData = { [key: string ]: any };
export type SearchDataStructure = 'HASH' | 'JSON';

export default class Client {
  private shim?: RedisShim;

  async open(url: string = 'redis://localhost:6379') {
    this.validateShimClosed();
    let shim = new RedisShim();
    await shim.open(url);
    this.shim = shim;
  }
  
  async close() {
    this.validateShimOpen();
    await this.shim!.close();
    this.shim = undefined;
  }

  fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>) : Repository<TEntity> {
    this.validateShimOpen();
    return new Repository(schema, this);
  }

  async execute<TResult>(command: (string|number|boolean)[]) : Promise<TResult> {
    this.validateShimOpen();
    return await this.shim!.execute<TResult>(command.map(arg => {
      if (arg === false) return '0';
      if (arg === true) return '1';
      return arg.toString();
    }));
  }

  async unlink(key: string) {
    this.validateShimOpen();
    await this.shim!.unlink(key);
  }

  async hgetall(key: string): Promise<HashData> {
    this.validateShimOpen();
    return await this.shim!.hgetall(key);
  }

  async hsetall(key: string, data: HashData) {
    this.validateShimOpen();
    await this.shim!.hsetall(key, data)
  }

  async jsonget(key: string): Promise<JsonData> {
    this.validateShimOpen();
    let json = await this.shim!.execute<string>([ 'JSON.GET', key, '.' ]);
    return JSON.parse(json);
  }

  async jsonset(key: string, data: JsonData) {
    this.validateShimOpen();
    let json = JSON.stringify(data);
    await this.shim!.execute<string>([ 'JSON.SET', key, '.', json ]);
  }

  async createIndex(indexName: string, dataStructure: SearchDataStructure, prefix: string, schema: string[]) {
    this.validateShimOpen();
    await this.shim!.execute([
      'FT.CREATE', indexName, 
        'ON', dataStructure,
        'PREFIX', '1', `${prefix}`,
        'SCHEMA', ...schema
    ]);
  }

  async dropIndex(indexName: string) {
    this.validateShimOpen();
    await this.shim!.execute([ 'FT.DROPINDEX', indexName ]);
  }

  async search(indexName: string, query: string, offset: number, count: number) {
    this.validateShimOpen();
    return await this.shim!.execute<any[]>([
      'FT.SEARCH', indexName, query,
      'LIMIT', offset.toString(), count.toString()
    ]);
  }

  private validateShimClosed() {
    if (this.shim) throw new RedisError("Redis connection is already open.");
  }

  private validateShimOpen() {
    if (!this.shim) throw new RedisError("Redis connection needs opened.");
  }
}
