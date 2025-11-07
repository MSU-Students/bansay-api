import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GetUsersQueryDto } from '../dto/user-query.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from '../interfaces/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.userService.getUsers(query);
  }
}
