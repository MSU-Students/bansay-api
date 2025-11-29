import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../interfaces/user-status.enum';
import { OfficerService } from './officer.service';
import { StudentService } from './student.service';
import { StudentDto } from '../dto/student.dto';
import { OfficerDto } from '../dto/officer.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private officerService: OfficerService,
    private studentService: StudentService,
  ) {}

  async getPendingCount(): Promise<{ count: number }> {
    const count = await this.userRepository.count({
      where: { status: UserStatus.PENDING },
    });
    return { count };
  }

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
