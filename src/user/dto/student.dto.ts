import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
    @ApiProperty()
    fullName: string;
    @ApiProperty()
    idNumber: string;
    @ApiProperty()
    email: string;
}