import { Module } from '@nestjs/common';
import { PollsModule } from './polls/polls.module';
import { ResultsModule } from './results/results.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PollsModule, ResultsModule, ConfigModule.forRoot({
    envFilePath: '.env'
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
