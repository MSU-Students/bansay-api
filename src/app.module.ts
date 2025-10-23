import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StudentController } from './user/controllers/student.controller';
import { AppService } from './app.service';
import { StudentService } from './user/services/student.service';
import { OfficerController } from './user/controllers/officer.controller';
import { OfficerService } from './user/services/officer.service';
import { LiabilityModule } from './liability/liability.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './user/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'bansay_db',
      entities: [Student],
      synchronize: true,
    }),
    LiabilityModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
