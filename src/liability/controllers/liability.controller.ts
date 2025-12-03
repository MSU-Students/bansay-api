import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateLiabilityDto } from '../dto/create-liability.dto';
import { LiabilityService } from '../services/liability.service';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
import { Roles } from '@bansay/auth/decorators/role.decorator';
import type { RequestWithUser } from '@bansay/auth/types/request-with-user.interface';
import { Liability } from '../entities/liability.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateLiabilityDto } from '../dto/update-liability.dto';
import { QueryLiabilityDto } from '../dto/query-liability.dto';
import { MyLiabilitiesResponseDto } from '../dto/my-liabilities-response.dto';
import { GetUser } from '@bansay/auth/decorators/get-user.decorator';
import type { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';

@ApiTags('Liability')
@ApiBearerAuth()
@Controller('liability')
export class LiabilityController {
  constructor(private readonly liabilityService: LiabilityService) {}

  @Post()
  @Roles(UserRole.OFFICER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new liability (Officer Only)' })
  @ApiResponse({
    status: 201,
    description: 'Liability created successfully',
    type: Liability,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Not an Officer.' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async create(
    @Body() createLiabilityDto: CreateLiabilityDto,
    @Req() req: RequestWithUser,
  ): Promise<Liability> {
    const issuerId = req.user.userId;

    return (await this.liabilityService.createLiability(
      createLiabilityDto,
      Number(issuerId),
    )) as Liability;
  }

  @Get('me')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Find all liabilities for the logged-in student' })
  @ApiResponse({
    status: 200,
    description: "A list of the student's liabilities and their total balance.",
    type: MyLiabilitiesResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Not a Student.' })
  async findMy(@GetUser() user: JwtPayload): Promise<MyLiabilitiesResponseDto> {
    return this.liabilityService.findMyLiabilities(user);
  }

  @Get()
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find all liabilities (Officer/Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'A list of liabilities.',
    type: [Liability],
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  async findAll(@Query() queryDto: QueryLiabilityDto): Promise<Liability[]> {
    return this.liabilityService.findAllLiabilities(queryDto);
  }

  @Get(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find one liability by ID (Officer/Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'Liability retrieved successfully',
    type: Liability,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  async findOne(@Param('id') id: string): Promise<Liability> {
    console.log('ID:', id);
    return this.liabilityService.findLiabilityById(Number(id));
  }

  @Patch(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a liability (Officer/Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'Liability updated successfully',
    type: Liability,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLiabilityDto: UpdateLiabilityDto,
  ): Promise<Liability> {
    return this.liabilityService.updateLiability(
      Number(id),
      updateLiabilityDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a liability (Officer/Admin Only)' })
  @ApiResponse({
    status: 204,
    description: 'Liability soft-deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete a liability that is already paid',
  })
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.liabilityService.softDeleteLiability(Number(id));
  }
}
