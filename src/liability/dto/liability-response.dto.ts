import { ApiProperty } from '@nestjs/swagger';
import { Liability } from '../entities/liability.entity';

export class LiabilityResponseDto {
  @ApiProperty({ example: 'Liability created successfully' })
  message: string;

  @ApiProperty({ type: () => Liability })
  liability: Liability;
}