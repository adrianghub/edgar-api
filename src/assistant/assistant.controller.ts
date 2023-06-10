import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { OpenaiService } from './openai/openai.service';
import { PineconeService } from './pinecone/pinecone.service';

@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly openaiService: OpenaiService,
    private readonly pineconeService: PineconeService,
  ) {}

  @Post('/conversation')
  async createMessage(@Body() data: { message: string }) {
    const { conversation_id, created } =
      await this.assistantService.createMessage(data.message);

    const embed = await this.openaiService.createEmbedding(data.message);
    const matches = await this.pineconeService.query(embed.data[0].embedding);

    const context = await this.assistantService.getContext(matches);

    if (created) {
      this.pineconeService.upsert({
        id: conversation_id,
        values: embed.data[0].embedding,
      });
    }

    return this.openaiService.createCompletion(data.message, context);
  }
}
