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
import { IsEnum, IsUrl, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { User } from '@bansay/user/entities/user.entity';
import { AppealReasonType } from '../types/appeal-reason.type';
import { AppealStatus } from '../types/appeal-status.type';

@Entity('appeal')
@Index(['liability'])
@Index(['student'])
@Index(['status'])
@Index(['createdAt'])
export class Appeal {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Liability })
  @ManyToOne(() => Liability, (liability) => liability.appeals, {
    nullable: true,
  })
  @JoinColumn({ name: 'liability_id' })
  liability: Liability;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.appeals, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ApiProperty({
    enum: AppealReasonType,
    example: AppealReasonType.VALID_EXCUSE,
  })
  @Column({
    type: 'enum',
    enum: AppealReasonType,
    enumName: 'appeal_reason_type_enum',
    name: 'reason_type',
  })
  @IsEnum(AppealReasonType)
  reasonType: AppealReasonType;

  @ApiProperty({
    example: 'Additional details about the appeal',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({ example: 'https://example.com/proof.pdf', required: false })
  @Column({ name: 'proof_url', type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  @IsOptional()
  proofUrl?: string;

  @ApiProperty({ enum: AppealStatus, example: AppealStatus.PENDING })
  @Column({
    type: 'enum',
    enum: AppealStatus,
    enumName: 'appeal_status_enum',
    default: AppealStatus.PENDING,
  })
  @IsEnum(AppealStatus)
  status: AppealStatus;

  @ApiProperty({
    required: false,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.rejectedAppeals, { nullable: true })
  @JoinColumn({ name: 'rejectedBy' })
  rejectedBy: User;

  @ApiProperty({
    required: false,
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'rejected_at' })
  rejectedAt: Date;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
