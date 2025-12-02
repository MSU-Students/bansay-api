import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppealReasonType } from '../types/appeal-reason.type';

export class SubmitAppealDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  liabilityId: number;

  @ApiProperty({
    enum: AppealReasonType,
    example: AppealReasonType.VALID_EXCUSE,
  })
  @IsEnum(AppealReasonType)
  reasonType: AppealReasonType;

  @ApiProperty({ example: 'I was hospitalized', required: false })
  @IsString()
  remarks: string;
}
