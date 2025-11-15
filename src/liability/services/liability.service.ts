import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Liability } from '../entities/liability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateLiabilityDto } from '../dto/create-liability.dto';
import { UpdateLiabilityDto } from '../dto/update-liability.dto';

@Injectable()
export class LiabilityService {
  constructor(
    @InjectRepository(Liability)
    private liabilityRepository: Repository<Liability>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createLiability(
    createLiability: CreateLiabilityDto,
    issuerId: number,
  ): Promise<any> {
    const { studentId, amount, type, dueDate } = createLiability;

    const student = await this.userRepository.findOneBy({
      username: String(studentId),
    });

    if (!student)
      throw new NotFoundException(`Student with ID ${studentId} not found`);

    const issuer = await this.userRepository.findOneBy({
      id: issuerId,
    });

    if (!issuer)
      throw new NotFoundException(`Issuer with ID ${issuerId} not found`);

    try {
      const liability = this.liabilityRepository.create({
        student,
        issuer,
        amount,
        type,
        dueDate: new Date(dueDate),
      });

      const savedLiability = await this.liabilityRepository.save(liability);

      return await this.liabilityRepository.findOne({
        where: { id: savedLiability.id },
        relations: ['student', 'issuer'],
      });
    } catch (error) {
      throw new BadRequestException(`Failed to create liability: ${error}`);
    }
  }

  async findLiabilityById(id: number): Promise<Liability> {
    const liability = await this.liabilityRepository.findOne({
      where: { id },
      relations: ['student', 'issuer'],
    });

    if (!liability)
      throw new NotFoundException(`Liability with ID ${id} not found`);

    return liability;
  }

  async updateLiability(
    id: number,
    updateLiabilityDto: UpdateLiabilityDto,
  ): Promise<Liability> {
    const liability = await this.liabilityRepository.preload({
      id: id,
      ...updateLiabilityDto,
      ...(updateLiabilityDto.dueDate && {
        dueDate: new Date(updateLiabilityDto.dueDate),
      }),
    });

    if (!liability) {
      throw new NotFoundException(`Liability with ID ${id} not found`);
    }

    try {
      return await this.liabilityRepository.save(liability);
    } catch (error) {
      throw new BadRequestException(`Failed to update liability: ${error}`);
    }
  }
}
