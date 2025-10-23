import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { OfficerController } from './controllers/officer.controller';
import { StudentService } from './services/student.service';
import { OfficerService } from './services/officer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Student])],
    controllers: [StudentController, OfficerController],
    providers: [StudentService, OfficerService]
})
export class UserModule {

}