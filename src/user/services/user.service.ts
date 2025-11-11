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

// use the real User entity, from `user.entity.ts` for mock data.
// use Partial<User> so we don't have to set every DB column.
const mockUsers: Partial<User>[] = [
  {
    id: 1,
    username: 'Alice',
    password: 'topsecret',
  },
  {
    id: 2,
    username: 'Bob',
    password: '123abc',
  },
];

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

  async findUserByName(username: string): Promise<Partial<User> | undefined> {
    return mockUsers.find((user) => user.username === username);
  }

  // How to move from mock to real DB lookup (when ready)
  // Replace the mock function body with a repository call:
  // inside UserService
  // async findUserByName(username: string): Promise<User | null> {
  //   return await this.userRepository.findOne({ where: { username } });
  // }
}
