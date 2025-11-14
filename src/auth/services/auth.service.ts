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
import { UserLoginDto } from '../dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  // validateUser METHOD
  private async validateUser(userLoginDto: UserLoginDto): Promise<User | null> {
    const { username, password } = userLoginDto;

    const user = await this.userRepository.findOneBy({ username });

    // check 1: user exists
    // check 2: user status is active (not pending or disabled)
    // check 3: password is correct
    if (
      user &&
      user.status === UserStatus.ACTIVE &&
      (await bcrypt.compare(password, user.password))
    ) { // user exists, user is active, password is correct
      return user;
    }

    return null;
  }
}
