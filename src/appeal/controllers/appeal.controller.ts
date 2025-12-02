import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppealService } from '../services/appeal.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Appeal } from '../entities/appeal.entity';
import { SubmitAppealDto } from '../dto/submit-appeal.dto';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
import { Roles } from '@bansay/auth/decorators/role.decorator';
import type { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { GetUser } from '@bansay/auth/decorators/get-user.decorator';

@Controller('appeal')
@ApiBearerAuth()
export class AppealController {
  constructor(private readonly appealService: AppealService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new appeal' })
  @ApiResponse({
    status: 201,
    description: 'Appeal successfully created',
    type: Appeal,
  })
  @ApiResponse({
    status: 403,
    description: "Cannot appeal another student's liability",
  })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot appeal a cleared liability',
  })
  async submitAppeal(
    @GetUser() user: JwtPayload,
    @Body() submitAppealDto: SubmitAppealDto,
  ): Promise<Appeal> {
    const studentId = Number(user.userId);
    return this.appealService.submitAppeal(studentId, submitAppealDto);
  }
}
