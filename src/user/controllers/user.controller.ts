import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GetUsersQueryDto } from '../dto/user-query.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from '../interfaces/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserPatchDto } from '../dto/patch-user.dto';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users - ADMIN only
  @Roles(UserRole.ADMIN)
  @Get()
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.userService.getUsers(query);
  }

  // Update user - ADMIN only
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() userPatchDto: UserPatchDto) {
    return this.userService.patch(id, userPatchDto);
  }
}
