// user-register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../user/interfaces/user-role.enum';

export class UserRegisterDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '123456', description: 'Student or Staff ID' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'john.doe@university.edu' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
