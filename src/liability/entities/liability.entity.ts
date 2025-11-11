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

@Entity('liabilities')
@Index(['student'])
@Index(['issuer'])
@Index(['student', 'status'])
@Index(['status'])
@Index(['dueDate'])
export class Liability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentLiabilities)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => User, (user) => user.issuedLiabilities)
  @JoinColumn({ name: 'issuer_id' })
  issuer: User;

  @Column({
    type: 'enum',
    enum: LiabilityType,
    enumName: 'liability_type_enum',
    default: LiabilityType.TUITION,
  })
  type: LiabilityType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: LiabilityStatus,
    enumName: 'liability_status_enum',
    default: LiabilityStatus.UNPAID,
  })
  status: LiabilityStatus;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    default: null,
  })
  deletedAt?: Date;
}
