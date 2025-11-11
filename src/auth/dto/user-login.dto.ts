import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'alice' })
  username: string;

  @ApiProperty({ example: 'p@ssw0rd' })
  password: string;
}