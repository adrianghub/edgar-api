import { MessagesService } from './messages.service';
import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { PineconeService } from './pinecone/pinecone.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly openaiService: OpenaiService,
    private readonly pinconeService: PineconeService,
  ) {}

  private TEMP_CONTEXT = 'The earth is flat.';

  @Post()
  async createMessage(@Body() data: { message: string }) {
    const { created } = await this.messagesService.createMessage(data.message);

    // const embed = await this.openaiService.createEmbedding(data.message);

    // const matches = await this.pinconeService.query(embed.data[0].embedding);

    // const context = await this.messagesService.getContext(matches);

    if (created) {
      // this.pinconeService.upsert({
      //   id: id.toString(),
      //   values: embed.data[0].embedding,
      // });
    }

    return this.openaiService.createCompletion(data.message, this.TEMP_CONTEXT);
  }
}
