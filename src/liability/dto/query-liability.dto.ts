import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { LiabilityStatus } from "../types/liability-status.type";
import { ApiProperty } from "@nestjs/swagger";

export class QueryLiabilityDto {
    @ApiProperty({
        required: false,
        enum: LiabilityStatus,
        description: 'Filter by liability status',
        example: LiabilityStatus.UNPAID,
    })
    @IsEnum(LiabilityStatus)
    @IsOptional()
    status?: LiabilityStatus;

    @ApiProperty({
        required: false,
        description: 'Filter by the student ID',
        example: '1',
    })
    @IsNumberString()
    @IsOptional()
    studentId?: string;
}