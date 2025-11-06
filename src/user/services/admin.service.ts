import { Injectable } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { StudentService } from './student.service';
import { StudentDto } from '../dto/student.dto';
import { OfficerDto } from '../dto/officer.dto';

@Injectable()
export class AdminService {
    constructor(
        private officerService: OfficerService,
        private studentService: StudentService,
    ) {}

    async findAll(): Promise<{
        students: StudentDto[];
        officers: OfficerDto[];
    }> {
        const [students, officers] = await Promise.all([
            this.studentService.findAll(),
            this.officerService.findAll(),
        ]);

        return {
            students,
            officers,
        };
    }
}
