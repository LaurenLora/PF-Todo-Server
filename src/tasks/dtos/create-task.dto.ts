import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Priority } from 'src/common/enums/priority.enum';
import { Status } from 'src/common/enums/status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsString()
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
