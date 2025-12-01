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
    private repo: Repository<Student>,
  ) {}

  async create(student: StudentRegistrationDto) {
    const record = this.repo.create({
      email: student.email,
      idNumber: student.idNumber,
      firstName: student.firstName,
      lastName: student.lastName,
    });
    return await this.repo.save(record);
  }
  async findAll(filter?: Partial<Student>): Promise<StudentDto[]> {
    const result = filter
      ? await this.repo.find({
          where: filter,
        })
      : await this.repo.find();
    return result.map((record) => {
      return {
        id: record.id,
        email: record.email,
        idNumber: record.idNumber,
        fullName: `${record.firstName} ${record.lastName}`,
      };
    });
  }
  patch(id: string, field: string, value: string) {
    const studentFields: (keyof Student)[] = [
      'email',
      'firstName',
      'lastName',
      'middleName',
    ];
    if (!studentFields.includes(field as keyof Student)) {
      return new BadRequestException();
    }
    return this.repo.update(id, { [field]: value });
  }
  delete(id: string) {
    return this.repo.delete(id);
  }
}
