import { createClient } from 'redis';

import { RedisClientType } from 'redis/dist/lib/client';
import { RedisModules } from 'redis/dist/lib/commands';
import { RedisLuaScripts } from 'redis/dist/lib/lua-script';

import Entity from './entity/entity';
import Repository from './repository/repository';
import Schema from './schema/schema';

export default class Client {

  readonly redis: RedisClientType<RedisModules, RedisLuaScripts>;

  constructor(url: string = 'redis://localhost:6379') {
    this.redis = createClient({ socket : { url }});
  }

  open() : Promise<void> {
    return this.redis.connect();
  }

  execute<TResult>(command: (string|number|boolean)[]) : Promise<TResult> {
    return this.redis.sendCommand<TResult>(command.map(arg => {
      if (arg === false) return '0';
      if (arg === true) return '1';
      return arg.toString();
    }));
  }

  fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>) : Repository<TEntity> {
    return new Repository(schema, this);
  }

  close() : Promise<void> {
    return this.redis.quit();
  }
}
