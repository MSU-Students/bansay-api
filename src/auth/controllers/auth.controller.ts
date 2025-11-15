import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import { Public } from '../decorators/is-public.decorator';
import { UserLoginDto } from '../dto/user-login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import type { JwtPayload } from '../types/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
    return this.authService.register(userRegisterDto);
  }

  @Public()
  @HttpCode(200) // return 200 OK
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @ApiBearerAuth()
  @Get('me')
  getMe(@GetUser() user: JwtPayload) {
    return user;
  }
}
