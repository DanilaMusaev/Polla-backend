import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getResultById(resultId: string) {
    const pollWithResponses = await this.prisma.poll.findUnique({
      where: {
        resultsId: resultId,
      },
      include: {
        responses: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!pollWithResponses) {
      throw new NotFoundException(
        `No one poll results find with id: ${resultId}`,
      );
    }

    return pollWithResponses;
  }
}
