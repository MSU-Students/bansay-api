import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LiabilityType } from '../types/liability-type.type';
import { LiabilityStatus } from '../types/liability-status.type';
import { ApiProperty } from '@nestjs/swagger';

@Entity('liabilities')
@Index(['student'])
@Index(['issuer'])
@Index(['student', 'status'])
@Index(['status'])
@Index(['dueDate'])
export class Liability {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.studentLiabilities)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.issuedLiabilities)
  @JoinColumn({ name: 'issuer_id' })
  issuer: User;

  @ApiProperty({ enum: LiabilityType, example: LiabilityType.FINE })
  @Column({
    type: 'enum',
    enum: LiabilityType,
    enumName: 'liability_type_enum',
    default: LiabilityType.FINE,
  })
  type: LiabilityType;

  @ApiProperty({ example: 150.75 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ enum: LiabilityStatus, example: LiabilityStatus.UNPAID })
  @Column({
    type: 'enum',
    enum: LiabilityStatus,
    enumName: 'liability_status_enum',
    default: LiabilityStatus.UNPAID,
  })
  status: LiabilityStatus;

  @ApiProperty({ example: '2025-12-31' })
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', select: false })
  deletedAt: Date;
}