import { Module } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { PineconeService } from './pinecone/pinecone.service';

@Module({
  providers: [OpenaiService, AssistantService, PineconeService],
  controllers: [AssistantController],
})
export class AssistantModule {}
