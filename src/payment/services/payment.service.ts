import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { LiabilityStatus } from '@bansay/liability/types/liability-status.type';
import { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { User } from '@bansay/user/entities/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Liability)
    private liabilityRepo: Repository<Liability>,
  ) {}

  async create(user: JwtPayload, dto: CreatePaymentDto): Promise<Payment> {
    const liability = await this.liabilityRepo.findOne({
      where: { id: dto.liabilityId },
      relations: ['student'],
    });

    if (!liability) {
      throw new NotFoundException('Liability not found');
    }

    if (liability.student.id !== Number(user.userId)) {
      throw new ForbiddenException('You can only pay for your own liabilities');
    }

    if (
      liability.status === LiabilityStatus.PAID ||
      liability.status === LiabilityStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot pay a liability that is ${liability.status}`,
      );
    }

    if (Number(dto.amount) !== Number(liability.amount)) {
      throw new BadRequestException(
        `Payment amount (${dto.amount}) must match liability amount (${liability.amount}) exactly.`,
      );
    }

    const studentRef = { id: Number(user.userId) } as User;

    const payment = this.paymentRepo.create({
      amount: dto.amount,
      referenceNumber: dto.referenceNumber,
      proofUrl: dto.proofUrl,
      liability: liability,
      student: studentRef,
    });

    return await this.paymentRepo.save(payment);
  }
}
