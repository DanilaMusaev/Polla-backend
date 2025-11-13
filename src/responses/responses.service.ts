import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { Question } from 'generated/prisma/client';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class ResponsesService {
  constructor(private readonly prisma: PrismaService) {}

  async submitResponse(dto: SubmitResponseDto) {
    const poll = await this.prisma.poll.findUnique({
      where: {
        id: dto.pollId,
      },
      include: {
        questions: true,
      }
    });

    if (!poll) {
      throw new NotFoundException(`No one poll find with id: ${dto.pollId}`);
    }

    this.validateResponse(dto, poll.questions);

    const newResponse = this.prisma.response.create({
      data: {
        respondent: dto.respondent,
        pollId: dto.pollId,
        answers: {
          create: dto.answers.map((answer) => ({
            questionId: answer.questionId,
            content: answer.content,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return newResponse;
  }

  private validateResponse(dto: SubmitResponseDto, questions: Question[]) {
    const questionIds = questions.map((q) => q.id);

    // Проверяем что все questionId существуют в опросе
    for (const answer of dto.answers) {
      if (!questionIds.includes(answer.questionId)) {
        throw new BadRequestException(
          `Question with id: ${answer.questionId} not found in this poll`,
        );
      }
    }

    // Проверяем что ответили на все вопросы
    if (dto.answers.length !== questions.length) {
      throw new BadRequestException(
        `Need to answer on all questions. Expected: ${questions.length}, already received: ${dto.answers.length}`,
      );
    }

    this.validateAnswerTypes(dto.answers, questions);
  }

  private validateAnswerTypes(
    answers: CreateAnswerDto[],
    questions: Question[],
  ) {
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      this.validateSingleAnswer(answer, question);
    }
  }

  private validateSingleAnswer(answer: CreateAnswerDto, question: Question) {
    const { type, text, options } = question;

    const ensureOptions = () => {
      if (!options || !Array.isArray(options)) {
        throw new BadRequestException(`Question ${text} has no answer`);
      }
      return options;
    };

    switch (type) {
        case 'TEXT':
            if (typeof answer.content !== 'string') {
                throw new BadRequestException(`Question "${text}" requires text answer`)
            }
            break;
        case 'SINGLE_CHOICE':
            const singleOptions = ensureOptions();
            if (!singleOptions.includes(answer.content)) {
                throw new BadRequestException(`The answer to the question "${text}" should be one of ${singleOptions.join(',')}`);
            }
            break;
        case 'MULTIPLE_CHOICE':
            const multipleOptions = ensureOptions();
            if (!Array.isArray(answer.content) || 
                !answer.content.every(opt => multipleOptions.includes(opt))) {
                throw new BadRequestException(
                  `The answer to the question "${text}" should contain only: ${multipleOptions.join(', ')}`,
                );
            }
            break;
        case 'IMAGE_CHOICE':
            const imageOptions = ensureOptions();
            if (!imageOptions.includes(answer.content)) {
                throw new BadRequestException('The selected image was not found in the options ');
            }
            break;

        case 'RATING':
            const rating = answer.content
            if (typeof rating !== 'number') {
                throw new BadRequestException(`Question "${text}" requires answer in number`);
            }
            if (rating < 0 || rating > 5) {
                throw new BadRequestException(`Question "${text}" requires answer in range [0, 5]`);
            }
            break;
        default:
                throw new BadRequestException(`Unknown question type: ${type}`);
    }
  }
}
