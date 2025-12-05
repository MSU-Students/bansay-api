import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { AppealPatchDto } from '../dto/patch-appeal.dto';
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

  @Patch(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Partially update an appeal' })
  @ApiResponse({
    status: 200,
    description: 'Appeal successfully updated',
    schema: {
      example: {
        id: 1,
        status: 'Approved',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data or status transition',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Appeal not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Appeal cannot be modified in its current state',
  })
  patchAppeal(@Param('id') id: string, @Body() appealPatchDto: AppealPatchDto) {
    return this.appealService.patch(Number(id), appealPatchDto);
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

  @Get(':id')
  @Roles(UserRole.OFFICER)
  @ApiOperation({
    summary: 'Get appeal by ID (Officer only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appeal retrieved successfully',
    type: Appeal,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appeal not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. Insufficient role',
  })
  getAppealById(@Param('id') id: number) {
    return this.appealService.getAppealById(id);
  }
}
