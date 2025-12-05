import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the liability being paid',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  liabilityId: number;

  @ApiProperty({
    description: 'The unique reference number from the payment provider',
    example: 'GCASH-123456789',
  })
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;

  @ApiProperty({
    description: 'The exact amount paid',
    example: 150.0,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountPaid: number;

  @ApiProperty({
    description: 'URL to the proof of payment image',
    example: 'https://storage.googleapis.com/bucket/proofs/payment_123.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  proofUrl: string;

  @ApiProperty({
    description: 'Date the payment was made',
    example: '2025-01-15T10:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;
}
