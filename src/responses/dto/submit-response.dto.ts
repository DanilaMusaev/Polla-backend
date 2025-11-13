import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';

export class SubmitResponseDto {
  @IsString()
  @MaxLength(20)
  @IsOptional()
  readonly respondent: string;
  @IsString()
  @IsNotEmpty()
  readonly pollId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  readonly answers: CreateAnswerDto[];
}
