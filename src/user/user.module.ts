import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { OfficerController } from './controllers/officer.controller';
import { StudentService } from './services/student.service';
import { OfficerService } from './services/officer.service';

@Module({
    controllers: [StudentController, OfficerController],
    providers: [StudentService, OfficerService]
})
export class UserModule {

}