import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { Payment } from './entities/payment.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Liability])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
