import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';
import { OpenaiService } from './messages/openai/openai.service';
import { PineconeService } from './messages/pinecone/pinecone.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, MessagesModule],
  controllers: [AppController, MessagesController],
  providers: [AppService, MessagesService, OpenaiService, PineconeService],
})
export class AppModule {}
