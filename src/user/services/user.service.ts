import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersQueryDto } from '../dto/user-query.dto';
import { UserPatchDto } from '../dto/patch-user.dto';
import { StudentService } from './student.service';
import { OfficerService } from './officer.service';
import { UserStatus } from '../interfaces/user-status.enum';
import { UserRole } from '../interfaces/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private studentService: StudentService,
    private officerService: OfficerService,
  ) {}

  async getUsers(filter: GetUsersQueryDto) {
    const { status, role } = filter;

    const where: FindOptionsWhere<User> = {};

    if (status) where.status = status;
    if (role) where.role = role;

    try {
      const users = await this.userRepository.find({
        where,
        select: [
          'id',
          'username',
          'email',
          'firstName',
          'lastName',
          'role',
          'status',
          'createdAt',
        ],
      });

      return {
        data: users,
        count: users.length,
      };
    } catch {
      throw new BadRequestException('Invalid filter parameters');
    }
  }

  async patch(userId: string, userPatchDto: UserPatchDto) {
    // Get user before updating to check old status
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });

    if (!user) throw new NotFoundException('User not found.');

    const result = await this.userRepository.update(
      Number(userId),
      userPatchDto,
    );

    if (result.affected === 0) throw new NotFoundException('User not found.');

    // if user's status was pending and is now active, and role is student, create student record
    if (
      user.status === UserStatus.PENDING &&
      userPatchDto.status === UserStatus.ACTIVE
    ) {
      const roleData = {
        idNumber: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      if (user.role === UserRole.STUDENT) {
        await this.studentService.create(roleData);
      } else if (user.role === UserRole.OFFICER) {
        await this.officerService.create(roleData);
      }
    }

    return this.userRepository.findOne({
      where: { id: Number(userId) },
      select: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'role',
        'status',
      ],
    });
  }
}
