import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/user/interfaces/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(userInput: UserRegisterDto): Promise<any> {
    const existingUser = await this.userRepository.findOneBy({
      username: userInput.username,
    });

    if (existingUser) throw new ConflictException('User ID already exists..');

    try {
      const hashedPassword = await bcrypt.hash(userInput.password, 10);
      const newUser = this.userRepository.create({
        ...userInput,
        password: hashedPassword,
        status: UserStatus.PENDING,
      });

      const savedUser = await this.userRepository.save(newUser);
      return {
        message: 'User registered successfully',
        user: {
          id: savedUser.id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
          status: savedUser.status,
        },
      };
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
