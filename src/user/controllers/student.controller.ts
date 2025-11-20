import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StudentService } from '@bansay/user/services/student.service';
import { StudentRegistrationDto } from '../dto/student-registration.dto';
import { StudentDto } from '../dto/student.dto';
import { StudentPatchDto } from '../dto/student-patch.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('students')
export class StudentController {
  constructor(private service: StudentService) {}
  @Post()
  create(@Body() student: StudentRegistrationDto) {
    return this.service.create(student);
  }

  @Get()
  @ApiResponse({
    type: [StudentDto],
  })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  patchStudent(@Param('id') id: string, @Body() patchDto: StudentPatchDto) {
    return this.service.patch(id, patchDto.field, patchDto.value);
  }

  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
