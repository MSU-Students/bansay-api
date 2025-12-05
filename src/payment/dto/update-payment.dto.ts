import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from '../types/payment-status.type';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({
    required: false,
    enum: PaymentStatus,
    example: PaymentStatus.PENDING_VERIFICATION,
    description: 'Payment status',
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({
    required: false,
    description: 'Rejection reason. Optional if status is Rejected',
    example: 'Photo proof is unclear',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === PaymentStatus.REJECTED)
  rejectionReason?: string;
}
