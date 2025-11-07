import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { OfficerController } from './controllers/officer.controller';
import { StudentService } from './services/student.service';
import { OfficerService } from './services/officer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { Officer } from './entities/officer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Student, Officer])],
    controllers: [StudentController, OfficerController, AdminController],
    providers: [StudentService, OfficerService, AdminService],
})
export class UserModule {}
