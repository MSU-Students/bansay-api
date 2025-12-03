import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LiabilityStatus } from '../types/liability-status.type';
import { ApiProperty } from '@nestjs/swagger';

export class QueryLiabilityDto {
  @ApiProperty({
    required: false,
    enum: LiabilityStatus,
    description: 'Filter by liability status',
    example: LiabilityStatus.UNPAID,
  })
  @IsEnum(LiabilityStatus)
  @IsOptional()
  status?: LiabilityStatus;

  @ApiProperty({
    required: false,
    description: 'Filter by the student ID',
    example: '1',
  })
  @IsString()
  @IsOptional()
  studentUsername?: string;

  @ApiProperty({
    required: false,
    description: "Field to sort by (e.g., 'dueDate', 'amount', 'status')",
    example: 'dueDate',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    required: false,
    description: "Sorty order ('ASC' or 'DESC')",
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
