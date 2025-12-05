import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
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
import { QueryPaymentDto } from '../dto/query-payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit a proof of payment for a liability' })
  @ApiResponse({
    status: 201,
    description: 'Payment proof submitted successfully',
    type: Payment,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (Amount mismatch or Liability already paid)',
  })
  @ApiResponse({ status: 404, description: 'Liability not found' })
  @ApiResponse({ status: 409, description: 'Reference number already exists' })
  async submitPayment(
    @GetUser() user: JwtPayload,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.createPayment(user, createPaymentDto);
  }

  @Get()
  @Roles(UserRole.OFFICER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all payments (Officer only)',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
  })
  getPayment(@Query() query: QueryPaymentDto) {
    return this.paymentService.getPayments(query);
  }
}
