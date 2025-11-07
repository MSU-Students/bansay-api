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

@Module({
  imports: [TypeOrmModule.forFeature([Student, User])],
  controllers: [StudentController, OfficerController, UserController],
  providers: [StudentService, OfficerService, UserService],
})
export class UserModule {}
