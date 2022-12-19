import { BaseFieldDefinition } from "./base-field-definition";

type Algorithm = 'FLAT' | 'HNSW'

interface VectorParameters {
  // vector algorithm to use
  algorithm: Algorithm,

  // vector type, currently only FLOAT32 supported
  vector_type?: 'FLOAT32',

  // vector dimension
  dim: number,

  // Supported distance metric
  distance_metric: 'L2' | 'IP' | 'COSINE',

  // Initial vector capacity in the index affecting memory allocation size of the index
  initial_cap?: number,
}

interface FlatVectorParameters extends VectorParameters {
  algorithm: 'FLAT',

  // Block size to hold amount of vectors in a contiguous array
  block_size?: number, // default 1,048,576 (1024*1024)
}

interface HNSWVectorParameters extends VectorParameters {
  algorithm: 'HNSW';

  // Number of maximum allowed outgoing edges for each node in the graph in each layer
  m?: number,

  // Number of maximum allowed potential outgoing edges candidates for each node in the
  // graph, during the graph building
  ef_construction?: number

  // Number of maximum top candidates to hold during the KNN search
  ef_runtime?: number, // 10
}

type VectorAlgorithm = FlatVectorParameters | HNSWVectorParameters

/** A field representing binary data. */
export interface BinaryFieldDefinition extends BaseFieldDefinition {
  /** Yep. It's a binary. */
  type: 'binary';

  // vector parameters
  vector?: VectorAlgorithm;
}
