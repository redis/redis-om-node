import { createClient, createCluster, RediSearchSchema, SearchOptions } from 'redis'

/** A conventional Redis connection. */
export type RedisClientConnection = ReturnType<typeof createClient>

/** A clustered Redis connection. */
export type RedisClusterConnection = ReturnType<typeof createCluster>

/** A Redis connection, clustered or conventional. */
export type RedisConnection = RedisClientConnection | RedisClusterConnection

/** @internal This is a defintion for the type that calls to ft.search in Node Redis return.  */
export type SearchResults = {
  total: number
  documents: SearchDocument[]
}

/** @internal This is a defintion for the return type of calls to ft.search in Node Redis.  */
export type SearchDocument = {
  id: string
  value: {
    [key: string]: any
  }
}

/** @internal */
export type RedisHashData = { [key: string]: string }

/** @internal */
export type RedisJsonData = { [key: string]: any }

/** @internal */
export type SearchDataStructure = 'HASH' | 'JSON'

/**
 * @internal This is a simplified redefintion of the CreateOptions type that is not exported by Node Redis.
 * TODO: Remove this type once CreateOptions is exported by Node Redis.
 * https://github.com/redis/node-redis/blob/master/packages/search/lib/commands/CREATE.ts#L4
 */
export type CreateOptions = {
  ON: SearchDataStructure
  PREFIX: string
  STOPWORDS?: string[]
}
