import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { LiabilityStatus } from '@bansay/liability/types/liability-status.type';
import { PaymentStatus } from '../types/payment-status.type';
import { User } from '@bansay/user/entities/user.entity';
import { QueryPaymentDto } from '../dto/query-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Liability)
    private liabilityRepository: Repository<Liability>,
  ) {}

  async createPayment(
    user: JwtPayload,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const { liabilityId, amountPaid, referenceNumber, proofUrl, paymentDate } =
      createPaymentDto;

    const liability = await this.liabilityRepository.findOne({
      where: { id: liabilityId },
      relations: ['student'],
    });

    if (!liability) {
      throw new NotFoundException('Liability not found');
    }

    if (liability.student.id !== Number(user.userId)) {
      throw new ForbiddenException(
        'You are not authorized to pay for this liability',
      );
    }

    if (
      liability.status === LiabilityStatus.PAID ||
      liability.status === LiabilityStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot pay for a liability that is ${liability.status}`,
      );
    }

    if (Number(liability.amount) !== Number(amountPaid)) {
      throw new BadRequestException(
        `Amount paid (${amountPaid}) must match the liability amount (${liability.amount}) exactly.`,
      );
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { referenceNumber },
    });
    if (existingPayment) {
      throw new ConflictException(
        'This reference number has already been submitted.',
      );
    }

    const studentRef = { id: Number(user.userId) } as User;

    const payment = this.paymentRepository.create({
      liability,
      student: studentRef,
      referenceNumber,
      amountPaid,
      proofUrl,
      paymentDate: new Date(paymentDate),
      status: PaymentStatus.PENDING_VERIFICATION,
    });

    return await this.paymentRepository.save(payment);
  }

  async getPayments(queryDto: QueryPaymentDto) {
    const { referenceNumber, status } = queryDto;

    const where: FindOptionsWhere<Payment> = {};
    if (referenceNumber) where.referenceNumber = referenceNumber;
    if (status) where.status = status;

    try {
      const payments = await this.paymentRepository.find({
        where,
        select: [
          'amountPaid',
          'createdAt',
          'id',
          'liability',
          'paymentDate',
          'proofUrl',
          'referenceNumber',
          'status',
          'student',
        ],
        relations: {
          liability: true,
          student: true,
        },
      });

      return {
        data: payments,
        count: payments.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatePayment(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: {
          liability: true,
        },
      });

      if (!payment)
        throw new NotFoundException(`Payment with ID ${id} not found`);

      if (updatePaymentDto.status) {
        if (updatePaymentDto.status === PaymentStatus.VERIFIED) {
          const liability = await this.liabilityRepository.findOne({
            where: { id: payment.liability.id },
          });

          if (!liability)
            throw new NotFoundException(
              `Liability with ID ${payment.liability.id} not found`,
            );
          try {
            liability.status = LiabilityStatus.PAID;
            await this.liabilityRepository.save(liability);
          } catch (error) {
            throw new BadRequestException(
              `Failed to update liability: ${error}`,
            );
          }
          payment.status = PaymentStatus.VERIFIED;
        } else payment.status = updatePaymentDto.status;
      }

      await this.paymentRepository.save(payment);
      return await this.paymentRepository.findOne({
        where: { id: payment.id },
        relations: {
          liability: true,
          student: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update payment', error);
    }
  }
}
