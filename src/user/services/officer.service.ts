import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from '../entities/officer.entity';
import { OfficerDto } from '../dto/officer.dto';

@Injectable()
export class OfficerService {
    constructor(@InjectRepository(Officer) private repo: Repository<Officer>) {}

    async findAll(): Promise<OfficerDto[]> {
        return (await this.repo.find()).map((record) => {
            return {
                id: record.id,
                email: record.email,
                idNumber: record.idNumber,
                fullName: `${record.firstName} ${record.middleName} ${record.lastName}`,
            };
        });
    }
}
