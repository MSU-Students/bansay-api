import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AppealService } from '../services/appeal.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Appeal } from '../entities/appeal.entity';
import { SubmitAppealDto } from '../dto/submit-appeal.dto';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
import { Roles } from '@bansay/auth/decorators/role.decorator';
import type { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { GetUser } from '@bansay/auth/decorators/get-user.decorator';
import { QueryAppealDto } from '../dto/query-appeal.dto';

@Controller('appeals')
@ApiBearerAuth()
export class AppealController {
  constructor(private readonly appealService: AppealService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new appeal' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Appeal successfully created',
    type: Appeal,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Cannot appeal another student's liability",
  })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot appeal a cleared liability',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Appeal already exists for this liability',
  })
  async submitAppeal(
    @GetUser() user: JwtPayload,
    @Body() submitAppealDto: SubmitAppealDto,
  ): Promise<Appeal> {
    const studentId = Number(user.userId);
    return this.appealService.submitAppeal(studentId, submitAppealDto);
  }

  @Get()
  @Roles(UserRole.OFFICER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all appeals (Officer only)',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
  })
  getAppeals(@Query() query: QueryAppealDto) {
    return this.appealService.getAppeals(query);
  }
}
