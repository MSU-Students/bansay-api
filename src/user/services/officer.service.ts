import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from '../entities/officer.entity';
import { OfficerDto } from '../dto/officer.dto';

@Injectable()
export class OfficerService {
  constructor(@InjectRepository(Officer) private repo: Repository<Officer>) {}

  async create(officer: OfficerDto) {
    const record = this.repo.create({
      email: officer.email,
      idNumber: officer.idNumber,
      firstName: officer.firstName,
      lastName: officer.lastName,
    });
    return await this.repo.save(record);
  }

  async findAll(): Promise<OfficerDto[]> {
    return (await this.repo.find()).map((record) => {
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
