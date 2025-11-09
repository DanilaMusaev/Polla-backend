import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateQuestionDto } from "./create-question.dto";

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  readonly description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  readonly questions: CreateQuestionDto[];
}
