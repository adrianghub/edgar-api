import { Injectable } from '@nestjs/common';

@Injectable()
export class PineconeService {
  // private pinecone;
  // constructor() {
  //   // ERROR [ExceptionHandler] globalThis.Headers is not a constructor (???)
  //   this.pinecone = new PineconeClient({
  //     apiKey: process.env.PINECONE_API_KEY,
  //     baseUrl: process.env.PINECONE_BASE_URL,
  //     namespace: process.env.PINECONE_NAMESPACE,
  //   });
  // }
  // upsert(vectors) {
  //   return this.pinecone.upsert({
  //     vectors: [vectors],
  //   });
  // }
  // async query(vector) {
  //   const { matches } = await this.pinecone.query({
  //     vector,
  //     topK: 1,
  //     includeMetadata: true,
  //     includeVector: true,
  //   });
  //   return matches
  //     .filter((match) => match.score > 0.8)
  //     .map((match) => parseInt(match.id));
  // }
}
