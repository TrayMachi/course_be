import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { RegisterStudentDto, UpdateStudentDto } from './student.dto';
import { AccessTokenGuard } from 'src/auth/auth.guard';

@Controller('student')
@UseGuards(AccessTokenGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterStudentDto, @Req() req) {
    if (req.user.role !== 'GUEST') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only GUEST users can register students',
      });
    }
    const student = await this.studentService.registerStudent(body);
    return this.responseUtil.response(
      {
        code: HttpStatus.CREATED,
        message: 'Student registered successfully',
      },
      { data: student },
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'STUDENT') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only STUDENT users request',
      });
    }
    const student = await this.studentService.getStudentById(id);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Student fetched successfully',
      },
      { data: student },
    );
  }

  @Get('course/:courseId')
  async getByCourse(@Param('courseId') courseId: string) {
    const students = await this.studentService.getStudentByCourseId(courseId);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Students fetched successfully',
      },
      { data: students },
    );
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateStudentDto,
    @Req() req,
  ) {
    if (req.user.role !== 'STUDENT') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only STUDENT users request',
      });
    }
    const student = await this.studentService.updateStudent(id, body);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Student updated successfully',
      },
      { data: student },
    );
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Req() req,) {
    if (req.user.role !== 'STUDENT') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only STUDENT users request',
      });
    }
    await this.studentService.deleteStudent(id);
    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: 'Student deleted successfully',
    });
  }
}
