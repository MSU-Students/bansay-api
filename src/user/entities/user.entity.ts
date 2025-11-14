import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../interfaces/user-role.enum';
import { UserStatus } from '../interfaces/user-status.enum';
import { Liability } from 'src/liability/entities/liability.entity';

@Entity('users')
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
@Index(['role', 'status'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  username: string; // student_id or staff_id

  @Column({ type: 'varchar', length: 64, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 64, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 128, select: false })
  password: string; // hashed password

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    enumName: 'user_status_enum',
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @OneToMany(() => Liability, (liability) => liability.student, {
    cascade: ['soft-remove', 'recover'],
  })
  studentLiabilities: Liability[];

  @OneToMany(() => Liability, (liability) => liability.issuer)
  issuedLiabilities: Liability[];

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
