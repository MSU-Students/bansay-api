import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { Payment } from './entities/payment.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { User } from '@bansay/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Liability, User])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
