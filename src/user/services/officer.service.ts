import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from '../entities/officer.entity';
import { OfficerDto } from '../dto/officer.dto';

@Injectable()
export class OfficerService {
  constructor(@InjectRepository(Officer) private repo: Repository<Officer>) {}
  async create(officer: OfficerDto) {
    // Check if officer already exists
    const existing = await this.repo.findOne({
      where: { idNumber: officer.idNumber },
    });

    if (existing) {
      return existing;
    }

    const record = this.repo.create({
      email: officer.email,
      idNumber: officer.idNumber,
      firstName: officer.firstName,
      lastName: officer.lastName,
    });
    return await this.repo.save(record);
  }

  async findAll(filter?: Partial<OfficerDto>): Promise<OfficerDto[]> {
    const result = filter ?   (await this.repo.find({
      where: filter
    })):  (await this.repo.find());
    return result.map((record) => {
      return {
        id: record.id,
        email: record.email,
        idNumber: record.idNumber,
        firstName: record.firstName,
        lastName: record.lastName,
        middleName: record.middleName,
      };
    });
  }
}
