import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AssistantModule } from './assistant/assistant.module';
import { AssistantService } from './assistant/assistant.service';

@Module({
  imports: [PrismaModule, AssistantModule],
  providers: [AssistantService],
})
export class AppModule {}
