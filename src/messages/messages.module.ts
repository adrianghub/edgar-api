import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { OpenaiService } from './openai/openai.service';
import { PineconeService } from './pinecone/pinecone.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, OpenaiService, PineconeService],
})
export class MessagesModule {}
