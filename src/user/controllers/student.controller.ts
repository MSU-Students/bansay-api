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
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('students')
@ApiTags('Students')
@ApiBearerAuth()
export class StudentController {
  constructor(private service: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a student' })
  create(@Body() student: StudentRegistrationDto) {
    return this.service.create(student);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    type: [StudentDto],
  })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  patchStudent(@Param('id') id: string, @Body() patchDto: StudentPatchDto) {
    return this.service.patch(id, patchDto.field, patchDto.value);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  deleteStudent(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
