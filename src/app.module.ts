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
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('database.host') || 'localhost',
          port: configService.get('database.port') || 5432,
          username: configService.get('database.username') || 'user',
          password: configService.get('database.password') || 'password',
          database: configService.get('database.dbName') || 'bansay_db',
          entities: [Student, User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    LiabilityModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
