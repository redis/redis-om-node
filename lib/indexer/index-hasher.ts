import { createHash } from 'crypto';

import { Entity } from "../entity/entity";
import { Schema } from "../schema";

export function generateIndexHash<TEntity extends Entity>(schema: Schema<TEntity>): string {

  const data = JSON.stringify({
    definition: schema.definition,
    prefix: schema.prefix,
    indexName: schema.indexName,
    indexHashName: schema.indexHashName,
    dataStructure: schema.dataStructure,
    useStopWords: schema.useStopWords,
    stopWords: schema.stopWords
  });

  return createHash('sha1').update(data).digest('base64');
}
