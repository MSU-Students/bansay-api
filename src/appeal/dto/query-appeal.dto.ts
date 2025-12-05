import { ApiProperty } from '@nestjs/swagger';
import { AppealStatus } from '../types/appeal-status.type';
import { AppealReasonType } from '../types/appeal-reason.type';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryAppealDto {
  @ApiProperty({
    required: false,
    enum: AppealStatus,
    description: 'Filter by appeal status',
    example: AppealStatus.PENDING,
  })
  @IsEnum(AppealStatus)
  @IsOptional()
  status?: AppealStatus;
}
