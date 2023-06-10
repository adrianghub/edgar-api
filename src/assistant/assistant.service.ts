import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class AssistantService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(message: string) {
    const exists = await this.checkIfMessageExists(message);
    if (exists) {
      return {
        ...exists,
        created: false,
      };
    }
    const newMessage = await this.prisma.message.create({
      data: {
        message,
        conversation_id: nanoid(),
      },
    });

    return {
      ...newMessage,
      created: true,
    };
  }

  async messages(ids: string[]) {
    return this.prisma.message.findMany({
      where: {
        conversation_id: {
          in: ids,
        },
      },
    });
  }

  async getContext(matches: string[]) {
    return (await this.messages(matches))
      .filter(
        (message, index, self) =>
          index === self.findIndex((t) => t.message === message.message),
      )
      .reduce((acc, message) => {
        return acc + message.message + '\n';
      }, '');
  }

  private async checkIfMessageExists(message: string) {
    return this.prisma.message.findFirst({
      where: {
        message,
      },
    });
  }
}
