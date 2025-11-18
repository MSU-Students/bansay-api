import {
  IsEnum,
  IsNumber,
  IsDateString,
  IsPositive,
  Min,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { LiabilityType } from '../types/liability-type.type';
import { Type } from 'class-transformer';

export class CreateLiabilityDto {
  @IsString()
  @IsNotEmpty()
  studentUsername: string;

  @IsEnum(LiabilityType)
  type: LiabilityType;

  @IsNumber()
  @IsPositive()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @IsDateString()
  dueDate: string;
}