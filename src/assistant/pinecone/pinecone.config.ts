import { PineconeClient } from '@pinecone-database/pinecone';
import { PINECONE_INDEX_NAME } from 'config';

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export async function pineconeIndex() {
  const pinecone = await initPinecone();
  const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

  return pineconeIndex;
}
