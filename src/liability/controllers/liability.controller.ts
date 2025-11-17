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
import { UserRole } from 'src/user/interfaces/user-role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import type { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { Liability } from '../entities/liability.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateLiabilityDto } from '../dto/update-liability.dto';
import { QueryLiabilityDto } from '../dto/query-liability.dto';
import { LiabilityResponseDto } from '../dto/liability-response.dto';

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
    type: LiabilityResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Not an Officer.' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async create(
    @Body() createLiabilityDto: CreateLiabilityDto,
    @Req() req: RequestWithUser,
  ): Promise<LiabilityResponseDto> {
    const issuerId = req.user.userId;
    const liability = (await this.liabilityService.createLiability(
      createLiabilityDto,
      Number(issuerId),
    )) as Liability;

    return {
      message: 'Liability created successfully',
      liability,
    };
  }

  @Get()
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find all liabilities (Officer/Admin Only)' })
  @ApiQuery({ type: QueryLiabilityDto })
  @ApiResponse({
    status: 200,
    description: 'A list of liabilities.',
    type: [Liability],
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  async findAll(
    @Query() queryDto: QueryLiabilityDto,
  ): Promise<Liability[]> {
    return this.liabilityService.findAllLiabilities(queryDto);
  }

  @Get(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Find one liability by ID (Officer/Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'Liability retrieved successfully',
    type: LiabilityResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  async findOne(@Param('id') id: string): Promise<LiabilityResponseDto> {
    const liability = await this.liabilityService.findLiabilityById(Number(id));
    return {
      message: 'Liability retrieved successfully',
      liability,
    };
  }

  @Patch(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a liability (Officer/Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'Liability updated successfully',
    type: LiabilityResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLiabilityDto: UpdateLiabilityDto,
  ): Promise<LiabilityResponseDto> {
    const updatedLiability = await this.liabilityService.updateLiability(
      Number(id),
      updateLiabilityDto,
    );
    return {
      message: 'Liability updated successfully',
      liability: updatedLiability,
    };
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