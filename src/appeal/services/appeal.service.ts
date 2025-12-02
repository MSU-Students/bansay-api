import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appeal } from '../entities/appeal.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private readonly appealRepository: Repository<Appeal>,
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
  ) {}
}
