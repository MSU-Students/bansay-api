import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';

export class PaymentListDto {
    @ApiProperty({type: [Payment]})
    data: Payment[];
    @ApiProperty()
    count: number;
}