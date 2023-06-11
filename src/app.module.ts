import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AssistantModule } from './assistant/assistant.module';
import { AssistantService } from './assistant/assistant.service';
import { DocsController } from './docs/docs.controller';
import { MulterModule } from '@nestjs/platform-express';
import { DocsService } from './docs/docs.service';

@Module({
  imports: [
    PrismaModule,
    AssistantModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [AssistantService, DocsService],
  controllers: [DocsController],
})
export class AppModule {}
