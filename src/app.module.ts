import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LiabilityModule } from './liability/liability.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './user/entities/student.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { User } from './user/entities/user.entity';
import { Officer } from './user/entities/officer.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { Liability } from './liability/entities/liability.entity';
import { Appeal } from './appeal/entities/appeal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isLocal =
          configService.get<string>('environment') === 'development';
        return {
          type: 'postgres',
          host: configService.get('database.host') || 'localhost',
          port: configService.get('database.port') || 5432,
          username: configService.get('database.username') || 'user',
          password: configService.get('database.password') || 'password',
          database: configService.get('database.dbName') || 'bansay_db',
          entities: [Student, User, Officer, Liability, Appeal],
          synchronize: true,
          // extra: isLocal
          //   ? undefined
          //   : {
          //       ssl: {
          //         rejectUnauthorized: false,
          //       },
          //     },
        };
      },
      inject: [ConfigService],
    }),
    LiabilityModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
