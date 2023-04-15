import { Injectable } from '@nestjs/common';
import { pineconeIndex } from './pinecone.config';
import { QueryRequest, UpsertRequest } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  async upsert(vectors) {
    const upsertRequest: UpsertRequest = {
      vectors: [vectors],
    };

    return await (
      await pineconeIndex()
    ).upsert({
      upsertRequest,
    });
  }

  async query(vector) {
    const queryRequest: QueryRequest = {
      topK: 10,
      vector,
      includeMetadata: true,
      includeValues: false,
    };

    const { matches } = await (
      await pineconeIndex()
    ).query({
      queryRequest,
    });

    return matches
      .filter((match) => match.score > 0.8)
      .map((match) => parseInt(match.id));
  }
}
