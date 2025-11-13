import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  readonly questionId: string;

  @IsDefined()
  readonly content: any; // Может быть string, string[], number
}
