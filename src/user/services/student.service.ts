import { BadRequestException, Injectable } from '@nestjs/common';
import { StudentRegistrationDto } from '../dto/student-registration.dto';
import { StudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
    
    
    data: StudentDto[] = [{
        email: 'captain@mail.com',
        fullName: 'Luffy',
        idNumber: '1234'
    }];
    create(student: StudentRegistrationDto) {
        this.data.push({
            email: student.email,
            idNumber: student.idNumber,
            fullName: 'Unknown'
        })
    }
    findAll(): StudentDto[] {
        return this.data;
    }
    patch(id: string, field: string, value: string) {
        const index = this.data.findIndex(i => i.idNumber == id);
        if (index >= 0) {
            const data = this.data[index];
            data[field] = value;
            this.data.splice(index, 1, data);
        } else {
            throw new BadRequestException();
        }
    }
    delete(id: string) {
        const index = this.data.findIndex(i => i.idNumber == id);
        if (index >= 0) {
            this.data.splice(index, 1);
        } else {
            throw new BadRequestException();
        }
    }
}