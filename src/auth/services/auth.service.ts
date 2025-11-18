import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/user/interfaces/user-status.enum';
import { UserLoginDto } from '../dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userInput: UserRegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findOneBy({
      username: userInput.username,
    });

    if (existingUser) throw new ConflictException('User ID already exists..');

    try {
      const hashedPassword = await bcrypt.hash(userInput.password, 10);
      const newUser = this.userRepository.create({
        ...userInput,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
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

  // login METHOD
  async login (userLoginDto: UserLoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(userLoginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials or account inactive');
    }

    // user is valid, now create JWT payload
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }

    // sign the token
    const accessToken = await this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // validateUser METHOD
  private async validateUser(userLoginDto: UserLoginDto): Promise<User | null> {
    const { username, password } = userLoginDto;

    // const user = await this.userRepository.findOneBy({ username });
    // from user.entity.ts, the code:
    // @Column({ type: 'varchar', length: 128, select: false })
    // "select: false" is a security feature, so using a normal database query like this one "findONeBy)", 
    // TypeORM automatically hides the password so it's never accidentally sent to the frontend.
    // because of that, the `user` object this query returns has user.password set to undefined.
    // documenting this because it took a long time for me to debug this 
    // as I encoutnered this 500 Internal Server Error on my Swagger when I was testing the login endpoint.
    
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where('user.username = :username', { username })
    .addSelect('user.password')
    .getOne();

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
