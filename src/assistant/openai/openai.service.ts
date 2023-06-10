import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  private CONTEXT_INSTRUCTION = 'Based on this context:';
  private INSTRUCTION = process.env.PROMPT ?? '';

  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async createEmbedding(prompt) {
    const { data: embed } = await this.openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002',
    });

    return embed;
  }

  async createCompletion(prompt, context) {
    const completion = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '',
        },
        {
          role: 'user',
          content: `${this.CONTEXT_INSTRUCTION}\n\n\nContext: "${context}" \n\n\n${this.INSTRUCTION} \n\n\n ${prompt}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.5,
    });

    return completion.data.choices[0].message.content;
  }
}
