import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the Liability being paid',
  })
  @IsNotEmpty()
  @IsNumber()
  liabilityId: number;

  @ApiProperty({
    example: 'GCASH-12345',
    description: 'Transaction Reference Number',
  })
  @IsNotEmpty()
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    example: 'https://example.com/receipt.jpg',
    description: 'URL to proof image',
  })
  @IsNotEmpty()
  @IsUrl()
  proofUrl: string;

  @ApiProperty({ example: 500.0, description: 'Amount paid' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
