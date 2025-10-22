import { ApiProperty } from '@nestjs/swagger';

export class StudentRegistrationDto {
    @ApiProperty()
    idNumber: string;
    @ApiProperty()
    email: string;
}