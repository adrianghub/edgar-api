import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MarkdownTextSplitter } from 'langchain/text_splitter';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { MODEL, VECTOR_STORE_PATH } from 'src/constants';

@Injectable()
export class DocsService {
  private vectorStore: HNSWLib;

  async processThroughVectorStore(files: string[]) {
    if (existsSync(VECTOR_STORE_PATH)) {
      console.log('Loading Vector Store...');
      try {
        this.vectorStore = await HNSWLib.load(
          VECTOR_STORE_PATH,
          new OpenAIEmbeddings(),
        );
      } catch (error) {
        throw new HttpException(
          'An error occurred while loading vector store data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      console.log('Creating Vector Store...');
      const texts = [];
      const metadata = [];

      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = join('./uploads', file);
          const text = readFileSync(filePath, 'utf8');
          texts.push(text);
          metadata.push({ metadata: file });
        }
      }

      const textSplitter = new MarkdownTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const docs = await textSplitter.createDocuments(texts, metadata);

      const filteredDocs = docs.filter((doc) => doc.pageContent.length > 10);

      try {
        this.vectorStore = await HNSWLib.fromDocuments(
          [].concat(...filteredDocs),
          new OpenAIEmbeddings(),
        );

        await this.vectorStore.save(VECTOR_STORE_PATH);
      } catch (error) {
        throw new HttpException(
          'An error occurred while saving data to vector store',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return 'Database created.';
    }
  }

  async searchRelevantDocs(question: string) {
    try {
      const chat = new ChatOpenAI({
        modelName: MODEL,
        maxTokens: 1500,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      this.vectorStore = await HNSWLib.load(
        VECTOR_STORE_PATH,
        new OpenAIEmbeddings(),
      );

      // return max 10 results having gpt4, gpt-3.5 otherwise with max 5 docs (model === 'gpt-4' ? 10 : 5)
      const relevantDocs = await this.vectorStore.similaritySearch(question, 5);

      const context = `${process.env.DOCS_PROMPT}\n\n
      Note: context is your own memory about relevant document.
              
      context:
      ${relevantDocs
        .map(
          (doc) =>
            'Document: ' + doc.metadata.metadata + '\n' + doc.pageContent,
        )
        .join('\n\n')}
      `;

      const res = await chat.call([
        new SystemChatMessage(context),
        new HumanChatMessage(question),
      ]);

      return res.text;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while searching for relevant documents',
      );
    }
  }
}
