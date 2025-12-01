import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsUrl,
  IsDateString,
  IsString,
} from 'class-validator';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { User } from '@bansay/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../types/payment-status.type';

@Entity('payments')
@Index(['liability'])
@Index(['student'])
@Index(['status'])
@Index(['paymentDate'])
@Index(['student', 'status'])
@Index(['liability', 'status'])
@Index(['referenceNumber'], { unique: true })
export class Payment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Liability })
  @ManyToOne(() => Liability, (liability) => liability.payments, {
    nullable: false,
  })
  @JoinColumn({ name: 'liability_id' })
  liability: Liability;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.payments, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ApiProperty({
    example: 'PAY-2024-001',
    description: 'Unique payment reference number',
  })
  @Column({
    name: 'reference_number',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  @IsString()
  referenceNumber: string;

  @ApiProperty({ example: 150.75, description: 'Amount paid' })
  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({
    example: 'https://example.com/payment-receipt.pdf',
    description: 'URL to payment proof',
  })
  @Column({ name: 'proof_url', type: 'varchar', length: 500 })
  @IsUrl()
  proofUrl: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date when payment was made',
  })
  @Column({ name: 'payment_date', type: 'timestamptz' })
  @IsDateString()
  paymentDate: Date;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING_VERIFICATION,
    description: 'Payment status',
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'payment_status_enum',
    default: PaymentStatus.PENDING_VERIFICATION,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', select: false })
  deletedAt: Date;
}
