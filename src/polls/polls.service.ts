import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPollById(pollId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        questions: true,
      },
    });

    if (!poll) {
      throw new NotFoundException(`No one poll find with id: ${pollId}`);
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      questions: poll.questions,
    };
  }

  async createPoll(createPollDto: CreatePollDto, userId?: string) {
    try {
      const createdPoll = await this.prisma.poll.create({
        data: {
          title: createPollDto.title,
          description: createPollDto.description,
          userId: userId,
          questions: {
            create: createPollDto.questions.map((q) => ({
              text: q.text,
              type: q.type,
              order: q.order,
              options: q.options,
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      return {
        id: createdPoll.id,
        title: createdPoll.title,
        links: {
          getPoll: process.env.HOST_URL + createdPoll.id,
          resultsPoll: process.env.HOST_URL + createdPoll.resultsId,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('A poll with this id already exists');
          case 'P2003':
            throw new BadRequestException('Incorrect link data');
          case 'P2014':
            throw new BadRequestException(
              'The associated record was not found',
            );
        }
      }
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new InternalServerErrorException('Ошибка базы данных');
      }
    }
  }
}
