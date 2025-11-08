import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { OfficerController } from './controllers/officer.controller';
import { StudentService } from './services/student.service';
import { OfficerService } from './services/officer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { Officer } from './entities/officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Officer])],
  controllers: [
    StudentController,
    OfficerController,
    UserController,
    AdminController,
  ],
  providers: [StudentService, OfficerService, UserService, AdminService],
})
export class UserModule {}
