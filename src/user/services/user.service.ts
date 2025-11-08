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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
    const result = await this.userRepository.update(
      Number(userId),
      userPatchDto,
    );

    if (result.affected === 0) throw new NotFoundException('User not found.');

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
