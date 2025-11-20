import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
import { UserStatus } from '@bansay/user/interfaces/user-status.enum';
export class RegistrationInfoDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    firstName: string; 
    
    @ApiProperty()
    lastName: string; 
    
    @ApiProperty()
    username: string; 
    
    @ApiProperty()
    email: string;
    
    @ApiProperty() 
    role: UserRole; 
    
    @ApiProperty()
    status: UserStatus;
}
export class RegisterResponseDto {
    @ApiProperty()
    message: string;
    @ApiProperty()
    user: RegistrationInfoDto;
}