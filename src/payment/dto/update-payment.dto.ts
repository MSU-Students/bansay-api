import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from '../types/payment-status.type';
import { IsEnum, IsOptional } from 'class-validator';

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
}
