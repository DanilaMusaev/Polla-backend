import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get(':id')
  async getPollById(@Param('id') id: string) {
    const poll = await this.pollsService.getPollById(id);
    return poll;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @Req() request: Request,
  ) {
    // const userId = request.user?.id || undefined; // When add authorization
    const pollData = await this.pollsService.createPoll(createPollDto);

    if (!pollData) {
      throw new InternalServerErrorException('Failed to create an entry');
    }

    return pollData;
  }
}
