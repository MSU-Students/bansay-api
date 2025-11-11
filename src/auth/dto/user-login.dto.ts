import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'topsecret' })
  @IsString()
  @IsNotEmpty()
  password: string;
}