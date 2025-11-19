import { ApiProperty } from '@nestjs/swagger';
import { Liability } from '../entities/liability.entity';

export class MyLiabilitiesResponseDto {
  @ApiProperty({ type: [Liability] })
  liabilities: Liability[];

  @ApiProperty({
    example: 150.75,
    description: 'The sum of all UNPAID liabilities',
  })
  totalOutstandingBalance: number;
}