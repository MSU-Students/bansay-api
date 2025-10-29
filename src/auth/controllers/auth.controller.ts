import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
    return this.authService.register(userRegisterDto);
  }
}
