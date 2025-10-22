import { ApiProperty } from '@nestjs/swagger';

export class StudentPatchDto {
    @ApiProperty()
    field: string;
    @ApiProperty()
    value: string;
}