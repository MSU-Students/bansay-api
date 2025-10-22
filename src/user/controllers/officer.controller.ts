import { Controller, Get } from '@nestjs/common';

@Controller('officer')
export class OfficerController {
    @Get()
    findAll():string[] {
        return [];
    }
}
