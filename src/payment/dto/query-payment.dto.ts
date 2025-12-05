import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../types/payment-status.type';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryPaymentDto {
  @ApiProperty({
    required: false,
    description: 'Filter by Reference Number',
    example: 'PAY-2024-001',
  })
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by Payment Status',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING_VERIFICATION,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
