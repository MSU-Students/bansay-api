import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './entities/appeal.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { AppealService } from './services/appeal.service';
import { AppealController } from './controllers/appeal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appeal, Liability])],
  providers: [AppealService],
  controllers: [AppealController],
})
export class AppealModule {}
