import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersQueryDto } from '../dto/user-query.dto';

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
}
