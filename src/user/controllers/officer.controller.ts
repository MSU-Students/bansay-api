import { Controller, Get } from '@nestjs/common';
import { OfficerService } from '../services/officer.service';
import { OfficerDto } from '../dto/officer.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('officer')
export class OfficerController {
    constructor(private service: OfficerService) {}

    @Get()
    @ApiResponse({
        type: [OfficerDto],
    })
    findAll(): Promise<OfficerDto[]> {
        return this.service.findAll();
    }
}
