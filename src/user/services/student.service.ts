import { BadRequestException, Injectable } from '@nestjs/common';
import { StudentRegistrationDto } from '../dto/student-registration.dto';
import { StudentDto } from '../dto/student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) 
        private repo : Repository<Student>
    ){}

    async create(student: StudentRegistrationDto) {
        const record = this.repo.create({
            email: student.email,
            idNumber: student.idNumber,
            firstName: 'Unknown',
            lastName: 'Unknown',
            middleName: 'Unknown',
        });
        return await this.repo.save(record);
    }
    async findAll(): Promise<StudentDto[]> {
        return (await this.repo.find()).map(record => {
            return {
                id: record.id,
                email: record.email,
                idNumber: record.idNumber,
                fullName: `${record.firstName} ${record.middleName} ${record.lastName}`
            }
        });
    }
    patch(id: string, field: string, value: string) {
        const studentFields: (keyof Student)[] = [
            'email', 
            'firstName', 
            'lastName', 
            'middleName'
        ];
        if (!studentFields.includes(field as keyof Student)) {
            return new BadRequestException();
        }
        return this.repo.update(id, {[field]: value})
    }
    delete(id: string) {
        return this.repo.delete(id);
    }
}