import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appeal } from '../entities/appeal.entity';
import { Liability } from '@bansay/liability/entities/liability.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SubmitAppealDto } from '../dto/submit-appeal.dto';
import { AppealStatus } from '../types/appeal-status.type';
import { LiabilityStatus } from '@bansay/liability/types/liability-status.type';
import { AppealPatchDto } from '../dto/patch-appeal.dto';
import { QueryAppealDto } from '../dto/query-appeal.dto';
import { JwtPayload } from '@bansay/auth/types/jwt-payload.interface';
import { User } from '@bansay/user/entities/user.entity';

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private readonly appealRepository: Repository<Appeal>,
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    if (
      liability.status == LiabilityStatus.PAID ||
      liability.status == LiabilityStatus.CANCELLED
    )
      throw new BadRequestException('Cannot appeal a cleared liability');

    const pendingAppeal = await this.appealRepository.findOne({
      where: { liability: { id: submitAppealDto.liabilityId } },
      relations: ['liability'],
    });

    if (pendingAppeal)
      throw new ConflictException('Appeal already exists for this liability');

    const appeal = this.appealRepository.create({
      ...submitAppealDto,
      liability: { id: submitAppealDto.liabilityId },
      student: { id: studentId },
      status: AppealStatus.PENDING,
    });

    return await this.appealRepository.save(appeal);
  }

  async patch(officer: JwtPayload, id: number, appealPatchDto: AppealPatchDto) {
    const appeal = await this.appealRepository.preload({
      id,
      ...appealPatchDto,
    });

    if (!appeal) throw new NotFoundException('Appeal not found.');

    if (appealPatchDto.status === AppealStatus.APPROVED && appeal.liability) {
      await this.liabilityRepository.update(appeal.liability.id, {
        status: LiabilityStatus.CANCELLED,
      });
    }
    // Rejecting appeal
    else if (
      appeal.status === AppealStatus.PENDING &&
      appealPatchDto.status === AppealStatus.REJECTED
    ) {
      const rejecter = await this.userRepository.findOneBy({
        id: officer.userId,
      });

      if (!rejecter)
        throw new NotFoundException(
          `Rejecting Officer with ID ${officer.userId} not found`,
        );
      try {
        await this.liabilityRepository.update(appeal.liability.id, {
          status: LiabilityStatus.UNPAID,
        });

        appeal.rejectedBy = rejecter;
        appeal.rejectedAt = new Date();
      } catch (error) {
        throw new BadRequestException(`Failed to reject appeal: ${error}`);
      }
    }

    try {
      await this.appealRepository.save(appeal);

      return this.appealRepository.findOne({
        where: { id },
        relations: {
          liability: true,
          rejectedBy: true,
          student: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to update appeal: ${error}`);
    }
  }

  async getAppeals(queryDto: QueryAppealDto) {
    const { status } = queryDto;

    const where: FindOptionsWhere<Appeal> = {};
    if (status) where.status = status;

    try {
      const appeals = await this.appealRepository.find({
        where,
        relations: {
          liability: true,
          student: true,
          rejectedBy: true,
        },
      });

      return {
        data: appeals,
        count: appeals.length,
      };
    } catch {
      throw new BadRequestException('Invalid query parameters');
    }
  }

  async getAppealById(id: number) {
    try {
      const appeal = await this.appealRepository.findOne({
        where: { id },
        relations: {
          liability: true,
          student: true,
        },
      });

      if (!appeal)
        throw new NotFoundException(`Appeal with ID ${id} not found`);

      return appeal;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
