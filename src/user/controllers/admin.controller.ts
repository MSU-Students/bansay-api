import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { StudentDto } from '../dto/student.dto';
import { OfficerDto } from '../dto/officer.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('pending-registrations-count')
  getPendingCount() {
    return this.adminService.getPendingCount();
  }

  @Get()
  findAll(): Promise<{ students: StudentDto[]; officers: OfficerDto[] }> {
    return this.adminService.findAll();
  }
}
