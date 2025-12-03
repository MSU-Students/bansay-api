import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { User } from '@bansay/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The liability being paid' })
  @ManyToOne(() => Liability)
  @JoinColumn({ name: 'liability_id' })
  liability: Liability;

  @ApiProperty({ description: 'The student making the payment' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ApiProperty({ example: 'REF123456789' })
  @Column({ name: 'reference_number', type: 'varchar', length: 100 })
  referenceNumber: string;

  @ApiProperty({ example: 'https://bucket.s3.aws.com/proof.jpg' })
  @Column({ name: 'proof_url', type: 'text' })
  proofUrl: string;

  @ApiProperty({ example: 150.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
