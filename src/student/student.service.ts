import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
    findAll(): string[] {
        return ['Luffy', 'Zoro', 'Usop'];
    }
}