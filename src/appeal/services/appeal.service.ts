import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appeal } from '../entities/appeal.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { Repository } from 'typeorm';
import { SubmitAppealDto } from '../dto/submit-appeal.dto';
import { AppealStatus } from '../types/appeal-status.type';

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private readonly appealRepository: Repository<Appeal>,
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
  ) {}

  async submitAppeal(
    studentId: number,
    submitAppealDto: SubmitAppealDto,
  ): Promise<Appeal> {
    const liability = await this.liabilityRepository.findOne({
      where: { id: submitAppealDto.liabilityId },
      relations: ['student'],
    });

    if (!liability)
      throw new NotFoundException(
        `Liability with ID ${submitAppealDto.liabilityId} not found`,
      );

    if (liability.student.id !== studentId)
      throw new ForbiddenException(
        'You can only submit appeals for your own liabilities',
      );

    const appeal = this.appealRepository.create({
      ...submitAppealDto,
      liability: { id: submitAppealDto.liabilityId },
      student: { id: studentId },
      status: AppealStatus.PENDING,
    });

    return await this.appealRepository.save(appeal);
  }
}
