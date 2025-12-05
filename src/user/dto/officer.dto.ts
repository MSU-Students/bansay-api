import { ApiProperty } from '@nestjs/swagger';

export class OfficerDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  idNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
