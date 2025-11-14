import { Module } from '@nestjs/common';
import { LiabilityController } from './controllers/liability.controller';
import { LiabilityService } from './services/liability.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liability } from './entities/liability.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Liability, User])],
  controllers: [LiabilityController],
  providers: [LiabilityService],
})
export class LiabilityModule {}
