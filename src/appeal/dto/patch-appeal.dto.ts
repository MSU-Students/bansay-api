import { IsEnum, IsUrl, IsOptional, IsString } from 'class-validator';
import { AppealReasonType } from '../types/appeal-reason.type';
import { AppealStatus } from '../types/appeal-status.type';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AppealPatchDto {
  @ApiPropertyOptional({
    enum: AppealReasonType,
    example: AppealReasonType.VALID_EXCUSE,
  })
  @IsOptional()
  @IsEnum(AppealReasonType)
  reasonType?: AppealReasonType;

  @ApiPropertyOptional({
    example: 'Additional details about the appeal',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/proof.pdf',
  })
  @IsOptional()
  @IsUrl()
  proofUrl?: string;

  @ApiPropertyOptional({
    enum: AppealStatus,
    example: AppealStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppealStatus)
  status?: AppealStatus;
}
