import RedisShim from './redis/redis-shim';

import Entity from './entity/entity';
import Repository from './repository/repository';
import Schema from './schema/schema';

export default class Client {
  readonly redis: RedisShim;

  constructor() {
    this.redis = new RedisShim();
  }
  
  open(url: string = 'redis://localhost:6379') {
    this.redis.open(url);
  }
  
  execute<TResult>(command: (string|number|boolean)[]) : Promise<TResult> {
    return this.redis.execute<TResult>(command.map(arg => {
      if (arg === false) return '0';
      if (arg === true) return '1';
      return arg.toString();
    }));
  }

  fetchRepository<TEntity extends Entity>(schema: Schema<TEntity>) : Repository<TEntity> {
    return new Repository(schema, this);
  }

  close() : Promise<void> {
    return this.redis.close();
  }
}
