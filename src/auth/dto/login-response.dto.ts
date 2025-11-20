import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
export class UserInfoDto {
    @ApiProperty()
    id: number; 
    @ApiProperty()
    username: string;
    @ApiProperty() 
    email: string;
    @ApiProperty() 
    role: UserRole;
}

export class LoginResponseDto { 
    @ApiProperty()
    message: string;
    @ApiProperty() 
    accessToken: string;
    @ApiProperty()  
    user: UserInfoDto; 
}
