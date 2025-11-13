import { Module } from '@nestjs/common';
import { PollsModule } from './polls/polls.module';
import { ResultsModule } from './results/results.module';
import { ConfigModule } from '@nestjs/config';
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [PollsModule, ResultsModule, ConfigModule.forRoot({
    envFilePath: '.env'
  }), ResponsesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
