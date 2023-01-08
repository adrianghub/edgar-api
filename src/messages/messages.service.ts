import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
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
      },
    });

    return {
      ...newMessage,
      created: true,
    };
  }

  async messages(ids: number[]) {
    return this.prisma.message.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async getContext(matches) {
    return (await this.messages(matches))
      .filter(
        (message, index, self) =>
          self.findIndex((t) => t.message === message.message) === index,
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
