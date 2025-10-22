import { Controller, Get } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';


@Controller('students')
export class StudentController {
    constructor(private service: StudentService) {}
    @Get()
    findAll():string[] {
        return this.service.findAll();
    }
}