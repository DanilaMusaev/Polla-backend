import { Controller, Get, Param } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get(':id')
  getPollResults(@Param('id') id: string) {
    return this.resultsService.getResultById(id);
  }
}
