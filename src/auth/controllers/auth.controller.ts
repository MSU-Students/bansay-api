import { Controller, Post, Body, HttpCode, HttpStatus, NotImplementedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import { JwtPayload } from '../types/jwt-payload.interface';
import { UserRole } from 'src/user/interfaces/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../decorators/is-public.decorator';
import { UserLoginDto } from '../dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
    return this.authService.register(userRegisterDto);
  }

  @Public()
  @Post('temp-token')
  generateTempToken() {
    const payload: JwtPayload = {
      userId: '1',
      email: 'test@example.com',
      role: UserRole.ADMIN,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: '1h',
    };
  }

  // register above
  // login below

  // start of user story 3.1 (backend)
  // post login endpoint (no validation yet)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    // forward to AuthService to authenticate and return token/result
    return this.authService.authenticate(userLoginDto);
  }
}
