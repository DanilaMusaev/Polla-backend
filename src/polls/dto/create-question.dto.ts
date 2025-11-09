import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";

export enum QuestionType {
  TEXT = 'TEXT',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  IMAGE_CHOICE = 'IMAGE_CHOICE',
  RATING = 'RATING',
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsEnum(QuestionType)
  readonly type: QuestionType;

  @IsNumber()
  @Min(1)
  readonly order: number;

  @IsOptional()
  readonly options?: any;

  // Валидация в зависимости от типа вопроса
  @ValidateIf(
    (o) =>
      o.type === QuestionType.SINGLE_CHOICE ||
      o.type === QuestionType.MULTIPLE_CHOICE ||
      o.type === QuestionType.IMAGE_CHOICE,
  )
  @IsArray()
  @ArrayMinSize(2)
  readonly _options?: any[]; // Альтернативное поле для валидации
}
