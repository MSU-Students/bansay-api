import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(userInput: UserRegisterDto): Promise<any> {
    const existingUser = await this.userRepository.findBy({
      username: userInput.username,
    });

    if (existingUser) throw new ConflictException('User ID already exists..');

    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const newUser = this.userRepository.create({
      ...userInput,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return { message: 'User registered successfully' };
  }
}
