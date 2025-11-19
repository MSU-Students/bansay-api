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
import { ApiProperty } from '@nestjs/swagger';

export class CreateLiabilityDto {
  @ApiProperty({
    example: 'mangorangca',
    description: "The student's username",
  })
  @IsString()
  @IsNotEmpty()
  studentUsername: string;

  @ApiProperty({
    enum: LiabilityType,
    example: LiabilityType.FINE,
    description: 'The type of liability',
  })
  @IsEnum(LiabilityType)
  type: LiabilityType;

  @ApiProperty({
    example: 150.75,
    description: 'The monetary amount of the liability',
  })
  @IsNumber()
  @IsPositive()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: '2025-12-31',
    description: 'The date the liability is due (YYYY-MM-DD)',
  })
  @IsDateString()
  dueDate: string;
}