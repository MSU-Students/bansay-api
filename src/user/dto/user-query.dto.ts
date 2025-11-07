import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../interfaces/user-status.enum';
import { UserRole } from '../interfaces/user-role.enum';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ enum: UserStatus, example: 'Pending' })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({
    example: 'Admin',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
