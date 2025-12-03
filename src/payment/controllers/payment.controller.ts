import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { GetUser } from '@bansay/auth/decorators/get-user.decorator';
import type { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { Roles } from '@bansay/auth/decorators/role.decorator';
import { UserRole } from '@bansay/user/interfaces/user-role.enum';
import { Payment } from '../entities/payment.entity';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('my/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a payment proof for a liability' })
  @ApiResponse({
    status: 201,
    description: 'Payment submitted successfully',
    type: Payment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Liability already paid OR Amount mismatch',
  })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  async create(
    @GetUser() user: JwtPayload,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.create(user, createPaymentDto);
  }
}
