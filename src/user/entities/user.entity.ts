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
import { Liability } from '@bansay/liability/entities/liability.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
@Index(['role', 'status'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123456' })
  @Column({ type: 'varchar', length: 64 })
  username: string;

  @ApiProperty({ example: 'John' })
  @Column({ type: 'varchar', length: 64, name: 'first_name' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ type: 'varchar', length: 64, name: 'last_name' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@university.edu' })
  @Column({ type: 'varchar', length: 254 })
  email: string;

  // NO @ApiProperty on password! This is correct.
  @Column({ type: 'varchar', length: 128, select: false })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
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

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}