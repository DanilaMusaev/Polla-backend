import { Body, Controller, Post } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}
  @Post()
  async submitResponse(@Body() dto: SubmitResponseDto) {
    const newResponse = await this.responsesService.submitResponse(dto);

    return newResponse;
  }
}
