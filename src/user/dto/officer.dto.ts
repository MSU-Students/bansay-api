import { ApiProperty } from '@nestjs/swagger';

export class OfficerDto {
  @ApiProperty()
  idNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
